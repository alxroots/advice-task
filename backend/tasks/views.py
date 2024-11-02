from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Task, Category
from .serializers import TaskSerializer, CategorySerializer, RegisterSerializer, UserSerializer
from django_filters.rest_framework import DjangoFilterBackend


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_completed', 'category']

    def get_queryset(self):
        return Task.objects.filter(Q(user=self.request.user) | Q(shared_with=self.request.user))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=True, methods=['delete'])
    def delete_user(self, request, pk=None):
        try:
            user = self.get_object()
            user.delete()
            return Response(status=204)
        except User.DoesNotExist:
            return Response(status=404)