import {
  GET_CLASSES,
  GET_CLASSES_FAIL,
  GET_CLASSES_SUCCESS,
  ADD_NEW_CLASS,
  ADD_CLASS_SUCCESS,
  ADD_CLASS_FAIL,
  UPDATE_CLASS,
  UPDATE_CLASS_SUCCESS,
  UPDATE_CLASS_FAIL,
  DELETE_CLASS,
  DELETE_CLASS_SUCCESS,
  DELETE_CLASS_FAIL,
  CLEAR_ERROR_MESSAGE,
  CLEAR_SUCCESS_MESSAGE,
} from "./actionTypes";


// ----------- Offered test list APIs actions -----------------
export const getClasses = id => ({
  type: GET_CLASSES,
  payload: id,
});

export const getClassesSuccess = classes => ({
  type: GET_CLASSES_SUCCESS,
  payload: classes,
});

export const getClassesFail = error => ({
  type: GET_CLASSES_FAIL,
  payload: error,
});


export const addNewClass = (clas, id) => ({
  type: ADD_NEW_CLASS,
  payload: { clas, id },
});

export const addClassSuccess = clas => ({
  type: ADD_CLASS_SUCCESS,
  payload: clas,
});

export const addClassFail = error => ({
  type: ADD_CLASS_FAIL,
  payload: error,
});



export const updateClass = clas => ({
  type: UPDATE_CLASS,
  payload: clas,
});

export const updateClassSuccess = clas => ({
  type: UPDATE_CLASS_SUCCESS,
  payload: clas,
});

export const updateClassFail = error => ({
  type: UPDATE_CLASS_FAIL,
  payload: error,
});

export const deleteClass = clas => ({
  type: DELETE_CLASS,
  payload: clas,
});

export const deleteClassSuccess = clas => ({
  type: DELETE_CLASS_SUCCESS,
  payload: clas,
});

export const deleteClassFail = error => ({
  type: DELETE_CLASS_FAIL,
  payload: error,
});

export const clearSuccessMessage = () => ({
  type: CLEAR_SUCCESS_MESSAGE,
});

export const clearErrorMessage = () => ({
  type: CLEAR_ERROR_MESSAGE,
});