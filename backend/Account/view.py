from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .model import User
from .serializer import UserSerializer, RegistrationSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'user'
    
    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User created successfully",
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """ Custom serializer to return user details along with token """

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user  # Get the authenticated user
        data.update({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin
            },
            "message": "Login successful!",
        })
        return data



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    throttle_scope = 'user'

class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    throttle_scope = 'user'
    
    def get_object(self):
        return self.request.user
    
    
    
