import {
  GET_FAMILY_LIST,
  GET_FAMILY_LIST_SUCCESS,
  GET_FAMILY_LIST_FAIL,
} from "./actionTypes";

export const getFamilyList = id => ({
  type: GET_FAMILY_LIST,
  payload: id,
});
export const getFamilyListSuccess =
  family => ({
    type: GET_FAMILY_LIST_SUCCESS,
    payload: family,
  });

export const getFamilyListFail = error => ({
  type: GET_FAMILY_LIST_FAIL,
  payload: error,
});