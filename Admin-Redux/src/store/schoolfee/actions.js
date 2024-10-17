import {
  GET_SCHOOL_FEE,
  GET_SCHOOL_FEE_FAIL,
  GET_SCHOOL_FEE_SUCCESS,
  UPDATE_SCHOOL_FEE,
  UPDATE_SCHOOL_FEE_SUCCESS,
  UPDATE_SCHOOL_FEE_FAIL,
} from "./actionTypes";

export const getSchoolFee = (id,queryParams) => ({
  type: GET_SCHOOL_FEE,
  payload: {id,queryParams },
});

export const getSchoolFeeSuccess = schoolFee => ({
  type: GET_SCHOOL_FEE_SUCCESS,
  payload: schoolFee,
});

export const getSchoolFeeFail = error => ({
  type: GET_SCHOOL_FEE_FAIL,
  payload: error,
});

export const updateSchoolFee = (schoolFee, id) => ({
  type: UPDATE_SCHOOL_FEE,
  payload: { schoolFee, id },
});

export const updateSchoolFeeSuccess = schoolFee => ({
  type: UPDATE_SCHOOL_FEE_SUCCESS,
  payload: schoolFee,
});

export const updateSchoolFeeFail = error => ({
  type: UPDATE_SCHOOL_FEE_FAIL,
  payload: error,
});
