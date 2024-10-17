import {
  GET_STUDENTS_BY_CLASS_SUCCESS,
  GET_STUDENTS_BY_CLASS_FAIL,
  GET_STUDENTS_ATTENDENCE_SUCCESS,
  GET_STUDENTS_ATTENDENCE_FAIL,
  ADD_ATTENDENCE_FAIL,
  ADD_ATTENDENCE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  studentsbyclassList: [],
  error: {},
  errorMessage: '',
  successMessage: null,
};

const studentsbyclasslist = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STUDENTS_BY_CLASS_SUCCESS:
      console.log("GET_STUDENTS_BY_CLASS_SUCCESS payload:", action.payload);
      return {
        ...state,
        studentsbyclassList: action.payload,
        successMessage: '',
      };

    case GET_STUDENTS_BY_CLASS_FAIL:
      console.log("GET_STUDENTS_BY_CLASS_FAIL payload:", action.payload);
      return {
        ...state,
        error: action.payload,
        errorMessage: action.payload.message || 'An error occurred',
        successMessage: '',
      };

        
      case GET_STUDENTS_ATTENDENCE_SUCCESS:
        console.log("GET_STUDENTS_ATTENDENCE_SUCCESS payload:", action.payload);
        return {
          ...state,
          studentsbyclassList: action.payload.attendances,
          successMessage: '',
        };
  
      case GET_STUDENTS_ATTENDENCE_FAIL:
        console.log("GET_STUDENTS_ATTENDENCE_FAIL payload:", action.payload);
        return {
          ...state,
          error: action.payload,
          errorMessage: action.payload.message || 'An error occurred',
          successMessage: '',
        };
  
   
    case ADD_ATTENDENCE_SUCCESS:
      console.log("ADD_ATTENDENCE_SUCCESS payload:", action.payload);
      return {
        ...state,
        successMessage: action.payload.message,
        errorMessage: '',
        studentsbyclassList: action.payload,
        // studentsbyclassList: [...state.studentsbyclassList, ...action.payload],
      };

    case ADD_ATTENDENCE_FAIL:
      console.log("ADD_ATTENDENCE_FAIL payload:", action.payload);
      return {
        ...state,
        errorMessage: action.payload.message || 'An error occurred',
        successMessage: '',
      };

    default:
      return state;
  }
};

export default studentsbyclasslist;
