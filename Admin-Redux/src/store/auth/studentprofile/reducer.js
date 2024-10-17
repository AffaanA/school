import {
  GET_STUDENT_PROFILE_SUCCESS,
  GET_STUDENT_PROFILE_FAIL,
  UPDATE_STUDENT_PROFILE_SUCCESS,
  UPDATE_STUDENT_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  studentProfile: [],
  error: "",
  success: "",
};

const studentProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_STUDENT_PROFILE_SUCCESS:
      console.log("GET_STUDENT_PROFILE_SUCCESS:", action.payload);
      return {
        ...state,
        success: action.payload,
      };

    case GET_STUDENT_PROFILE_FAIL:
      console.log("GET_STUDENT_PROFILE_FAIL:", action.payload);
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_STUDENT_PROFILE_SUCCESS:
      console.log("UPDATE_STUDENT_PROFILE_SUCCESS:", action.payload);
      return {
        ...state,
        studentProfile: state.studentProfile.map(studentProfile =>
          studentProfile.id.toString() === action.payload.id.toString()
            ? { ...studentProfile, ...action.payload }
            : studentProfile
        ),
      };

    case UPDATE_STUDENT_PROFILE_FAIL:
      console.log("UPDATE_STUDENT_PROFILE_FAIL:", action.payload);
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default studentProfile;
