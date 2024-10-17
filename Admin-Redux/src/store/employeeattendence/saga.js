import { call, put, takeEvery } from "redux-saga/effects";
import { GET_EMPLOYEES_BY_SCHOOL, ADD_EMPLOYEES_ATTENDENCE, GET_EMPLOYEES_ATTENDENCE } from "./actionTypes";
import {
  getEmployeesBySchoolSuccess,
  getEmployeesBySchoolFail,
  getEmployeesAttendenceSuccess,
  getEmployeesAttendenceFail,
  addEmployeesAttendenceFail,
  addEmployeesAttendenceSuccess,
} from "./actions";
import { getEmployeesBySchool, addEmployeesAttendence , getEmployeesAttendence} from "../../helpers/django_api_helper";

function* fetchEmployeesBySchool(object) {
  try {
    console.log("Fetching students by class with ID:", object.payload);
    const response = yield call(getEmployeesBySchool, object.payload);
    console.log("Fetched students response:", response);
    yield put(getEmployeesBySchoolSuccess(response));
  } catch (error) {
    console.error("Fetching students failed:", error);
    yield put(getEmployeesBySchoolFail(error));
  }
}
function* fetchEmployeesAttendence(object) {
  try {
    const response = yield call(getEmployeesAttendence, object.payload);
    console.log("Fetched students response:", response);
    yield put(getEmployeesAttendenceSuccess(response));
  } catch (error) {
    console.error("Fetching students failed:", error);
    yield put(getEmployeesAttendenceFail(error));
  }
}


function* onAddEmployeesAttendence(action) {
  try {
    console.log("Adding attendance with payload:", action.payload);
    const response = yield call(addEmployeesAttendence, action.payload);
    console.log("Attendance API response:", response);
    
    if (response.status === 200) {
      yield put(addEmployeesAttendenceSuccess(response.data));
    } else {
      console.error("Attendance API returned non-200 status:", response.status);
      yield put(addEmployeesAttendenceFail('An error occurred'));
    }
  } catch (error) {
    console.error("Adding attendance failed:", error);
    const errorMessage = error.response?.data?.message || 'An error occurred';
    yield put(addEmployeesAttendenceFail(errorMessage));
  }
}

function* EmployeesBySchoolSaga() {
  yield takeEvery(GET_EMPLOYEES_BY_SCHOOL, fetchEmployeesBySchool);
  yield takeEvery(GET_EMPLOYEES_ATTENDENCE, fetchEmployeesAttendence);
  yield takeEvery(ADD_EMPLOYEES_ATTENDENCE, onAddEmployeesAttendence);
}

export default EmployeesBySchoolSaga;
