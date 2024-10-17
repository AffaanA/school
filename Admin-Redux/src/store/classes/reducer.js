import {
  GET_CLASSES_SUCCESS,
  GET_CLASSES_FAIL,
  ADD_CLASS_SUCCESS,
  ADD_CLASS_FAIL,
  UPDATE_CLASS_SUCCESS,
  UPDATE_CLASS_FAIL,
  DELETE_CLASS_SUCCESS,
  DELETE_CLASS_FAIL,
  CLEAR_ERROR_MESSAGE,
  CLEAR_SUCCESS_MESSAGE,
} from "./actionTypes";

const INIT_STATE = {
  classes: [],
  error: {},
  successMessage:null,
};

const classes = (state = INIT_STATE, action) => {
  switch (action.type) {
      case GET_CLASSES_SUCCESS:
        console.log("classesReducer", action.payload.data, action.payload);
        return {
          ...state,
          classes: action.payload,
        };
  
      case GET_CLASSES_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      
    case ADD_CLASS_SUCCESS:
      return {
        ...state,
        successMessage: 'Class Added Successfully!',
        classes: [...state.classes, action.payload],
      };

    case ADD_CLASS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_CLASS_SUCCESS:
      return {
        ...state,
        classes: state.classes.map(clas =>
          clas.id.toString() === action.payload.id.toString()
            ? { clas, ...action.payload }
            : clas
        ),
      };

    case UPDATE_CLASS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CLASS_SUCCESS:
      return {
        ...state,
        classes: state.classes.filter(
          clas =>
            clas.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_CLASS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case CLEAR_SUCCESS_MESSAGE:
        return {
          ...state,
          successMessage: null,
        };
  
      case CLEAR_ERROR_MESSAGE:
        return {
          ...state,
          error: null,
        };
    default:
      return state;
  }
};

export default classes;