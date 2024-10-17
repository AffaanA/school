import {
  GET_STUDENTS_LIST,
  GET_STUDENTS_LIST_SUCCESS,
  GET_STUDENTS_LIST_FAIL,
} from "./actionTypes";

export const getStudentsList = id => ({
  type: GET_STUDENTS_LIST,
  payload: id,
});
export const getStudentsListSuccess =
  students => ({
    type: GET_STUDENTS_LIST_SUCCESS,
    payload: students,
  });

export const getStudentsListFail = error => ({
  type: GET_STUDENTS_LIST_FAIL,
  payload: error,
});