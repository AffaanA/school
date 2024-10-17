import {
  GET_STUDENTS,
  GET_STUDENTS_FAIL,
  GET_STUDENTS_SUCCESS,
  ADD_NEW_STUDENT,
  ADD_STUDENT_SUCCESS,
  ADD_STUDENT_FAIL,
  UPDATE_STUDENT,
  UPDATE_STUDENT_SUCCESS,
  UPDATE_STUDENT_FAIL,
  DELETE_STUDENT,
  DELETE_STUDENT_SUCCESS,
  DELETE_STUDENT_FAIL,
} from "./actionTypes";


// ----------- Offered test list APIs actions -----------------
export const getStudents = id => ({
  type: GET_STUDENTS,
  payload: id,
});

export const getStudentsSuccess = students => ({
  type: GET_STUDENTS_SUCCESS,
  payload: students,
});

export const getStudentsFail = error => ({
  type: GET_STUDENTS_FAIL,
  payload: error,
});


export const addNewStudent = (student, id) => ({
  type: ADD_NEW_STUDENT,
  payload: { student, id },
});

export const addStudentSuccess = student => ({
  type: ADD_STUDENT_SUCCESS,
  payload: student,
});

export const addStudentFail = error => ({
  type: ADD_STUDENT_FAIL,
  payload: error,
});



export const updateStudent = student => ({
  type: UPDATE_STUDENT,
  payload: student,
});

export const updateStudentSuccess = student => ({
  type: UPDATE_STUDENT_SUCCESS,
  payload: student,
});

export const updateStudentFail = error => ({
  type: UPDATE_STUDENT_FAIL,
  payload: error,
});

export const deleteStudent = student => ({
  type: DELETE_STUDENT,
  payload: student,
});

export const deleteStudentSuccess = student => ({
  type: DELETE_STUDENT_SUCCESS,
  payload: student,
});

export const deleteStudentFail = error => ({
  type: DELETE_STUDENT_FAIL,
  payload: error,
});
