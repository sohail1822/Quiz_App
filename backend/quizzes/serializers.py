from rest_framework import serializers
from .models import Quiz, Question, QuestionOption, QuizQuestion, QuizAttempt, QuestionResponse
from django.db import models

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'option', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'question', 'options']

class QuizQuestionSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()

    class Meta:
        model = QuizQuestion
        fields = ['id', 'quiz', 'question', 'question_number', 'marks']

class QuizSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'num_questions', 'total_score', 'duration', 'questions']

    def get_questions(self, obj):
        quiz_questions = QuizQuestion.objects.filter(quiz=obj).select_related('question')
        return [
            {
                "id": qq.question.id,
                "text": qq.question.question,
                "options": [
                    {"id": opt.id, "text": opt.option, "is_correct": opt.is_correct}
                    for opt in qq.question.options.all()
                ],
                "marks": qq.marks,
            }
            for qq in quiz_questions
        ]


class QuizAttemptSerializer(serializers.ModelSerializer):
    total_score = serializers.SerializerMethodField()
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'user', 'status', 'score', 'total_score', 'started_at', 'completed_at','username']

    def get_total_score(self, obj):
        return QuizQuestion.objects.filter(quiz=obj.quiz).aggregate(total_marks=models.Sum('marks'))['total_marks'] or 0

class QuestionResponseSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()
    selected_option = QuestionOptionSerializer()

    class Meta:
        model = QuestionResponse
        fields = ['id', 'question', 'selected_option', 'is_correct', 'marks_obtained']
