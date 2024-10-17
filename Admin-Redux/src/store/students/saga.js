import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_STUDENTS,
  ADD_NEW_STUDENT,
  DELETE_STUDENT,
  UPDATE_STUDENT,
} from "./actionTypes";

import {
  getStudentsSuccess,
  getStudentsFail,
  addStudentFail,
  addStudentSuccess,
  updateStudentSuccess,
  updateStudentFail,
  deleteStudentSuccess,
  deleteStudentFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getStudents,
  addNewStudent,
  updateStudent,
  deleteStudent,
} from "../../helpers/django_api_helper";

function* fetchStudents(object) {
  try {
    const response = yield call(getStudents, object.payload);
    console.log("responseapi",response)
    yield put(getStudentsSuccess(response));
  } catch (error) {
    yield put(getStudentsFail(error));
  }
}

// function* onAddNewStudent(object) {
//   try {
//     const response = yield call(
//       addNewStudent,
//       object.payload.student,
//       object.payload.id
//     );
//     yield put(addStudentSuccess(response));
//   } catch (error) {
//     yield put(addStudentFail(error));
//   }
// }
function* onAddNewStudent(action) {
  try {
    console.log("Saga: Before API call with", action.payload);
    const response = yield call(
      addNewStudent,
      action.payload.student,
      action.payload.id
    );
    console.log("API response in saga:", response); // Move this line after response is fetched
    if (response.status === 201) {
      yield put(addStudentSuccess(response.data));
    }
  } catch (error) {
    yield put(addStudentFail(error));
  }
}
function* onUpdateStudent({ payload: student }) {
  try {
    const response = yield call(updateStudent, student);
    yield put(updateStudentSuccess(response));
  } catch (error) {
    yield put(updateStudentFail(error));
  }
}

function* onDeleteStudent({ payload: student }) {
  try {
    const response = yield call(deleteStudent, student);
    yield put(deleteStudentSuccess(response));
  } catch (error) {
    yield put(deleteStudentFail(error));
  }
}

function* studentsSaga() {
  yield takeEvery(GET_STUDENTS, fetchStudents);
  yield takeEvery(ADD_NEW_STUDENT, onAddNewStudent);
  yield takeEvery(UPDATE_STUDENT, onUpdateStudent);
  yield takeEvery(DELETE_STUDENT, onDeleteStudent);
}

export default studentsSaga;
