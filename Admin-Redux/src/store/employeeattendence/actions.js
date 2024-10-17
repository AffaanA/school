import {
    GET_EMPLOYEES_BY_SCHOOL,
    GET_EMPLOYEES_BY_SCHOOL_SUCCESS,
    GET_EMPLOYEES_BY_SCHOOL_FAIL,
    GET_EMPLOYEES_ATTENDENCE,
    GET_EMPLOYEES_ATTENDENCE_SUCCESS,
    GET_EMPLOYEES_ATTENDENCE_FAIL,
    ADD_EMPLOYEES_ATTENDENCE,
    ADD_EMPLOYEES_ATTENDENCE_SUCCESS,
    ADD_EMPLOYEES_ATTENDENCE_FAIL,
  } from "./actionTypes";
  
  export const getEmployeesBySchool = id => ({
    type: GET_EMPLOYEES_BY_SCHOOL,
    payload: id,
  });
  export const getEmployeesBySchoolSuccess =
    employeesbyschool => ({
      type: GET_EMPLOYEES_BY_SCHOOL_SUCCESS,
      payload: employeesbyschool,
    }); 
  export const getEmployeesBySchoolFail = error => ({
    type: GET_EMPLOYEES_BY_SCHOOL_FAIL,
    payload: error,
  });

  export const getEmployeesAttendence = id => ({
    type: GET_EMPLOYEES_ATTENDENCE,
    payload: id,
  });
  export const getEmployeesAttendenceSuccess =
    employeesbyschool => ({
      type: GET_EMPLOYEES_ATTENDENCE_SUCCESS,
      payload: employeesbyschool,
    });
  
  export const getEmployeesAttendenceFail = error => ({
    type: GET_EMPLOYEES_ATTENDENCE_FAIL,
    payload: error,
  });
  // ----------- Add employeesattendence with Image API actions -----------
export const addEmployeesAttendence = (employeesattendence, id) => ({
  type: ADD_EMPLOYEES_ATTENDENCE,
  payload: { employeesattendence, id },
});

export const addEmployeesAttendenceSuccess = employeesattendence => ({
  type: ADD_EMPLOYEES_ATTENDENCE_SUCCESS,
  payload: employeesattendence,
});

export const addEmployeesAttendenceFail = error => ({
  type: ADD_EMPLOYEES_ATTENDENCE_FAIL,
  payload: error,
});