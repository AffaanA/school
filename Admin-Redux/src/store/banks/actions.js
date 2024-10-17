import {
  GET_BANKS,
  GET_BANKS_FAIL,
  GET_BANKS_SUCCESS,
  ADD_NEW_BANK,
  ADD_BANK_SUCCESS,
  ADD_BANK_FAIL,
  UPDATE_BANK,
  UPDATE_BANK_SUCCESS,
  UPDATE_BANK_FAIL,
  DELETE_BANK,
  DELETE_BANK_SUCCESS,
  DELETE_BANK_FAIL,
  CLEAR_ERROR_MSG,
  CLEAR_SUCCESS_MSG,
} from "./actionTypes";

export const clearSuccessMsg = () => ({
  type: CLEAR_SUCCESS_MSG,
});

export const clearErrorMsg = () => ({
  type: CLEAR_ERROR_MSG,
});
// ----------- Offered test list APIs actions -----------------
export const getBanks = id => ({
  type: GET_BANKS,
  payload: id,
});

export const getBanksSuccess = banks => ({
  type: GET_BANKS_SUCCESS,
  payload: banks,
});

export const getBanksFail = error => ({
  type: GET_BANKS_FAIL,
  payload: error,
});


export const addNewBank = (bank, id) => ({
  type: ADD_NEW_BANK,
  payload: { bank, id },
});

export const addBankSuccess = bank => ({
  type: ADD_BANK_SUCCESS,
  payload: bank,
});

export const addBankFail = error => ({
  type: ADD_BANK_FAIL,
  payload: error,
});



export const updateBank = bank => ({
  type: UPDATE_BANK,
  payload: bank,
});

export const updateBankSuccess = bank => ({
  type: UPDATE_BANK_SUCCESS,
  payload: bank,
});

export const updateBankFail = error => ({
  type: UPDATE_BANK_FAIL,
  payload: error,
});

export const deleteBank = bank => ({
  type: DELETE_BANK,
  payload: bank,
});

export const deleteBankSuccess = bank => ({
  type: DELETE_BANK_SUCCESS,
  payload: bank,
});

export const deleteBankFail = error => ({
  type: DELETE_BANK_FAIL,
  payload: error,
});
