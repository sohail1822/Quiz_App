from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Quiz, Question, QuizQuestion, QuizAttempt, QuestionResponse
from .serializers import QuizSerializer, QuizAttemptSerializer, QuestionResponseSerializer
from django.db import transaction, models

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.prefetch_related('quiz_questions__question__options')
    serializer_class = QuizSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def add_question(self, request, pk=None):
        quiz = self.get_object()
        print(request.data)
        question = Question.objects.create(question=request.data['question'])
        for opt in request.data.get('options', []):
            question.options.create(option=opt['option'], is_correct=opt['is_correct'])
        QuizQuestion.objects.create(quiz=quiz, question=question, question_number=request.data['number'], marks=request.data['marks'])
        return Response({"message": "Questions added successfully"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        attempts = QuizAttempt.objects.filter(quiz_id=pk).order_by('-score')
        return Response(QuizAttemptSerializer(attempts, many=True).data)

    # @action(detail=True, methods=['get'])
    # def user_response(self, request, pk=None):
    #     attempt = QuizAttempt.objects.filter(quiz_id=pk, user=request.user).first()
    #     if not attempt or attempt.status != 'completed':
    #         return Response({"detail": "No completed quiz attempt found"}, status=status.HTTP_404_NOT_FOUND)
    #     return Response(QuestionResponseSerializer(attempt.responses.all(), many=True).data)  
    
    @action(detail=True, methods=['get'],url_path='response/(?P<participant_id>[^/.]+)')
    def user_response(self, request, pk=None, participant_id=None):
        # Check if the quiz exists and belongs to the admin
        quiz = self.get_object()
        if not request.user.is_admin:
            return Response({"detail": "You do not have permission to view this."}, status=status.HTTP_403_FORBIDDEN)

        # Fetch participant's attempt
        attempt = QuizAttempt.objects.filter(quiz=quiz, user_id=participant_id, status='completed').first()
        if not attempt:
            return Response({"detail": "No completed quiz attempt found"}, status=status.HTTP_404_NOT_FOUND)

        # Get total achievable score
        total_score = QuizQuestion.objects.filter(quiz=quiz).aggregate(total_marks=models.Sum('marks'))['total_marks'] or 0

        return Response({
            "attempt_id": attempt.id,
            "quiz_id": attempt.quiz.id,
            "quiz_title": attempt.quiz.title,
            "total_score": total_score,
            "score_obtained": attempt.score,
            "responses": QuestionResponseSerializer(attempt.responses.all(), many=True).data
        })
 
    
    
    
    
class UserQuizViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        user = request.user
        user_attempts = QuizAttempt.objects.filter(user=user)
        attempted_quiz_ids = user_attempts.values_list('quiz_id', flat=True)

        all_quizzes = Quiz.objects.all()

        result = []
        for quiz in all_quizzes:
            status = "Start"
            attempt = user_attempts.filter(quiz=quiz).first()
            
            if attempt:
                if attempt.status == 'completed':
                    status = "View Score"
                else:
                    status = "Resume"
            
            result.append({
                "id": quiz.id,
                "title": quiz.title,
                "status": status,
                "attempt_id": attempt.id if attempt else None
            })
        
        return Response(result)

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        quiz = Quiz.objects.filter(id=pk).first()
        if not quiz:
            return Response({"detail": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            # Check if an attempt already exists
            attempt = QuizAttempt.objects.filter(user=request.user, quiz=quiz).order_by('-started_at').first()

            # If an attempt exists and is completed, return the same attempt
            if attempt and attempt.status == 'completed':
                return Response({"detail": "You have already completed this quiz.", "attempt_id": attempt.id})

            # If no attempt exists or it's not completed, allow resuming
            if not attempt or attempt.status == 'in_progress':
                if not attempt:
                    attempt = QuizAttempt.objects.create(user=request.user, quiz=quiz, status='in_progress')

        questions = QuizQuestion.objects.filter(quiz=quiz).select_related('question')

        response_data = {
            "attempt_id": attempt.id,
            "quiz_id": quiz.id,
            "title": quiz.title,
            "duration": quiz.duration,
            "questions": [
                {
                    "id": q.question.id,
                    "text": q.question.question,
                    "options": [{"id": opt.id, "text": opt.option} for opt in q.question.options.all()],
                    "marks": q.marks
                }
                for q in questions
            ]
        }
        return Response(response_data)


    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        attempt = QuizAttempt.objects.filter(id=pk, user=request.user).first()
        if not attempt or attempt.status == 'completed':
            return Response({"detail": "Invalid quiz attempt"}, status=status.HTTP_400_BAD_REQUEST)
        
        responses = request.data.get('responses', [])
        print(responses)
        total_score = 0

        for qId,oId in responses.items():
            question = Question.objects.filter(id=qId).first()
            selected_option = question.options.filter(id=oId).first() if question else None
            correct_option = question.options.filter(is_correct=True).first() if question else None
            is_correct = selected_option == correct_option if selected_option else False
            marks_obtained = QuizQuestion.objects.get(quiz=attempt.quiz, question=question).marks if is_correct else 0

            QuestionResponse.objects.update_or_create(
                quiz_attempt=attempt,
                question=question,
                defaults={'selected_option': selected_option, 'is_correct': is_correct, 'marks_obtained': marks_obtained}
            )

            total_score += marks_obtained

        attempt.status = 'completed'
        attempt.score = total_score
        attempt.completed_at = timezone.now()
        attempt.save()

        return Response({"message": "Quiz submitted successfully", "score": total_score, "total": attempt.quiz.total_score})

    @action(detail=True, methods=['get'])
    def response(self, request, pk=None):
        attempt = QuizAttempt.objects.filter(id=pk, user=request.user, status='completed').first()

        if not attempt:
            return Response({"detail": "No completed quiz attempt found"}, status=status.HTTP_404_NOT_FOUND)

        # Get total achievable score
        total_score = QuizQuestion.objects.filter(quiz=attempt.quiz).aggregate(total_marks=models.Sum('marks'))['total_marks'] or 0

        return Response({
            "attempt_id": attempt.id,
            "quiz_id": attempt.quiz.id,
            "quiz_title": attempt.quiz.title,
            "total_score": total_score,
            "score_obtained": attempt.score,
            "responses": QuestionResponseSerializer(attempt.responses.all(), many=True).data
        })