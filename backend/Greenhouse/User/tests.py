from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AuthViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('signup')
        self.login_url = reverse('login')
        self.get_user_info_url = reverse('get_user_info')
        self.set_user_info_url = reverse('set_user_info')
        self.logout_url = reverse('logout')
        self.refresh_token_url = reverse('refresh_token')

        self.user_data = {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'testuser@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'age': 30,
            'address': '123 Test St'
        }

        self.user = User.objects.create_user(
            username=self.user_data['username'],
            password=self.user_data['password'],
            email=self.user_data['email'],
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name'],
            age=self.user_data['age'],
            address=self.user_data['address']
        )


    def test_signup_view(self):
        response = self.client.post(self.signup_url, {
            'username': 'newuser',
            'password': 'newpass123',
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'age': 25,
            'address': '456 New St'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('User created successfully', response.json()['message'])

    def test_login_view(self):
        response = self.client.post(self.login_url, {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Login successful', response.json()['message'])
        self.assertIn('jwt', response.cookies)
        self.assertIn('refresh', response.cookies)

    def test_get_user_info_view(self):
        self.client.login(username=self.user_data['username'], password=self.user_data['password'])
        response = self.client.get(self.get_user_info_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('User info retrieved successfully', response.json()['message'])
        self.assertEqual(response.json()['data']['username'], self.user_data['username'])

    def test_set_user_info_view(self):
        self.client.login(username=self.user_data['username'], password=self.user_data['password'])
        response = self.client.put(self.set_user_info_url, {
            'first_name': 'Updated',
            'last_name': 'User'
        }, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('User information updated successfully', response.json()['message'])
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.last_name, 'User')

    def test_logout_view(self):
        self.client.login(username=self.user_data['username'], password=self.user_data['password'])
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Logout successful', response.json()['message'])

    def test_refresh_token_view(self):
        refresh = RefreshToken.for_user(self.user)
        self.client.cookies['refresh'] = refresh
        response = self.client.post(self.refresh_token_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Token refreshed', response.json()['message'])
        self.assertIn('jwt', response.cookies)
