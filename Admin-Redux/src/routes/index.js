import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard-Admin/index";
import DashboardStudent from "../pages/Dashboard-Student";

//Pages
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import SchoolProfile from "../pages/Authentication/SchoolProfile";
import StudentProfile from "../pages/Authentication/StudentProfile";
import GradeForm from "../pages/Grades/schoolgrades";
import SubjectForm from "../pages/Subjects/schoolsubjects";
import employeesList from "../pages/Employees/employees-list";
import AddEmployeePage from "../pages/Employees/add-employees";
import studentsList from "../pages/Students/students-list";
import addStudents from "../pages/Students/add-students";

import ClassesList from "../pages/Classes/all-classes";
import AddClassPage from "../pages/Classes/add-new";
import addBank from "../pages/Banks/add-bank";
import createChallan from "../pages/Fee/create-challan";
import collectFee from "../pages/Fee/collect-fee";
import feeDefaulters from "../pages/Fee/fee-defaulters";
import addAttendence from "../pages/Attendence/add-attendence";
import addEmployeeAttendence from "../pages/Attendence/add-employee-attendence";
import employeeattendencelist from "../pages/Attendence/attendence-list-employees";
import studentattendencelist from "../pages/Attendence/attendence-list-students";
import subjectsList from "../pages/Subjects/subjects-list";
import addFee from "../pages/Fee/add-fee";
import LandingPage from "../pages/Landing/LandingPage";
const authProtectedRoutes = [
  { path: "/dashboard-auth", component: Dashboard },
  // { path: "/", exact: true, component: () => <Redirect to="/login" /> },
];

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
  { path: "/", exact: true, component: LandingPage },

  { path: "/pages-404", component: Pages404 },
  { path: "/pages-500", component: Pages500 },
];
const adminauthProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/school-profile", component: SchoolProfile },
  { path: "/school-grade", component: GradeForm },
  { path: "/employee", component: employeesList },
  { path: "/add-employee", component: AddEmployeePage },
  { path: "/classes", component: ClassesList },
  { path: "/add-class", component: AddClassPage },
  { path: "/subjects", component: SubjectForm },
  { path: "/all-subjects", component: subjectsList },

  { path: "/student", component: studentsList },
  { path: "/add-student", component: addStudents },
  { path: "/add-fee", component: addFee },
  { path: "/bank", component: addBank },
  { path: "/challan", component: createChallan },
  { path: "/collect-fee", component: collectFee },
  { path: "/fee-defaulters", component: feeDefaulters },
  { path: "/add-attendence", component: addAttendence },
  { path: "/employee-attendence", component: addEmployeeAttendence },
  { path: "/employee-attendencelist", component: employeeattendencelist },
  { path: "/student-attendencelist", component: studentattendencelist },
];
const studentauthProtectedRoutes = [
  { path: "/dashboard-student", component: DashboardStudent },
  { path: "/student-profile", component: StudentProfile },
];
export {
  authProtectedRoutes,
  publicRoutes,
  adminauthProtectedRoutes,
  studentauthProtectedRoutes,
};
