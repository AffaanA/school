import {
  GET_STUDENT_PROFILE,
  GET_STUDENT_PROFILE_FAIL,
  GET_STUDENT_PROFILE_SUCCESS,
  UPDATE_STUDENT_PROFILE,
  UPDATE_STUDENT_PROFILE_SUCCESS,
  UPDATE_STUDENT_PROFILE_FAIL,
} from "./actionTypes";

export const getStudentProfile = id => ({
  type: GET_STUDENT_PROFILE,
  payload: id,
});

export const getStudentProfileSuccess = studentProfile => ({
  type: GET_STUDENT_PROFILE_SUCCESS,
  payload: studentProfile,
});

export const getStudentProfileFail = error => ({
  type: GET_STUDENT_PROFILE_FAIL,
  payload: error,
});

export const updateStudentProfile = (studentProfile, id) => ({
  type: UPDATE_STUDENT_PROFILE,
  payload: { studentProfile, id },
});

export const updateStudentProfileSuccess = studentProfile => ({
  type: UPDATE_STUDENT_PROFILE_SUCCESS,
  payload: studentProfile,
});

export const updateStudentProfileFail = error => ({
  type: UPDATE_STUDENT_PROFILE_FAIL,
  payload: error,
});
