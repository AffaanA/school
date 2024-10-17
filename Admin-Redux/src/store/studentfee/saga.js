import { call, put, takeEvery } from "redux-saga/effects";
import { GET_STUDENTS_BY_CLASS, ADD_ATTENDENCE,GET_STUDENTS_ATTENDENCE } from "./actionTypes";
import {
  getStudentsByClassSuccess,
  getStudentsByClassFail,
  getStudentsAttendenceFail,
  getStudentsAttendenceSuccess,
  addAttendenceFail,
  addAttendenceSuccess,
} from "./actions";
import { getStudentsByClass, addAttendence, getStudentsAttendence } from "../../helpers/django_api_helper";

function* fetchStudentsByClass(object) {
  try {
    console.log("Fetching students by class with ID:", object.payload);
    const response = yield call(getStudentsByClass, object.payload);
    console.log("Fetched students response:", response);
    yield put(getStudentsByClassSuccess(response));
  } catch (error) {
    console.error("Fetching students failed:", error);
    yield put(getStudentsByClassFail(error));
  }
}

function* onAddAttendence(action) {
  try {
    console.log("Adding attendance with payload:", action.payload);
    const response = yield call(addAttendence, action.payload);
    console.log("Attendance API response:", response);
    
    if (response.status === 200) {
      yield put(addAttendenceSuccess(response.data));
    } else {
      console.error("Attendance API returned non-200 status:", response.status);
      yield put(addAttendenceFail('An error occurred'));
    }
  } catch (error) {
    console.error("Adding attendance failed:", error);
    const errorMessage = error.response?.data?.message || 'An error occurred';
    yield put(addAttendenceFail(errorMessage));
  }
}
function* fetchStudentsAttendence(object) {
  try {
    const response = yield call(getStudentsAttendence, object.payload);
    console.log("Fetched students response:", response);
    yield put(getStudentsAttendenceSuccess(response));
  } catch (error) {
    console.error("Fetching students failed:", error);
    yield put(getStudentsAttendenceFail(error));
  }
}


function* StudentsByClassSaga() {
  yield takeEvery(GET_STUDENTS_BY_CLASS, fetchStudentsByClass);
  yield takeEvery(GET_STUDENTS_ATTENDENCE, fetchStudentsAttendence);
  yield takeEvery(ADD_ATTENDENCE, onAddAttendence);
}

export default StudentsByClassSaga;
