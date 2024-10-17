import {
  GET_CLASSES_LIST,
  GET_CLASSES_LIST_SUCCESS,
  GET_CLASSES_LIST_FAIL,
} from "./actionTypes";

export const getClassesList = id => ({
  type: GET_CLASSES_LIST,
  payload: id,
});
export const getClassesListSuccess =
  classes => ({
    type: GET_CLASSES_LIST_SUCCESS,
    payload: classes,
  });

export const getClassesListFail = error => ({
  type: GET_CLASSES_LIST_FAIL,
  payload: error,
});