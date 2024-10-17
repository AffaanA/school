import {
  GET_FAMILY_LIST_SUCCESS,
  GET_FAMILY_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  familyList: [],
  error: {},
};

const family = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FAMILY_LIST_SUCCESS:
      console.log("GET_FAMILY_LIST_SUCCESS", action.payload.data, action.payload);
      return {
        ...state,
        familyList: action.payload,
      };

    case GET_FAMILY_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default family;
