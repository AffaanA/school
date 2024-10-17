from django.contrib import admin
from .models import AccountStatement

class AccountStatementAdmin(admin.ModelAdmin):
    list_display = ('school', 'transaction_type','payment_type', 'amount', 'description', 'transaction_date', 'updated_at')
    list_filter = ('transaction_type', 'payment_type','school', 'transaction_date')
    search_fields = ('school__name', 'description')
    date_hierarchy = 'transaction_date'
    ordering = ('-transaction_date',)
    readonly_fields = ('transaction_date', 'updated_at')


admin.site.register(AccountStatement, AccountStatementAdmin)
