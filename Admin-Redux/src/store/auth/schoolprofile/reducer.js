import {
  GET_SCHOOL_PROFILE_SUCCESS,
  GET_SCHOOL_PROFILE_FAIL,
  UPDATE_SCHOOL_PROFILE_SUCCESS,
  UPDATE_SCHOOL_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  schoolProfile: [],
  error: "",
  success: "",
};

const schoolProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SCHOOL_PROFILE_SUCCESS:
      console.log("GET_SCHOOL_PROFILE_SUCCESS:", action.payload);
      return {
        ...state,
        success: action.payload,
      };

    case GET_SCHOOL_PROFILE_FAIL:
      console.log("GET_SCHOOL_PROFILE_FAIL:", action.payload);
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_SCHOOL_PROFILE_SUCCESS:
      console.log("UPDATE_SCHOOL_PROFILE_SUCCESS:", action.payload);
      return {
        ...state,
        schoolProfile: state.schoolProfile.map(schoolProfile =>
          schoolProfile.id.toString() === action.payload.id.toString()
            ? { ...schoolProfile, ...action.payload }
            : schoolProfile
        ),
      };

    case UPDATE_SCHOOL_PROFILE_FAIL:
      console.log("UPDATE_SCHOOL_PROFILE_FAIL:", action.payload);
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default schoolProfile;
