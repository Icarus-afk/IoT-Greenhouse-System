from django.db import models

class UserManager(models.Manager):
    def get_by_natural_key(self, username):
        return self.get(username=username)
    
    def create_superuser(self, username, password=None):
        user = self.create_user(username, password=password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError('The given username must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def normalize_email(self, email):
        email_name, domain_part = email.strip().rsplit('@', 1)
        email = '@'.join([email_name, domain_part.lower()])
        return email