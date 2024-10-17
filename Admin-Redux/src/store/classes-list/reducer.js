import {
  GET_CLASSES_LIST_SUCCESS,
  GET_CLASSES_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  classesList: [],
  error: {},
};

const classeslist = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CLASSES_LIST_SUCCESS:
      return {
        ...state,
        classesList: action.payload,
      };

    case GET_CLASSES_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default classeslist;
