import {
  GET_CHALLANS,
  GET_CHALLANS_FAIL,
  GET_CHALLANS_SUCCESS,
  ADD_NEW_CHALLAN,
  ADD_CHALLAN_SUCCESS,
  ADD_CHALLAN_FAIL,
  UPDATE_CHALLAN,
  UPDATE_CHALLAN_SUCCESS,
  UPDATE_CHALLAN_FAIL,
  DELETE_CHALLAN,
  DELETE_CHALLAN_SUCCESS,
  DELETE_CHALLAN_FAIL,
  ADD_CHALLAN_WITH_IMAGE,
  ADD_CHALLAN_WITH_IMAGE_SUCCESS,
  ADD_CHALLAN_WITH_IMAGE_FAIL,
} from "./actionTypes";

// ----------- Add Challan with Image API actions -----------
export const addChallanWithImage = (challan, id) => ({
  type: ADD_CHALLAN_WITH_IMAGE,
  payload: { challan, id },
});

export const addChallanWithImageSuccess = challan => ({
  type: ADD_CHALLAN_WITH_IMAGE_SUCCESS,
  payload: challan,
});

export const addChallanWithImageFail = error => ({
  type: ADD_CHALLAN_WITH_IMAGE_FAIL,
  payload: error,
});


// ----------- Offered test list APIs actions -----------------
export const getChallans = id => ({
  type: GET_CHALLANS,
  payload: id,
});

export const getChallansSuccess = challans => ({
  type: GET_CHALLANS_SUCCESS,
  payload: challans,
});

export const getChallansFail = error => ({
  type: GET_CHALLANS_FAIL,
  payload: error,
});


export const addNewChallan = (challan, id) => ({
  type: ADD_NEW_CHALLAN,
  payload: { challan, id },
});

export const addChallanSuccess = challan => ({
  type: ADD_CHALLAN_SUCCESS,
  payload: challan,
});

export const addChallanFail = error => ({
  type: ADD_CHALLAN_FAIL,
  payload: error,
});



export const updateChallan = challan => ({
  type: UPDATE_CHALLAN,
  payload: challan,
});

export const updateChallanSuccess = challan => ({
  type: UPDATE_CHALLAN_SUCCESS,
  payload: challan,
});

export const updateChallanFail = error => ({
  type: UPDATE_CHALLAN_FAIL,
  payload: error,
});

export const deleteChallan = challan => ({
  type: DELETE_CHALLAN,
  payload: challan,
});

export const deleteChallanSuccess = challan => ({
  type: DELETE_CHALLAN_SUCCESS,
  payload: challan,
});

export const deleteChallanFail = error => ({
  type: DELETE_CHALLAN_FAIL,
  payload: error,
});
