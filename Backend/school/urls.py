from django.urls import path
from .views import BankList, BankListCreateView, BankRetrieveUpdateDestroyView, ClassDetailView, ClassList, ClassListCreateView, DefaultersList, FeeChallanCreateView, FeeChallanUploadView, FeeParticularRetrieveView, FeeParticularCreateView, GradeAddView, GradeListCreateView, GradeUpdateView, SchoolProfileUpdateView, StudentList, SubjectListClassView, SubjectListCreateView, SubjectUpdateView, TeacherList

urlpatterns = [
    path('school-profile/<account_id>', SchoolProfileUpdateView.as_view(), name='school-profile'),
    #Grades URLS
    path('grades-list/<account_id>', GradeListCreateView.as_view(), name='grade-list-create'),
    path('grades-update/<account_id>', GradeUpdateView.as_view(), name='grade-update'),
    #Classes URLS
    path('classes/<account_id>', ClassListCreateView.as_view(), name='class-list-create'),
    path('class/<int:pk>', ClassDetailView.as_view(), name='class-detail'), 
    path('teacher/<account_id>', TeacherList.as_view(), name='teacher-list'),     

    #Subject URLS
    path('subjects-list/<account_id>', SubjectListCreateView.as_view(), name='subjects-list-create'),
    path('subjects-list-class/<account_id>', SubjectListClassView.as_view(), name='subjects-list-class'),
    path('subjects-update/<account_id>', SubjectUpdateView.as_view(), name='subjects-update'), 

    path('classlist/<account_id>', ClassList.as_view(), name='class-list'),   
    path('studentlist/<account_id>', StudentList.as_view(), name='student-list'),   
    path('banklist/<account_id>', BankList.as_view(), name='bank-list'),   

    path('create-fee/<account_id>', FeeParticularCreateView.as_view(), name='create-fee') ,  
    path('get-fee/<account_id>', FeeParticularRetrieveView.as_view() , name='get-fee') , 

    path('banks/<account_id>', BankListCreateView.as_view(), name='bank-list-create'),
    path('banks-update/<int:id>', BankRetrieveUpdateDestroyView.as_view(), name='bank-detail'),  

    path('fee-challan/<account_id>', FeeChallanCreateView.as_view(), name='fee-challan-create'),
    path('upload-challan/', FeeChallanUploadView.as_view(), name='upload-challan'),
    path('defaulterslist/<account_id>', DefaultersList.as_view(), name='defaulters-list'),   
]