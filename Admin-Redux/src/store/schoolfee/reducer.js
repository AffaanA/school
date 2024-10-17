import {
  GET_SCHOOL_FEE_SUCCESS,
  GET_SCHOOL_FEE_FAIL,
  UPDATE_SCHOOL_FEE_SUCCESS,
  UPDATE_SCHOOL_FEE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  schoolFee: [],
  error: "",
  success: "",
};

const schoolFee = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SCHOOL_FEE_SUCCESS:
      console.log("GET_SCHOOL_FEE_SUCCESS:", action.payload);
      return {
        ...state,
        success: action.payload,
      };

    case GET_SCHOOL_FEE_FAIL:
      console.log("GET_SCHOOL_FEE_FAIL:", action.payload);
      return {
        ...state,
        error: action.payload,
      };

    // case UPDATE_SCHOOL_FEE_SUCCESS:
    //   console.log("UPDATE_SCHOOL_FEE_SUCCESS:", action.payload);
    //   return {
    //     ...state,
    //     success:"Fee processed Successfully",
    //     schoolFee: state.schoolFee.map(schoolFee =>
    //       schoolFee.id.toString() === action.payload.id.toString()
    //         ? { ...schoolFee, ...action.payload }
    //         : schoolFee
    //     ),
    //   };
    case UPDATE_SCHOOL_FEE_SUCCESS:
      console.log("UPDATE_SCHOOL_FEE_SUCCESS:", action.payload);
      return {
        ...state,
        success: action.payload.data.message || "Fee processed successfully",
        error: null, // Clear any previous error
        schoolFee: state.schoolFee.map(schoolFee =>
          schoolFee.id.toString() === action.payload.data.id.toString()
            ? { ...schoolFee, ...action.payload.data }
            : schoolFee
        ),
      };

    case UPDATE_SCHOOL_FEE_FAIL:
      console.log("UPDATE_SCHOOL_FEE_FAIL:", action.payload);
      return {
        ...state,
        error: action.payload.message || "Failed to process fee",
        success: null, // Clear any previous success message
      };
    default:
      return state;
  }
};

export default schoolFee;
