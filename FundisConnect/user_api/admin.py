from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import AppUser

class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label="password", 
        widget=forms.PasswordInput)
    password2 = forms.CharField(label="password confirmation",
        widget=forms.PasswordInput)
    
    class Meta:
        model = AppUser
        fields = ('username', 'email', 'usertype', 'phone')
    
    def clean_password2(self):
        #Check that the two entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2
    
    def save(self, commit=True):
        #save the provided password in a hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class UserChangeForm(forms.ModelForm):
    #A form for updating users
    password = ReadOnlyPasswordHashField()
    class Meta:
        model = AppUser
        fields = ('username', 'email', 'usertype', 'phone', 'password', 'is_staff', 'is_superuser')

    def clean_password(self):
        #Regardless of what the user provides, return the initial value
        return self.initial["password"]


class AppUserAdmin(BaseUserAdmin):
    #The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    #define fields to be displayed in the admin list view
    list_display = ('username', 'email', 'usertype', 'phone',)

    # define filters to be displayed in the admin list view
    list_filter = ('is_staff', 'is_superuser')

    fieldsets = (
        (None, {
            'fields': ('email', 'password')}),
            ('Personal info',
             {'fields':
              ('usertype', 'phone',)}),
              ('Permissions',
               {'fields': ('is_staff', 'is_superuser')}),
    )


    #define fields to be displayed in the add user view
    add_fieldsets = (
        (None, {
            'classes': ('wide', ),
            'fields': ('username', 'email', 'usertype', 'phone', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }
        ),
    )

# Registering the new AppUserAdmin   
admin.site.register(AppUser, AppUserAdmin)

#unregistering the group model from admin
admin.site.unregister(Group)


