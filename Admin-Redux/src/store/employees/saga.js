import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EMPLOYEES,
  ADD_NEW_EMPLOYEE,
  DELETE_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from "./actionTypes";

import {
  getEmployeesSuccess,
  getEmployeesFail,
  addEmployeeFail,
  addEmployeeSuccess,
  updateEmployeeSuccess,
  updateEmployeeFail,
  deleteEmployeeSuccess,
  deleteEmployeeFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getEmployees,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../helpers/django_api_helper";

function* fetchEmployees(object) {
  try {
    const response = yield call(getEmployees, object.payload);
    console.log("responseapi",response)
    yield put(getEmployeesSuccess(response));
  } catch (error) {
    yield put(getEmployeesFail(error));
  }
}

// function* onAddNewEmployee(object) {
//   try {
//     const response = yield call(
//       addNewEmployee,
//       object.payload.employee,
//       object.payload.id
//     );
//     yield put(addEmployeeSuccess(response));
//   } catch (error) {
//     yield put(addEmployeeFail(error));
//   }
// }
function* onAddNewEmployee(action) {
  try {
    const response = yield call(
      addNewEmployee,
      action.payload.employee,
      action.payload.id
    );
    if (response.status === 201) {
      yield put(addEmployeeSuccess(response.data));
    }
  } catch (error) {
    yield put(addEmployeeFail(error));
  }
}
function* onUpdateEmployee({ payload: employee }) {
  try {
    const response = yield call(updateEmployee, employee);
    yield put(updateEmployeeSuccess(response));
  } catch (error) {
    yield put(updateEmployeeFail(error));
  }
}

function* onDeleteEmployee({ payload: employee }) {
  try {
    const response = yield call(deleteEmployee, employee);
    yield put(deleteEmployeeSuccess(response));
  } catch (error) {
    yield put(deleteEmployeeFail(error));
  }
}

function* employeesSaga() {
  yield takeEvery(GET_EMPLOYEES, fetchEmployees);
  yield takeEvery(ADD_NEW_EMPLOYEE, onAddNewEmployee);
  yield takeEvery(UPDATE_EMPLOYEE, onUpdateEmployee);
  yield takeEvery(DELETE_EMPLOYEE, onDeleteEmployee);
}

export default employeesSaga;
