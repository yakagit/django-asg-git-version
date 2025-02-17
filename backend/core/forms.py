from django import forms

class SecretKeyForm(forms.Form):
    secret_key = forms.CharField(max_length=200, widget=forms.PasswordInput)
