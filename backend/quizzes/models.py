from django.db import models
from Account.model import User

class Quiz(models.Model):
    Title = models.CharField(max_length=255)
    Author = models.ForeignKey(User, on_delete=models.CASCADE,null=True,blank=True)
    Question_number = models.IntegerField()
    Total_Score = models.IntegerField()
    Duration = models.IntegerField(help_text="Duration in minutes")
    Created_At = models.DateTimeField(auto_now_add=True)
    Updated_At = models.DateTimeField(auto_now=True)

class Question(models.Model):
    question = models.TextField()
    Created_At = models.DateTimeField(auto_now_add=True)
    Updated_At = models.DateTimeField(auto_now=True)

class QuestionOption(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option = models.TextField()
    is_correct = models.BooleanField(default=False)

class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='quiz_questions')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    question_number = models.IntegerField()
    marks = models.IntegerField()

class QuizAttempt(models.Model):
    STATUS_CHOICES = (
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    score = models.IntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

class QuestionResponse(models.Model):
    quiz_attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(QuestionOption, on_delete=models.CASCADE, null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    marks_obtained = models.IntegerField(default=0)