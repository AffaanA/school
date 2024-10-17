import {
  GET_SCHOOL_GRADES,
  GET_SCHOOL_GRADES_FAIL,
  GET_SCHOOL_GRADES_SUCCESS,
  UPDATE_SCHOOL_GRADES,
  UPDATE_SCHOOL_GRADES_SUCCESS,
  UPDATE_SCHOOL_GRADES_FAIL,
} from "./actionTypes";

export const getSchoolGrades = id => ({
  type: GET_SCHOOL_GRADES,
  payload: id,
});

export const getSchoolGradesSuccess = schoolGrades => ({
  type: GET_SCHOOL_GRADES_SUCCESS,
  payload: schoolGrades,
});

export const getSchoolGradesFail = error => ({
  type: GET_SCHOOL_GRADES_FAIL,
  payload: error,
});

export const updateSchoolGrades = (schoolGrades, id) => ({
  type: UPDATE_SCHOOL_GRADES,
  payload: { schoolGrades, id },
});

export const updateSchoolGradesSuccess = schoolGrades => ({
  type: UPDATE_SCHOOL_GRADES_SUCCESS,
  payload: schoolGrades,
});

export const updateSchoolGradesFail = error => ({
  type: UPDATE_SCHOOL_GRADES_FAIL,
  payload: error,
});
