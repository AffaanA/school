import {
    GET_STUDENTS_BY_CLASS,
    GET_STUDENTS_BY_CLASS_SUCCESS,
    GET_STUDENTS_BY_CLASS_FAIL,
    ADD_ATTENDENCE,
    ADD_ATTENDENCE_SUCCESS,
    ADD_ATTENDENCE_FAIL,
    GET_STUDENTS_ATTENDENCE,
    GET_STUDENTS_ATTENDENCE_FAIL,
    GET_STUDENTS_ATTENDENCE_SUCCESS,
  } from "./actionTypes";
  
  export const getStudentsByClass = id => ({
    type: GET_STUDENTS_BY_CLASS,
    payload: id,
  });
  export const getStudentsByClassSuccess =
    studentsbyclass => ({
      type: GET_STUDENTS_BY_CLASS_SUCCESS,
      payload: studentsbyclass,
    });
  
  export const getStudentsByClassFail = error => ({
    type: GET_STUDENTS_BY_CLASS_FAIL,
    payload: error,
  });


  // ----------- Add attendence with Image API actions -----------
export const addAttendence = (attendence, id) => ({
  type: ADD_ATTENDENCE,
  payload: { attendence, id },
});

export const addAttendenceSuccess = attendence => ({
  type: ADD_ATTENDENCE_SUCCESS,
  payload: attendence,
});

export const addAttendenceFail = error => ({
  type: ADD_ATTENDENCE_FAIL,
  payload: error,
});
export const getStudentsAttendence = id => ({
  type: GET_STUDENTS_ATTENDENCE,
  payload: id,
});
export const getStudentsAttendenceSuccess =
  employeesbyschool => ({
    type: GET_STUDENTS_ATTENDENCE_SUCCESS,
    payload: employeesbyschool,
  });

export const getStudentsAttendenceFail = error => ({
  type: GET_STUDENTS_ATTENDENCE_FAIL,
  payload: error,
});