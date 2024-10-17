import {
  GET_EMPLOYEES,
  GET_EMPLOYEES_FAIL,
  GET_EMPLOYEES_SUCCESS,
  ADD_NEW_EMPLOYEE,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAIL,
  UPDATE_EMPLOYEE,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAIL,
  DELETE_EMPLOYEE,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAIL,
} from "./actionTypes";


// ----------- Offered test list APIs actions -----------------
export const getEmployees = id => ({
  type: GET_EMPLOYEES,
  payload: id,
});

export const getEmployeesSuccess = employees => ({
  type: GET_EMPLOYEES_SUCCESS,
  payload: employees,
});

export const getEmployeesFail = error => ({
  type: GET_EMPLOYEES_FAIL,
  payload: error,
});


export const addNewEmployee = (employee, id) => ({
  type: ADD_NEW_EMPLOYEE,
  payload: { employee, id },
});

export const addEmployeeSuccess = employee => ({
  type: ADD_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const addEmployeeFail = error => ({
  type: ADD_EMPLOYEE_FAIL,
  payload: error,
});



export const updateEmployee = employee => ({
  type: UPDATE_EMPLOYEE,
  payload: employee,
});

export const updateEmployeeSuccess = employee => ({
  type: UPDATE_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const updateEmployeeFail = error => ({
  type: UPDATE_EMPLOYEE_FAIL,
  payload: error,
});

export const deleteEmployee = employee => ({
  type: DELETE_EMPLOYEE,
  payload: employee,
});

export const deleteEmployeeSuccess = employee => ({
  type: DELETE_EMPLOYEE_SUCCESS,
  payload: employee,
});

export const deleteEmployeeFail = error => ({
  type: DELETE_EMPLOYEE_FAIL,
  payload: error,
});
