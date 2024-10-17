"""
URL configuration for SMS project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from account.views import redirect_to_admin_view

admin.site.site_header = "School Management System"
admin.site.site_title = "School Management System Admin Portal"
admin.site.index_title = "Welcome to School Management System"

urlpatterns = [
    path('', redirect_to_admin_view),
    path('admin/', admin.site.urls),
    path('api/account/', include('account.urls')),
    path('api/school/', include('school.urls')),
    path('api/employees/', include('employees.urls')),
    path('api/student/', include('student.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

