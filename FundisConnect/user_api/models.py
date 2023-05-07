from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class AppUserManager(BaseUserManager):
    def create_user(self, email, username, usertype, password=None):
        if not email:
            raise ValueError('An email is required.')
        if not username:
            raise ValueError('A username is required')
        if not usertype:
            raise ValueError('A usertype is required')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email,
                          username = username,  
                          usertype = usertype)      
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, usertype, password=None,  **extra_fields):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        user = self.create_user(email, 
                username = username,
                usertype = usertype,
                password = password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50)
    usertype = models.CharField(max_length=20)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'usertype', 'password']
    objects = AppUserManager()
    def __str__(self):
        return self.username
