import {
  GET_EMPLOYEES_BY_SCHOOL_SUCCESS,
  GET_EMPLOYEES_BY_SCHOOL_FAIL,
  GET_EMPLOYEES_ATTENDENCE_SUCCESS,
  GET_EMPLOYEES_ATTENDENCE_FAIL,
  ADD_EMPLOYEES_ATTENDENCE_FAIL,
  ADD_EMPLOYEES_ATTENDENCE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  employeesbyschoolList: [],
  error: {},
  errorMessage: '',
  successMessage: null,
};

const employeesbyschoollist = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_EMPLOYEES_BY_SCHOOL_SUCCESS:
      console.log("GET_EMPLOYEES_BY_SCHOOL_SUCCESS payload:", action.payload);
      return {
        ...state,
        employeesbyschoolList: action.payload,
        successMessage: '',
      };

    case GET_EMPLOYEES_BY_SCHOOL_FAIL:
      console.log("GET_EMPLOYEES_BY_SCHOOL_FAIL payload:", action.payload);
      return {
        ...state,
        error: action.payload,
        errorMessage: action.payload.message || 'An error occurred',
        successMessage: '',
      };
    
      case GET_EMPLOYEES_ATTENDENCE_SUCCESS:
        console.log("GET_EMPLOYEES_ATTENDENCE_SUCCESS payload:", action.payload);
        return {
          ...state,
          employeesbyschoolList: action.payload.attendances,
          successMessage: '',
        };
  
      case GET_EMPLOYEES_ATTENDENCE_FAIL:
        console.log("GET_EMPLOYEES_ATTENDENCE_FAIL payload:", action.payload);
        return {
          ...state,
          error: action.payload,
          errorMessage: action.payload.message || 'An error occurred',
          successMessage: '',
        };
  
   
    case ADD_EMPLOYEES_ATTENDENCE_SUCCESS:
      console.log("ADD_EMPLOYEES_ATTENDENCE_SUCCESS payload:", action.payload);
      return {
        ...state,
        successMessage: action.payload.message,
        errorMessage: '',
        employeesbyschoolList: action.payload,
        // employeesbyschoolList: [...state.employeesbyschoolList, ...action.payload],
      };

    case ADD_EMPLOYEES_ATTENDENCE_FAIL:
      console.log("ADD_EMPLOYEES_ATTENDENCE_FAIL payload:", action.payload);
      return {
        ...state,
        errorMessage: action.payload.message || 'An error occurred',
        successMessage: '',
      };

    default:
      return state;
  }
};

export default employeesbyschoollist;
