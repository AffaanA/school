import {
  GET_CHALLANS_SUCCESS,
  GET_CHALLANS_FAIL,
  ADD_CHALLAN_SUCCESS,
  ADD_CHALLAN_FAIL,
  UPDATE_CHALLAN_SUCCESS,
  UPDATE_CHALLAN_FAIL,
  DELETE_CHALLAN_SUCCESS,
  DELETE_CHALLAN_FAIL,
  ADD_CHALLAN_WITH_IMAGE_SUCCESS,
  ADD_CHALLAN_WITH_IMAGE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  challans: [],
  errorMessage: '',
  successMessage: null,
};

const challans = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CHALLANS_SUCCESS:
      console.log("challansReducer", action.payload.data, action.payload);
      return {
        ...state,
        challans: action.payload,
      };

    case GET_CHALLANS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CHALLAN_SUCCESS:
      console.log("erooororrrrr", action.payload, action.payload.message)
      return {
        ...state,
        successMessage: action.payload.message,
        errorMessage: '',
        challans: [ action.payload.data],
        // challans: [...state.challans, action.payload.data],
      };

    case ADD_CHALLAN_FAIL:
      return {
        ...state,
        error: action.payload,
        successMessage: '',
      };

      case ADD_CHALLAN_WITH_IMAGE_SUCCESS:
        return {
          ...state,
          successMessage: "Challan with Image Added Successfully!",
          errorMessage: '',
          challans: [...state.challans, action.payload],
        };
  
      case ADD_CHALLAN_WITH_IMAGE_FAIL:
        console.log("challansReducerfailimggggg", action.payload,action.payload.message);
        return {
          ...state,
          errorMessage: action.payload.message,
          successMessage: '',
        };
    case UPDATE_CHALLAN_SUCCESS:
      return {
        ...state,
        challans: state.challans.map(challan =>
          challan.id.toString() === action.payload.id.toString()
            ? { challan, ...action.payload }
            : challan
        ),
      };

    case UPDATE_CHALLAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CHALLAN_SUCCESS:
      return {
        ...state,
        challans: state.challans.filter(
          challan => challan.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_CHALLAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default challans;
