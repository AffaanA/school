//ORIGINAL URLS

const API_ENDPOINT = process.env.REACT_APP_BACKENDURL;

// -------------- MY URLS --------------
export const POST_LOGIN = `${API_ENDPOINT}/api/account/login/`;
export const POST_REGISTER = `${API_ENDPOINT}/api/account/register/`;

// PASSWORD RESET
export const POST_FORGET_PASSWORD = `${API_ENDPOINT}/api/account/password_reset/`;
export const POST_CONFIRM_PASSWORD = `${API_ENDPOINT}/api/account/password_reset/confirm/`;
export const POST_CHANGE_PASSWORD = `${API_ENDPOINT}/api/account/change-password/`;

// School PROFILES
export const GET_SCHOOL_PROFILE = `${API_ENDPOINT}/api/school/school-profile`;
export const UPDATE_SCHOOL_PROFILE = `${API_ENDPOINT}/api/school/school-profile`;

export const GET_STUDENT_PROFILE = `${API_ENDPOINT}/api/student/student-profile`;
export const UPDATE_STUDENT_PROFILE = `${API_ENDPOINT}/api/student/student-profile`;

export const GET_SCHOOL_GRADES = `${API_ENDPOINT}/api/school/grades-list`;
export const UPDATE_SCHOOL_GRADES = `${API_ENDPOINT}/api/school/grades-update`;

export const GET_SCHOOL_SUBJECTS = `${API_ENDPOINT}/api/school/subjects-list`;
export const GET_CLASS_SUBJECTS = `${API_ENDPOINT}/api/school/subjects-list-class`;
export const UPDATE_SCHOOL_SUBJECTS = `${API_ENDPOINT}/api/school/subjects-update`;
export const DELETE_SUBJECT = `${API_ENDPOINT}/api/school/subjects-update`;
export const GET_EMPLOYEES =`${API_ENDPOINT}/api/employees/employee`;
export const ADD_NEW_EMPLOYEE = `${API_ENDPOINT}/api/employees/employee`;
export const UPDATE_EMPLOYEE = `${API_ENDPOINT}/api/employees/employee-update-del`;
export const DELETE_EMPLOYEE = `${API_ENDPOINT}/api/employees/employee-update-del`;

export const GET_TEACHERS_LIST =`${API_ENDPOINT}/api/school/teacher`;
export const GET_CLASSES_LIST = `${API_ENDPOINT}/api/school/classlist`;
export const GET_FAMILY_LIST = `${API_ENDPOINT}/api/student/familylist`;
export const GET_STUDENTS_LIST = `${API_ENDPOINT}/api/school/studentlist`;
export const GET_DEFAULTERS_LIST = `${API_ENDPOINT}/api/school/defaulterslist`;
export const UPDATE_DEFAULTERS_LIST = `${API_ENDPOINT}/api/school/defaulterslist`;
export const GET_STUDENT_BY_CLASS = `${API_ENDPOINT}/api/student/class`;
export const ADD_ATTENDENCE = `${API_ENDPOINT}/api/student/attendance-submit`;
export const GET_STUDENTS_ATTENDENCE = `${API_ENDPOINT}/api/student/attendancelist-student`;
export const GET_EMPLOYEES_BY_SCHOOL = `${API_ENDPOINT}/api/employees/employees-list`;
export const ADD_EMPLOYEES_ATTENDENCE = `${API_ENDPOINT}/api/employees/attendance-employee`;
export const GET_EMPLOYEES_ATTENDENCE = `${API_ENDPOINT}/api/employees/attendancelist-employee`;
export const GET_CLASSES = `${API_ENDPOINT}/api/school/classes`;
export const ADD_NEW_CLASS = `${API_ENDPOINT}/api/school/classes`;
export const UPDATE_CLASS = `${API_ENDPOINT}/api/school/class`;
export const DELETE_CLASS = `${API_ENDPOINT}/api/school/class`;

export const GET_BANKS = `${API_ENDPOINT}/api/school/banks`;
export const ADD_NEW_BANK = `${API_ENDPOINT}/api/school/banks`;
export const UPDATE_BANK = `${API_ENDPOINT}/api/school/banks-update`;
export const DELETE_BANK = `${API_ENDPOINT}/api/school/banks-update`;

export const GET_STUDENTS =`${API_ENDPOINT}/api/student/student`;
export const ADD_NEW_STUDENT = `${API_ENDPOINT}/api/student/student`;
export const UPDATE_STUDENT = `${API_ENDPOINT}/api/student/student-update-del`;
export const DELETE_STUDENT = `${API_ENDPOINT}/api/student/student-update-del`;

export const GET_SCHOOL_FEE = `${API_ENDPOINT}/api/school/get-fee`;
export const UPDATE_SCHOOL_FEE = `${API_ENDPOINT}/api/school/create-fee`;
export const ADD_NEW_CHALLAN = `${API_ENDPOINT}/api/school/fee-challan`;
export const ADD_NEW_CHALLAN_WITH_IMAGE = `${API_ENDPOINT}/api/school/upload-challan/`;



// -------------- TEMPLATES URLS --------------
//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register"

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login"
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login"
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
export const POST_EDIT_PROFILE = "/post-fake-profile"

//PRODUCTS
export const GET_PRODUCTS = "/products"
export const GET_PRODUCTS_DETAIL = "/product"
export const ADD_NEW_PROJECT = "/add/product"
export const UPDATE_PROJECT = "/update/product"
export const DELETE_PROJECT = "/delete/product"

//CALENDER
export const GET_EVENTS = "/events"
export const ADD_NEW_EVENT = "/add/event"
export const UPDATE_EVENT = "/update/event"
export const DELETE_EVENT = "/delete/event"
export const GET_CATEGORIES = "/categories"

//CHATS
export const GET_CHATS = "/chats"
export const GET_GROUPS = "/groups"
export const GET_CONTACTS = "/contacts"
export const GET_MESSAGES = "/messages"
export const ADD_MESSAGE = "/add/messages"

//ORDERS
export const GET_ORDERS = "/orders"
export const ADD_NEW_ORDER = "/add/order"
export const UPDATE_ORDER = "/update/order"
export const DELETE_ORDER = "/delete/order"

//CART DATA
export const GET_CART_DATA = "/cart"

//CUSTOMERS
export const GET_CUSTOMERS = "/customers"
export const ADD_NEW_CUSTOMER = "/add/customer"
export const UPDATE_CUSTOMER = "/update/customer"
export const DELETE_CUSTOMER = "/delete/customer"

//SHOPS
export const GET_SHOPS = "/shops"

//CRYPTO
export const GET_WALLET = "/wallet"
export const GET_CRYPTO_ORDERS = "/crypto/orders"

//INVOICES
export const GET_INVOICES = "/invoices"
export const GET_INVOICE_DETAIL = "/invoice"

//PROJECTS
export const GET_PROJECTS = "/projects"
export const GET_PROJECT_DETAIL = "/project"

//TASKS
export const GET_TASKS = "/tasks"

//CONTACTS
export const GET_USERS = "/users"
export const GET_USER_PROFILE = "/user"
export const ADD_NEW_USER = "/add/user"
export const UPDATE_USER = "/update/user"
export const DELETE_USER = "/delete/user"

//Mails
export const GET_INBOX_MAILS = "/inboxmails"
export const ADD_NEW_INBOX_MAIL = "/add/inboxmail"
export const DELETE_INBOX_MAIL = "/delete/inboxmail"

//starred mail
export const GET_STARRED_MAILS = "/starredmails"

//important mails
export const GET_IMPORTANT_MAILS = "/importantmails"

//Draft mail
export const GET_DRAFT_MAILS = "/draftmails"

//Send mail
export const GET_SENT_MAILS = "/sentmails"

//Trash mail
export const GET_TRASH_MAILS = "/trashmails"

//dashboard charts data
export const GET_WEEKLY_DATA = "/weekly-data"
export const GET_YEARLY_DATA = "/yearly-data"
export const GET_MONTHLY_DATA = "/monthly-data"

export const TOP_SELLING_DATA = "/top-selling-data"

export const GET_EARNING_DATA = "/earning-charts-data"