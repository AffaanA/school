import {
  GET_TEACHERS_LIST_SUCCESS,
  GET_TEACHERS_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  teachersList: [],
  error: {},
};

const teachers = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TEACHERS_LIST_SUCCESS:
      console.log("GET_TEACHERS_LIST_SUCCESS", action.payload.data, action.payload);
      return {
        ...state,
        teachersList: action.payload,
      };

    case GET_TEACHERS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default teachers;
