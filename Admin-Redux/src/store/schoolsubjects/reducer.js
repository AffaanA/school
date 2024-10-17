import {
  GET_SCHOOL_SUBJECTS_SUCCESS,
  GET_SCHOOL_SUBJECTS_FAIL,
  UPDATE_SCHOOL_SUBJECTS_SUCCESS,
  UPDATE_SCHOOL_SUBJECTS_FAIL,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAIL,
  GET_CLASS_SUBJECTS_FAIL,
  GET_CLASS_SUBJECTS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  schoolSubjects: [],
  error: "",
  success: "",
};

const schoolSubjects = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SCHOOL_SUBJECTS_SUCCESS:
      console.log("GET_SCHOOL_SUBJECTS_SUCCESS:", action.payload);
      return {
        ...state,
        success: action.payload,
        schoolSubjects: action.payload,
      };

    case GET_SCHOOL_SUBJECTS_FAIL:
      console.log("GET_SCHOOL_SUBJECTS_FAIL:", action.payload);
      return {
        ...state,
        error: action.payload,
      };

      case GET_CLASS_SUBJECTS_SUCCESS:
        console.log("GET_CLASS_SUBJECTS_SUCCESS:", action.payload);
        return {
          ...state,
          success: action.payload,
          schoolSubjects: action.payload,
        };
  
      case GET_CLASS_SUBJECTS_FAIL:
        console.log("GET_SCHOOL_SUBJECTS_FAIL:", action.payload);
        return {
          ...state,
          error: action.payload,
        };
  
    case UPDATE_SCHOOL_SUBJECTS_SUCCESS:
      console.log("UPDATE_SCHOOL_SUBJECTS_SUCCESS:", action.payload);
      return {
        ...state,
        success: 'Employee Added Successfully!',
        schoolSubjects: state.schoolSubjects.map(schoolSubjects =>
          schoolSubjects.id.toString() === action.payload.id.toString()
            ? { ...schoolSubjects, ...action.payload }
            : schoolSubjects
        ),
      };

    case UPDATE_SCHOOL_SUBJECTS_FAIL:
      console.log("UPDATE_SCHOOL_SUBJECTS_FAIL:", action.payload);
      return {
        ...state,
        error: action.payload,
      };

      case DELETE_SUBJECT_SUCCESS:
        return {
          ...state,
          schoolSubjects: state.schoolSubjects.filter(
            schoolSubjects =>
              schoolSubjects.id.toString() !== action.payload.id.toString()
          ),
        };
  
      case DELETE_SUBJECT_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    default:
      return state;
  }
};

export default schoolSubjects;
