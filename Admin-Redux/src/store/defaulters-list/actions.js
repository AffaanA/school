import {
  GET_DEFAULTERS_LIST,
  GET_DEFAULTERS_LIST_SUCCESS,
  GET_DEFAULTERS_LIST_FAIL,
  UPDATE_DEFAULTERS_LIST,
  UPDATE_DEFAULTERS_LIST_SUCCESS,
  UPDATE_DEFAULTERS_LIST_FAIL,
} from "./actionTypes";

// Existing actions for fetching defaulters list
export const getDefaultersList = id => ({
  type: GET_DEFAULTERS_LIST,
  payload: id,
});

export const getDefaultersListSuccess = defaulters => ({
  type: GET_DEFAULTERS_LIST_SUCCESS,
  payload: defaulters,
});

export const getDefaultersListFail = error => ({
  type: GET_DEFAULTERS_LIST_FAIL,
  payload: error,
});

// New actions for updating unpaid fee challans
export const updateDefaultersList = id => ({
  type: UPDATE_DEFAULTERS_LIST,
  payload: id,
});

export const updateDefaultersListSuccess = updatedDefaulters => ({
  type: UPDATE_DEFAULTERS_LIST_SUCCESS,
  payload: updatedDefaulters,
});

export const updateDefaultersListFail = error => ({
  type: UPDATE_DEFAULTERS_LIST_FAIL,
  payload: error,
});
