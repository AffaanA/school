import {
  GET_SCHOOL_SUBJECTS,
  GET_SCHOOL_SUBJECTS_FAIL,
  GET_SCHOOL_SUBJECTS_SUCCESS,
  UPDATE_SCHOOL_SUBJECTS,
  UPDATE_SCHOOL_SUBJECTS_SUCCESS,
  UPDATE_SCHOOL_SUBJECTS_FAIL,
  DELETE_SUBJECT,
  DELETE_SUBJECT_SUCCESS,
  DELETE_SUBJECT_FAIL,
  GET_CLASS_SUBJECTS,
  GET_CLASS_SUBJECTS_FAIL,
  GET_CLASS_SUBJECTS_SUCCESS,
} from "./actionTypes";

export const getSchoolSubjects = id => ({
  type: GET_SCHOOL_SUBJECTS,
  payload: id,
});

export const getSchoolSubjectsSuccess = schoolSubjects => ({
  type: GET_SCHOOL_SUBJECTS_SUCCESS,
  payload: schoolSubjects,
});

export const getSchoolSubjectsFail = error => ({
  type: GET_SCHOOL_SUBJECTS_FAIL,
  payload: error,
});
export const getClassSubjects = id => ({
  type: GET_CLASS_SUBJECTS,
  payload: id,
});

export const getClassSubjectsSuccess = schoolSubjects => ({
  type: GET_CLASS_SUBJECTS_SUCCESS,
  payload: schoolSubjects,
});

export const getClassSubjectsFail = error => ({
  type: GET_CLASS_SUBJECTS_FAIL,
  payload: error,
});
export const updateSchoolSubjects = (schoolSubjects, id) => ({
  type: UPDATE_SCHOOL_SUBJECTS,
  payload: { schoolSubjects, id },
});

export const updateSchoolSubjectsSuccess = schoolSubjects => ({
  type: UPDATE_SCHOOL_SUBJECTS_SUCCESS,
  payload: schoolSubjects,
});

export const updateSchoolSubjectsFail = error => ({
  type: UPDATE_SCHOOL_SUBJECTS_FAIL,
  payload: error,
});

export const deleteSchoolSubjects = schoolSubjects => ({
  type: DELETE_SUBJECT,
  payload: schoolSubjects,
});

export const deleteSchoolSubjectsSuccess = schoolSubjects => ({
  type: DELETE_SUBJECT_SUCCESS,
  payload: schoolSubjects,
});

export const deleteSchoolSubjectsFail = error => ({
  type: DELETE_SUBJECT_FAIL,
  payload: error,
});