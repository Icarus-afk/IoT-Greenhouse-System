from rest_framework import serializers
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
from .models import User

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def send_password_reset_email(self, user):
        token = default_token_generator.make_token(user)
        
        user_pk_bytes = force_bytes(user.pk)
        uid = urlsafe_base64_encode(user_pk_bytes)

        # Fallback if UID is 'NA'
        if uid == "NA":
            # Debug statement to log the fallback
            print("UID is 'NA', using direct conversion")
            uid = str(user.pk)  # Use direct string conversion as a fallback

        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        context = {
            'user': user,
            'reset_link': reset_link,
        }

        subject = "Password Reset Request"
        email_template_name = "User/password_reset_email.html"
        email_body = render_to_string(email_template_name, context)

        send_mail(
            subject,
            email_body,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        self.send_password_reset_email(user)
        
class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    uidb64 = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def save(self):
        uidb64 = self.validated_data['uidb64']
        
        try:
            # Attempt to decode the UID, assuming it's encoded
            uid = force_str(urlsafe_base64_decode(uidb64))
        except (TypeError, ValueError, OverflowError):
            # If decoding fails, assume the UID is directly passed as a string
            uid = uidb64

        token = self.validated_data['token']
        new_password = self.validated_data['new_password']

        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid user.")

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError("Invalid token.")

        user.set_password(new_password)
        user.save()