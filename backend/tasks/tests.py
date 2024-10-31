from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Task


class TaskModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')

    def test_create_task(self):
        task = Task.objects.create(
            title='Minha primeira tarefa',
            description='Esta é uma tarefa criada somente para teste',
            user=self.user
        )
        self.assertEqual(task.title, 'Minha primeira tarefa')
        self.assertFalse(task.is_completed)
        self.assertEqual(task.user.username, 'testuser')


class TaskAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.client.login(username='testuser', password='12345')

    def test_create_task(self):
        url = reverse('task-list')
        data = {'title': 'New Task', 'description': 'Task description'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)