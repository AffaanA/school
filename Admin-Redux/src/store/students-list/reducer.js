import {
  GET_STUDENTS_LIST_SUCCESS,
  GET_STUDENTS_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  studentsList: [],
  error: {},
};

const studentslist = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STUDENTS_LIST_SUCCESS:
      return {
        ...state,
        studentsList: action.payload,
      };

    case GET_STUDENTS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default studentslist;
