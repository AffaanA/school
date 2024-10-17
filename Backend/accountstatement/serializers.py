from rest_framework import serializers
from .models import AccountStatement

class AccountStatementSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountStatement
        fields = '__all__'
