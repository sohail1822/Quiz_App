# Generated by Django 5.1.6 on 2025-02-15 10:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0002_question_quiz_quiz_auther'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='quiz',
        ),
    ]
