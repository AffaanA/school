import {
  GET_EMPLOYEES_SUCCESS,
  GET_EMPLOYEES_FAIL,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAIL,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAIL,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  employees: [],
  error: {},
  successMessage:null,
};

const employees = (state = INIT_STATE, action) => {
  switch (action.type) {
      case GET_EMPLOYEES_SUCCESS:
        console.log("employeesReducer", action.payload.data, action.payload);
        return {
          ...state,
          employees: action.payload,
        };
  
      case GET_EMPLOYEES_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      
    case ADD_EMPLOYEE_SUCCESS:
      return {
        ...state,
        successMessage: 'Employee Added Successfully!',
        employees: [...state.employees, action.payload],
      };

    case ADD_EMPLOYEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: state.employees.map(employee =>
          employee.id.toString() === action.payload.id.toString()
            ? { employee, ...action.payload }
            : employee
        ),
      };

    case UPDATE_EMPLOYEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: state.employees.filter(
          employee =>
            employee.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_EMPLOYEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default employees;
