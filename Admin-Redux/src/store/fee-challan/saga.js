import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CHALLANS,
  ADD_NEW_CHALLAN,
  DELETE_CHALLAN,
  UPDATE_CHALLAN,
  ADD_CHALLAN_WITH_IMAGE,
} from "./actionTypes";

import {
  getChallansSuccess,
  getChallansFail,
  addChallanFail,
  addChallanSuccess,
  updateChallanSuccess,
  updateChallanFail,
  deleteChallanSuccess,
  deleteChallanFail,
  addChallanWithImageSuccess,
  addChallanWithImageFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getChallans,
  addNewChallan,
  updateChallan,
  deleteChallan,
  addNewChallanWithImage,
} from "../../helpers/django_api_helper";

function* fetchChallans(object) {
  try {
    const response = yield call(getChallans, object.payload);
    console.log("responseapi",response)
    yield put(getChallansSuccess(response));
  } catch (error) {
    yield put(getChallansFail(error));
  }
}

// function* onAddNewChallan(action) {
//   try {
//     const response = yield call(
//       addNewChallan,
//       object.payload.challan,
//       object.payload.id
//     );
//     yield put(addChallanSuccess(response));
//   } catch (error) {
//     yield put(addChallanFail(error));
//   }
// }
function* onAddNewChallan(action) {
  try {
    const response = yield call(
      addNewChallan,
      action.payload.challan,
      action.payload.id
    );
    if (response.status === 201 || response.status === 200 ) {
      yield put(addChallanSuccess(response.data));
    }
  } catch (error) {
    const errorMessage = error.response ? error.response.data : 'An error occurred';
    yield put(addChallanFail(errorMessage));
  }
}
// Add new Challan with Image
function* onAddNewChallanWithImage(action) {
  try {
    const response = yield call(
      addNewChallanWithImage,
      action.payload.challan,
      action.payload.id
    );
    if (response.status === 200) {
      yield put(addChallanWithImageSuccess(response.data));
    }
  } catch (error) {
    const errorMessage = error.response ? error.response.data : 'An error occurred';
    yield put(addChallanWithImageFail(errorMessage));
  }
}
function* onUpdateChallan({ payload: challan }) {
  try {
    const response = yield call(updateChallan, challan);
    yield put(updateChallanSuccess(response));
  } catch (error) {
    yield put(updateChallanFail(error));
  }
}

function* onDeleteChallan({ payload: challan }) {
  try {
    const response = yield call(deleteChallan, challan);
    yield put(deleteChallanSuccess(response));
  } catch (error) {
    yield put(deleteChallanFail(error));
  }
}

function* challansSaga() {
  yield takeEvery(GET_CHALLANS, fetchChallans);
  yield takeEvery(ADD_NEW_CHALLAN, onAddNewChallan);
  yield takeEvery(ADD_CHALLAN_WITH_IMAGE, onAddNewChallanWithImage);
  yield takeEvery(UPDATE_CHALLAN, onUpdateChallan);
  yield takeEvery(DELETE_CHALLAN, onDeleteChallan);
}

export default challansSaga;
