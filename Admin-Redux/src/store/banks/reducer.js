import {
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  ADD_BANK_SUCCESS,
  ADD_BANK_FAIL,
  UPDATE_BANK_SUCCESS,
  UPDATE_BANK_FAIL,
  DELETE_BANK_SUCCESS,
  DELETE_BANK_FAIL,
  CLEAR_ERROR_MSG,
  CLEAR_SUCCESS_MSG,
} from "./actionTypes";

const INIT_STATE = {
  banks: [],
  error: {},
  successMessage:null,
};

const banks = (state = INIT_STATE, action) => {
  switch (action.type) {
      case GET_BANKS_SUCCESS:
        console.log("banksReducer", action.payload.data, action.payload);
        return {
          ...state,
          banks: action.payload,
        };
  
      case GET_BANKS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      
    case ADD_BANK_SUCCESS:
      return {
        ...state,
        successMessage: 'Bank Added Successfully!',
        banks: [...state.banks, action.payload],
      };

    case ADD_BANK_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_BANK_SUCCESS:
      return {
        ...state,
        banks: state.banks.map(bank =>
          bank.id.toString() === action.payload.id.toString()
            ? { bank, ...action.payload }
            : bank
        ),
      };

    case UPDATE_BANK_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_BANK_SUCCESS:
      return {
        ...state,
        banks: state.banks.filter(
          bank =>
            bank.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_BANK_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case CLEAR_SUCCESS_MSG:
        return {
          ...state,
          successMessage: null,
        };
  
      case CLEAR_ERROR_MSG:
        return {
          ...state,
          error: null,
        };
    default:
      return state;
  }
};

export default banks;
