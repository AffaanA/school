import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
//Dashboard 
import Dashboard from "./dashboard/reducer";
import schoolProfile from "./auth/schoolprofile/reducer";
import studentProfile from "./auth/studentprofile/reducer";
import schoolGrades from "./auth/schoolgrades/reducer";
import employees from "./employees/reducer"
import classes from "./classes/reducer";
import teachers from "./teachers-list/reducer";
import schoolSubjects from "./schoolsubjects/reducer";
import classeslist from "./classes-list/reducer";
import students from "./students/reducer";
import family from "./family-list/reducer";
import schoolFee from "./schoolfee/reducer";
import studentslist from "./students-list/reducer";
import banks from "./banks/reducer";
import challans from "./fee-challan/reducer";
import defaulterslist from "./defaulters-list/reducer";
import studentsbyclasslist from "./studentfee/reducer";
import employeesbyschoollist from "./employeeattendence/reducer";
const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  Dashboard,
  studentsbyclasslist,
  employeesbyschoollist,
  schoolProfile,
  studentProfile,
  schoolGrades,
  employees,
  teachers,
  classes,
  banks,
  challans,
  schoolSubjects,
  classeslist,
  defaulterslist,
  students,
  family,
  schoolFee,
  studentslist,
})

export default rootReducer
