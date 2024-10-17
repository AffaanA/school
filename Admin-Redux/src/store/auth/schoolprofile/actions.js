import {
  GET_SCHOOL_PROFILE,
  GET_SCHOOL_PROFILE_FAIL,
  GET_SCHOOL_PROFILE_SUCCESS,
  UPDATE_SCHOOL_PROFILE,
  UPDATE_SCHOOL_PROFILE_SUCCESS,
  UPDATE_SCHOOL_PROFILE_FAIL,
} from "./actionTypes";

export const getSchoolProfile = id => ({
  type: GET_SCHOOL_PROFILE,
  payload: id,
});

export const getSchoolProfileSuccess = schoolProfile => ({
  type: GET_SCHOOL_PROFILE_SUCCESS,
  payload: schoolProfile,
});

export const getSchoolProfileFail = error => ({
  type: GET_SCHOOL_PROFILE_FAIL,
  payload: error,
});

export const updateSchoolProfile = (schoolProfile, id) => ({
  type: UPDATE_SCHOOL_PROFILE,
  payload: { schoolProfile, id },
});

export const updateSchoolProfileSuccess = schoolProfile => ({
  type: UPDATE_SCHOOL_PROFILE_SUCCESS,
  payload: schoolProfile,
});

export const updateSchoolProfileFail = error => ({
  type: UPDATE_SCHOOL_PROFILE_FAIL,
  payload: error,
});
