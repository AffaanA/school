import { all, fork } from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import dashboardSaga from "./dashboard/saga"
import schoolProfileSaga from "./auth/schoolprofile/saga"
import studentProfileSaga from "./auth/studentprofile/saga"
import schoolGradesSaga from "./auth/schoolgrades/saga"
import employeesSaga from "./employees/saga"
import classesSaga from "./classes/saga"
import TeachersSaga from "./teachers-list/saga"
import schoolSubjectsSaga from "./schoolsubjects/saga"
import ClassesListSaga from "./classes-list/saga"
import studentsSaga from "./students/saga"
import StudentsByClassSaga from "./studentfee/saga"
import FamilySaga from "./family-list/saga"
import schoolFeeSaga from "./schoolfee/saga"
import StudentsListSaga from "./students-list/saga"
import banksSaga from "./banks/saga"
import challansSaga from "./fee-challan/saga"
import DefaultersListSaga from "./defaulters-list/saga"
import EmployeesBySchoolSaga from "./employeeattendence/saga"
export default function* rootSaga() {
  yield all([
    fork(AccountSaga),
    fork(AuthSaga),    
    fork(dashboardSaga),
    fork(schoolProfileSaga),
    fork(studentProfileSaga),
    fork(schoolGradesSaga),
    fork(employeesSaga),
    fork(TeachersSaga),
    fork(classesSaga),
    fork(EmployeesBySchoolSaga),
    fork(StudentsByClassSaga),
    fork(DefaultersListSaga),
    fork(schoolSubjectsSaga),
    fork(ClassesListSaga),
    fork(banksSaga),
    fork(challansSaga),
    fork(studentsSaga),
    fork(FamilySaga),
    fork(schoolFeeSaga),
    fork(StudentsListSaga),
  ])
}
