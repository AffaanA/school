import { call, put, takeEvery, takeLatest, all, fork } from "redux-saga/effects";

// Crypto Redux States
import { GET_CHARTS_DATA } from "./actionTypes";
import { apiSuccess, apiFail} from "./actions";

// Include Both Helper Files with needed methods
import { getWeeklyData, getYearlyData, getMonthlyData } from "../../helpers/fakebackend_helper";


function* getChartsData({ payload: periodType }) {
    try {
        let response;
        if (periodType === "monthly") {
            response = yield call(getMonthlyData, periodType);
        } else if (periodType === "yearly") {
            response = yield call(getYearlyData, periodType);
        } else if (periodType === "weekly") {
            response = yield call(getWeeklyData, periodType);
        }

        yield put(apiSuccess(GET_CHARTS_DATA, response));
    } catch (error) {
        yield put(apiFail(GET_CHARTS_DATA, error));
    }
}



export function* watchGetChartsData() {
    yield takeLatest(GET_CHARTS_DATA, getChartsData);
   
}

function* dashboardSaga() {
    yield all([fork(watchGetChartsData)]);
}

export default dashboardSaga;
