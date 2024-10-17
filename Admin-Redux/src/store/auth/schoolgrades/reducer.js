import {
  GET_SCHOOL_GRADES_SUCCESS,
  GET_SCHOOL_GRADES_FAIL,
  UPDATE_SCHOOL_GRADES_SUCCESS,
  UPDATE_SCHOOL_GRADES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  schoolGrades: [],
  error: "",
  success: "",
};

const schoolGrades = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SCHOOL_GRADES_SUCCESS:
      return {
        ...state,
        success: action.payload,
      };

    case GET_SCHOOL_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_SCHOOL_GRADES_SUCCESS:
      return {
        ...state,
        schoolGrades: state.schoolGrades.map(schoolGrades =>
          schoolGrades.id.toString() === action.payload.id.toString()
            ? { ...schoolGrades, ...action.payload }
            : schoolGrades
        ),
      };

    case UPDATE_SCHOOL_GRADES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default schoolGrades;
