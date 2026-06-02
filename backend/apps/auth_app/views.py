from rest_framework import status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, UserSerializer


class LoginView(views.APIView):
    permission_classes: list = []
    authentication_classes: list = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        return Response(
            {
                "accessToken": str(refresh.access_token),
                "refreshToken": str(refresh),
                "tokenType": "Bearer",
                "user": user_data,
            },
            status=status.HTTP_200_OK,
        )

