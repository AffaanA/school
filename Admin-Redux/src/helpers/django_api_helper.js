import { identity } from "@fullcalendar/core";
import axios from "axios";
import { del, get, post, put } from "./api_helper";
import authHeader from "./django-token-access/auth-token-header";
import * as url from "./url_helper";

function getHeader(token) {
  // If there is some token then return the header with token
  if (token) {
    return {
      Authorization: "Token " + token,
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    };
  } else {
    return {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    };
  }
}

// Post Register Information to create account
export const postRegister = user => {
  console.log("django user", user);
  return axios
    .post(url.POST_REGISTER, user)
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })

    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};
export const postLogin = user => {
  let formData = new FormData();
  formData.append("username", user.username);
  formData.append("password", user.password);
  return axios.post(url.POST_LOGIN, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Lab Profile Requests START -------------
export const getSchoolProfile = id =>
  get(`${url.GET_SCHOOL_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateSchoolProfile = (labProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", labProfile.name);
  formData.append("logo", labProfile.logo);
  formData.append("website", labProfile.website);
  // formData.append("email", labProfile.email);
  formData.append("phone", labProfile.phone);
  formData.append("address", labProfile.address);
  formData.append("city", labProfile.city);
  formData.append("target_line", labProfile.target_line);

  return axios.put(`${url.UPDATE_SCHOOL_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getSchoolGrades = id =>
  get(`${url.GET_SCHOOL_GRADES}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateSchoolGrades = (grades, id) => {
  let formData = new FormData();
  const gradesJson = JSON.stringify(grades);
  formData.append("grades", gradesJson);
  console.log("ypgrade grades", grades);
  return axios.put(`${url.UPDATE_SCHOOL_GRADES}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getEmployees = id =>
  get(`${url.GET_EMPLOYEES}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewEmployee = (employee, id) => {
  let formData = new FormData();
  formData.append("name", employee.name);
  formData.append("email", employee.email);
  formData.append("password", employee.password);
  formData.append("phone", employee.phone);
  formData.append("education", employee.education);
  formData.append("monthly_salary", employee.monthly_salary);
  formData.append("address", employee.address);
  formData.append("date_joined", employee.date_joined);
  formData.append("dob", employee.dob);
  formData.append("experience", employee.experience);
  formData.append("national_id", employee.national_id);
  formData.append("father_husband_name", employee.father_husband_name);
  formData.append("blood_group", employee.blood_group);
  formData.append("type", 3);
  return axios.post(`${url.ADD_NEW_EMPLOYEE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateEmployee = employee => {
  let formData = new FormData();

  formData.append("id", employee.id);
  formData.append("name", employee.name);
  formData.append("email", employee.email);
  formData.append("phone", employee.phone);
  formData.append("education", employee.education);
  formData.append("monthly_salary", employee.monthly_salary);
  formData.append("address", employee.address);
  formData.append("date_joined", employee.date_joined);
  formData.append("dob", employee.dob);
  formData.append("experience", employee.experience);
  formData.append("national_id", employee.national_id);
  formData.append("father_husband_name", employee.father_husband_name);
  formData.append("blood_group", employee.blood_group);

  return axios.put(`${url.UPDATE_EMPLOYEE}/${employee.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deleteEmployee = offeredTest =>
  del(`${url.DELETE_EMPLOYEE}/${offeredTest.id}`, {
    headers: getHeader(authHeader()),
  });

export const getTeachersList = id =>
  get(`${url.GET_TEACHERS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getClasses = id =>
  get(`${url.GET_CLASSES}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const addNewClass = (sclcls, id) => {
  let formData = new FormData();
  formData.append("name", sclcls.name);
  formData.append("monthly_fee", sclcls.monthly_fee);
  
  sclcls.teacher.forEach(teacherId => formData.append("teacher", teacherId));
  return axios.post(`${url.ADD_NEW_CLASS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateClass = sclcls => {
  let formData = new FormData();
  formData.append("name", sclcls.name);
  formData.append("monthly_fee", sclcls.monthly_fee);
  formData.append("teacher", sclcls.teacher);
  sclcls.teacher.forEach(teacherId => formData.append("teacher", teacherId));
  return axios.put(`${url.UPDATE_CLASS}/${sclcls.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deleteClass = delclass =>
  del(`${url.DELETE_CLASS}/${delclass.id}`, {
    headers: getHeader(authHeader()),
  });
export const getSchoolSubjects = id =>
  get(`${url.GET_SCHOOL_SUBJECTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getEmployeesAttendence = id =>
  get(`${url.GET_EMPLOYEES_ATTENDENCE}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const getStudentsAttendence = id =>
    get(`${url.GET_STUDENTS_ATTENDENCE}/${id}`, {
      headers: getHeader(authHeader()),
    });
export const updateSchoolSubjects = (grades, id) => {
  console.log("django api helperr", grades, id);
  let formData = new FormData();
  const gradesJson = JSON.stringify(grades);
  formData.append("subjects", gradesJson);
  return axios.put(`${url.UPDATE_SCHOOL_SUBJECTS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deleteSchoolSubjects = offeredTest => {
  console.log("django api helperr", offeredTest);

  return del(`${url.DELETE_SUBJECT}/${offeredTest.id}`, {
    headers: getHeader(authHeader()),
  });
};
export const getClassSubjects = id =>
  get(`${url.GET_CLASS_SUBJECTS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getClassesList = id =>
  get(`${url.GET_CLASSES_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getStudents = id =>
  get(`${url.GET_STUDENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewStudent = (student, id) => {
  console.log("api helper", student, id);
  let formData = new FormData();
  formData.append("student_name", student.student_name);
  formData.append("type", 4);
  formData.append("picture", student.picture); // Assuming student.picture is a file object
  formData.append("registration_no", student.registration_no);
  formData.append("date_of_admission", student.date_of_admission);
  formData.append("student_class", student.student_class);
  formData.append("discount_in_fee", student.discount_in_fee);
  formData.append("mobile_no", student.mobile_no);
  formData.append("date_of_birth", student.date_of_birth);
  formData.append("gender", student.gender);
  formData.append("identification_mark", student.identification_mark);
  formData.append("blood_group", student.blood_group);
  formData.append("total_siblings", student.total_siblings);
  formData.append("religion", student.religion);
  formData.append("disease", student.disease);
  formData.append("address", student.address);
  formData.append("birth_form_id", student.birth_form_id);
  formData.append("cast", student.cast);
  formData.append("previous_school", student.previous_school);
  formData.append(
    "previous_id_board_roll_no",
    student.previous_id_board_roll_no
  );
  formData.append("additional_note", student.additional_note);
  formData.append("orphan_student", student.orphan_student);
  formData.append("osc", student.osc);
  formData.append("email", student.email);
  formData.append("password", student.password);

  formData.append("father_name", student.father_name);
  formData.append("father_education", student.father_education);
  formData.append("father_national_id", student.father_national_id);
  formData.append("father_mobile_no", student.father_mobile_no);
  formData.append("father_occupation", student.father_occupation);
  formData.append("father_profession", student.father_profession);
  formData.append("father_income", student.father_income);

  formData.append("mother_name", student.mother_name);
  formData.append("mother_education", student.mother_education);
  formData.append("mother_national_id", student.mother_national_id);
  formData.append("mother_mobile_no", student.mother_mobile_no);
  formData.append("mother_occupation", student.mother_occupation);
  formData.append("mother_profession", student.mother_profession);
  formData.append("mother_income", student.mother_income);

  // Family Selection
  formData.append("select_family", student.select_family);
  console.log("APICALLL API HELPER", formData);
  return axios
    .post(`${url.ADD_NEW_STUDENT}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getHeader(authHeader()), // Ensure authHeader() returns the necessary authorization headers
      },
    })
    .then(response => {
      console.log("API call success:", response);
      return response;
    })
    .catch(error => {
      console.error("API call error:", error);
      throw error;
    });
};

export const updateStudent = employee => {
  let formData = new FormData();

  formData.append("id", employee.id);
  formData.append("student_name", employee.student_name);
  formData.append("email", employee.email);
  formData.append("mobile_no", employee.phone);
  formData.append("previous_id_board_roll_no", employee.previous_id_board_roll_no);
  formData.append("address", employee.address);
  formData.append("date_of_admission", employee.date_of_admission);
  formData.append("date_of_birth", employee.date_of_birth);
  formData.append("birth_form_id", employee.birth_form_id);
  formData.append("blood_group", employee.blood_group);

  return axios.put(`${url.UPDATE_STUDENT}/${employee.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deleteStudent = offeredTest =>
  del(`${url.DELETE_STUDENT}/${offeredTest.id}`, {
    headers: getHeader(authHeader()),
  });

export const getFamilyList = id =>
  get(`${url.GET_FAMILY_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getStudentProfile = id =>
  get(`${url.GET_STUDENT_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateStudentProfile = (labProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", labProfile.name);
  formData.append("logo", labProfile.logo);
  formData.append("website", labProfile.website);
  // formData.append("email", labProfile.email);
  formData.append("phone", labProfile.phone);
  formData.append("address", labProfile.address);
  formData.append("city", labProfile.city);
  formData.append("target_line", labProfile.target_line);

  return axios.put(`${url.UPDATE_STUDENT_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getStudentsByClass = id =>
  get(`${url.GET_STUDENT_BY_CLASS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getSchoolFee = (id, feeParticularsFor) => {
  console.log("feedjangoapihelper - feeParticularsFor:", feeParticularsFor, "id:", id);
  // Initialize queryParams based on feeParticularsFor value
  let queryParams = '';

  if (feeParticularsFor === 'all_students') {
    queryParams = `?fee_particulars_for=all_students`;
  } else {
    // Assuming feeParticularsFor is an object for specific class or student
    const { fee_particulars_for, class_id, student_id } = feeParticularsFor;
    queryParams = `?fee_particulars_for=${fee_particulars_for}`;

    if (fee_particulars_for === 'specific_class' && class_id) {
      queryParams += `&class_id=${class_id}`;
    } else if (fee_particulars_for === 'specific_student' && student_id) {
      queryParams += `&student_id=${student_id}`;
    }
  }

  console.log("Final queryParams:", queryParams);
  return get(`${url.GET_SCHOOL_FEE}/${id}${queryParams}`, {
    headers: getHeader(authHeader()),
  });
};

export const updateSchoolFee = (data, id) => {
  const fee = data.fee;
  console.log("Received fee object:", fee); // Should show the nested fee object

  let formData = new FormData();

  // Check if `fee` is defined before appending its properties
  if (fee) {
    formData.append("fee_particulars_for", data.particular_type || ""); // Use data.particular_type for the type
    formData.append("class_id", fee.class_id || "");
    formData.append("student", fee.student || ""); // Assuming `student` might be in the `fee` object
    formData.append("month", fee.month || ""); // Assuming `month` might be in the `fee` object
    formData.append("admission_fee", fee.admission_fee || "");
    formData.append("registration_fee", fee.registration_fee || "");
    formData.append("art_material", fee.art_material || "");
    formData.append("transport", fee.transport || "");
    formData.append("books", fee.books || "");
    formData.append("uniform", fee.uniform || "");
    formData.append("fine", fee.fine || "");
    formData.append("others", fee.others || "");

    console.log("FormData prepared for submission:");
    // Inspect FormData
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return axios.post(`${url.UPDATE_SCHOOL_FEE}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  } else {
    console.error("Fee object is undefined or missing");
    return Promise.reject(new Error("Fee object is undefined or missing"));
  }
};

export const getStudentsList = id =>
  get(`${url.GET_STUDENTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getDefaultersList = id =>
  get(`${url.GET_DEFAULTERS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateDefaultersList = id => {
  console.log("api helper", id, id.user_id)
  return axios.put(`${url.UPDATE_DEFAULTERS_LIST}/${id.user_id}`, {
    headers: getHeader(authHeader()),
  });
};
export const getBanks = id =>
  get(`${url.GET_BANKS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const addNewBank = (sclcls, id) => {
  let formData = new FormData();
  formData.append("name", sclcls.name);
  formData.append("account_no", sclcls.account_no);
  formData.append("branch_address", sclcls.branch_address);
  return axios.post(`${url.ADD_NEW_BANK}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateBank = sclcls => {
  let formData = new FormData();
  formData.append("name", sclcls.name);
  formData.append("account_no", sclcls.account_no);
  formData.append("branch_address", sclcls.branch_address);

  return axios.put(`${url.UPDATE_BANK}/${sclcls.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deleteBank = delclass =>
  del(`${url.DELETE_BANK}/${delclass.id}`, {
    headers: getHeader(authHeader()),
  });

export const getChallans = id =>
  get(`${url.GET_BANKS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const addNewChallan = (sclcls, id) => {
  let formData = new FormData();
  formData.append("month", sclcls.month);
  formData.append("due_date", sclcls.due_date);
  formData.append("bank", sclcls.bank);
  formData.append("student", sclcls.student);
  formData.append("late_fine", sclcls.late_fine);
  return axios.post(`${url.ADD_NEW_CHALLAN}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateChallan = sclcls => {
  let formData = new FormData();
  formData.append("name", sclcls.name);
  formData.append("account_no", sclcls.account_no);
  formData.append("branch_address", sclcls.branch_address);

  return axios.put(`${url.UPDATE_BANK}/${sclcls.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deleteChallan = delclass =>
  del(`${url.DELETE_BANK}/${delclass.id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewChallanWithImage = (challan, id) => {
  let formData = new FormData();
  formData.append("student", challan.student);
  formData.append("image", challan.image);
  formData.append("challan_number", challan.challan_number);

  return axios.post(`${url.ADD_NEW_CHALLAN_WITH_IMAGE}`, formData, {
    headers: getHeader(authHeader(), true),
  });
};
export const addAttendence = (attendanceData, id) => {
  let formData = new FormData();
  const attendanceJson = JSON.stringify(attendanceData);
  formData.append("attendanceData", attendanceJson);
  console.log("Attendance data", attendanceData);
  return axios.post(`${url.ADD_ATTENDENCE}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const addEmployeesAttendence = (attendanceData, id) => {
  let formData = new FormData();
  const attendanceJson = JSON.stringify(attendanceData);
  formData.append("attendanceData", attendanceJson);
  console.log("Attendance data", attendanceData);
  return axios.post(`${url.ADD_EMPLOYEES_ATTENDENCE}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const getEmployeesBySchool = id =>
  get(`${url.GET_EMPLOYEES_BY_SCHOOL}/${id}`, {
    headers: getHeader(authHeader()),
  });