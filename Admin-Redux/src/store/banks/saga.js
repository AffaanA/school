import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_BANKS,
  ADD_NEW_BANK,
  DELETE_BANK,
  UPDATE_BANK,
} from "./actionTypes";

import {
  getBanksSuccess,
  getBanksFail,
  addBankFail,
  addBankSuccess,
  updateBankSuccess,
  updateBankFail,
  deleteBankSuccess,
  deleteBankFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getBanks,
  addNewBank,
  updateBank,
  deleteBank,
} from "../../helpers/django_api_helper";

function* fetchBanks(object) {
  try {
    const response = yield call(getBanks, object.payload);
    console.log("responseapi",response)
    yield put(getBanksSuccess(response));
  } catch (error) {
    yield put(getBanksFail(error));
  }
}

// function* onAddNewBank(action) {
//   try {
//     const response = yield call(
//       addNewBank,
//       object.payload.bank,
//       object.payload.id
//     );
//     yield put(addBankSuccess(response));
//   } catch (error) {
//     yield put(addBankFail(error));
//   }
// }
function* onAddNewBank(action) {
  try {
    const response = yield call(
      addNewBank,
      action.payload.bank,
      action.payload.id
    );
    if (response.status === 201) {
      yield put(addBankSuccess(response.data));
    }
  } catch (error) {
    yield put(addBankFail(error));
  }
}
function* onUpdateBank({ payload: bank }) {
  try {
    const response = yield call(updateBank, bank);
    yield put(updateBankSuccess(response));
  } catch (error) {
    yield put(updateBankFail(error));
  }
}

function* onDeleteBank({ payload: bank }) {
  try {
    const response = yield call(deleteBank, bank);
    yield put(deleteBankSuccess(response));
  } catch (error) {
    yield put(deleteBankFail(error));
  }
}

function* banksSaga() {
  yield takeEvery(GET_BANKS, fetchBanks);
  yield takeEvery(ADD_NEW_BANK, onAddNewBank);
  yield takeEvery(UPDATE_BANK, onUpdateBank);
  yield takeEvery(DELETE_BANK, onDeleteBank);
}

export default banksSaga;
