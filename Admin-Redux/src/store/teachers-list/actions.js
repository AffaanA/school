import {
  GET_TEACHERS_LIST,
  GET_TEACHERS_LIST_SUCCESS,
  GET_TEACHERS_LIST_FAIL,
} from "./actionTypes";

export const getTeachersList = id => ({
  type: GET_TEACHERS_LIST,
  payload: id,
});
export const getTeachersListSuccess =
  teachers => ({
    type: GET_TEACHERS_LIST_SUCCESS,
    payload: teachers,
  });

export const getTeachersListFail = error => ({
  type: GET_TEACHERS_LIST_FAIL,
  payload: error,
});