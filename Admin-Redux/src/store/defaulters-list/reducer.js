import {
  GET_DEFAULTERS_LIST_SUCCESS,
  GET_DEFAULTERS_LIST_FAIL,
  UPDATE_DEFAULTERS_LIST_SUCCESS,
  UPDATE_DEFAULTERS_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  defaultersList: [],
  error: {},
};

const defaulterslist = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DEFAULTERS_LIST_SUCCESS:
      console.log("GET_DEFAULTERS_LIST_SUCCESS", action.payload.data, action.payload);
      return {
        ...state,
        defaultersList: action.payload,
      };

    case GET_DEFAULTERS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_DEFAULTERS_LIST_SUCCESS:
      console.log("UPDATE_DEFAULTERS_LIST_SUCCESS", action.payload);
      return {
        ...state,
        defaultersList: action.payload,  // Assuming the updated list is returned
      };

    case UPDATE_DEFAULTERS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default defaulterslist;
