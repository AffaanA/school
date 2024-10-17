import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CLASSES,
  ADD_NEW_CLASS,
  DELETE_CLASS,
  UPDATE_CLASS,
} from "./actionTypes";

import {
  getClassesSuccess,
  getClassesFail,
  addClassFail,
  addClassSuccess,
  updateClassSuccess,
  updateClassFail,
  deleteClassSuccess,
  deleteClassFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getClasses,
  addNewClass,
  updateClass,
  deleteClass,
} from "../../helpers/django_api_helper";

function* fetchClasses(object) {
  try {
    const response = yield call(getClasses, object.payload);
    console.log("responseapi",response)
    yield put(getClassesSuccess(response));
  } catch (error) {
    yield put(getClassesFail(error));
  }
}

// function* onAddNewClass(action) {
//   try {
//     const response = yield call(
//       addNewClass,
//       object.payload.clas,
//       object.payload.id
//     );
//     yield put(addClassSuccess(response));
//   } catch (error) {
//     yield put(addClassFail(error));
//   }
// }
function* onAddNewClass(action) {
  try {
    const response = yield call(
      addNewClass,
      action.payload.clas,
      action.payload.id
    );
    if (response.status === 201) {
      yield put(addClassSuccess(response.data));
    }
  } catch (error) {
    yield put(addClassFail(error));
  }
}
function* onUpdateClass({ payload: clas }) {
  try {
    const response = yield call(updateClass, clas);
    yield put(updateClassSuccess(response));
  } catch (error) {
    yield put(updateClassFail(error));
  }
}

function* onDeleteClass({ payload: clas }) {
  try {
    const response = yield call(deleteClass, clas);
    yield put(deleteClassSuccess(response));
  } catch (error) {
    yield put(deleteClassFail(error));
  }
}

function* classesSaga() {
  yield takeEvery(GET_CLASSES, fetchClasses);
  yield takeEvery(ADD_NEW_CLASS, onAddNewClass);
  yield takeEvery(UPDATE_CLASS, onUpdateClass);
  yield takeEvery(DELETE_CLASS, onDeleteClass);
}

export default classesSaga;