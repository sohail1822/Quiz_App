from django.contrib import admin
from .models import Quiz, Question,QuizAttempt,QuizQuestion, QuestionOption
# Register your models here.

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(QuizAttempt)
admin.site.register(QuizQuestion)
admin.site.register(QuestionOption)

