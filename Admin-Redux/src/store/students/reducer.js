import {
  GET_STUDENTS_SUCCESS,
  GET_STUDENTS_FAIL,
  ADD_STUDENT_SUCCESS,
  ADD_STUDENT_FAIL,
  UPDATE_STUDENT_SUCCESS,
  UPDATE_STUDENT_FAIL,
  DELETE_STUDENT_SUCCESS,
  DELETE_STUDENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  students: [],
  error: {},
  successMessage:null,
};

const students = (state = INIT_STATE, action) => {
  switch (action.type) {
      case GET_STUDENTS_SUCCESS:
        console.log("studentsReducer", action.payload.data, action.payload);
        return {
          ...state,
          students: action.payload,
        };
  
      case GET_STUDENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      
    case ADD_STUDENT_SUCCESS:
      return {
        ...state,
        successMessage: 'Student Added Successfully!',
        students: [...state.students, action.payload],
      };

    case ADD_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_STUDENT_SUCCESS:
      return {
        ...state,
        students: state.students.map(student =>
          student.id.toString() === action.payload.id.toString()
            ? { student, ...action.payload }
            : student
        ),
      };

    case UPDATE_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_STUDENT_SUCCESS:
      return {
        ...state,
        students: state.students.filter(
          student =>
            student.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_STUDENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default students;
