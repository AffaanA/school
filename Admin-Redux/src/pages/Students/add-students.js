import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addNewStudent } from '../../store/students/actions'; // Adjust the import path as needed
import MetaTags from 'react-meta-tags';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getClassesList, getFamilyList } from '../../store/actions';
class AddStudentPage extends Component {
  state = {
    user_id: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
    showParentFields: true,

  };
  componentDidMount() {
    const { getClassesList, getFamilyList } = this.props;
    const { user_id } = this.state;
    getClassesList(user_id);
    getFamilyList(user_id);
  }

  handleFamilyChange = (event, setFieldValue) => {
    const selectedFamily = event.target.value;
    setFieldValue('select_family', selectedFamily);
    // Set showParentFields to false if a family is selected, true otherwise
    this.setState({ showParentFields: selectedFamily === '' });
  };
  handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("Submitting form with values:", values);
    const { addNewStudent } = this.props;
    const { user_id } = this.state;
    addNewStudent(values, user_id);
    setSubmitting(false);
    resetForm();
  };
  componentDidUpdate(prevProps) {
    if (this.props.successMessage && this.props.successMessage !== prevProps.successMessage) {
      toast.success(this.props.successMessage);
      setTimeout(() => {
        this.props.history.push('/student');
      }, 2000);
    }
    if (this.props.errorMessage && this.props.errorMessage !== prevProps.errorMessage) {
      toast.error(this.props.errorMessage);
    }
  }
  render() {
    const { showParentFields } = this.state;
    const initialValues = {
      student_name: '',
      picture: '',
      registration_no: '',
      date_of_admission: '',
      student_class: '',
      discount_in_fee: '',
      mobile_no: '',
      email: '',
      date_of_birth: '',
      gender: '',
      identification_mark: '',
      blood_group: '',
      disease: '',
      birth_form_id: '',
      cast: '',
      previous_school: '',
      previous_id_board_roll_no: '',
      additional_note: '',
      orphan_student: false,
      osc: false,
      religion: '',
      select_family: '',
      total_siblings: '',
      address: '',
      father_name: '',
      father_education: '',
      father_national_id: '',
      father_mobile_no: '',
      father_occupation: '',
      father_profession: '',
      father_income: '',
      mother_name: '',
      mother_education: '',
      mother_national_id: '',
      mother_mobile_no: '',
      mother_occupation: '',
      mother_profession: '',
      mother_income: '',
      email: '',
      password: '',
    };
    const { classesList } = this.props;
    const { familyList } = this.props;
    const { selectedClassId, selectedFamily } = this.state;
    const validationSchema = Yup.object({
      student_name: Yup.string().required('Student name is required'),
      date_of_admission: Yup.date().required('Date of admission is required'),
      student_class: Yup.string().required('Class is required'),
      mobile_no: Yup.string().required('Mobile number is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      date_of_birth: Yup.date().required('Date of birth is required'),
      gender: Yup.string().required('Gender is required'),
      identification_mark: Yup.string(),
      blood_group: Yup.string(),
      disease: Yup.string(),
      birth_form_id: Yup.string(),
      cast: Yup.string(),
      previous_school: Yup.string(),
      previous_id_board_roll_no: Yup.string(),
      additional_note: Yup.string(),
      orphan_student: Yup.boolean(),
      osc: Yup.boolean(),
      religion: Yup.string(),
      select_family: Yup.string(),
      father_name: Yup.string().when('select_family', {
        is: '', // If no family is selected
        then: Yup.string().required('Father’s name is required'),
        otherwise: Yup.string(), // Otherwise, it's optional
      }),

      father_education: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Father’s education is required'),
        otherwise: Yup.string(),
      }),

      father_national_id: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Father’s national ID is required'),
        otherwise: Yup.string(),
      }),

      father_mobile_no: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Father’s mobile number is required'),
        otherwise: Yup.string(),
      }),

      father_occupation: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Father’s occupation is required'),
        otherwise: Yup.string(),
      }),

      father_profession: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Father’s profession is required'),
        otherwise: Yup.string(),
      }),

      father_income: Yup.number().when('select_family', {
        is: '',
        then: Yup.number().required('Father’s income is required'),
        otherwise: Yup.number(),
      }),

      mother_name: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Mother’s name is required'),
        otherwise: Yup.string(),
      }),

      mother_education: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Mother’s education is required'),
        otherwise: Yup.string(),
      }),

      mother_national_id: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Mother’s national ID is required'),
        otherwise: Yup.string(),
      }),

      mother_mobile_no: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Mother’s mobile number is required'),
        otherwise: Yup.string(),
      }),

      mother_occupation: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Mother’s occupation is required'),
        otherwise: Yup.string(),
      }),

      mother_profession: Yup.string().when('select_family', {
        is: '',
        then: Yup.string().required('Mother’s profession is required'),
        otherwise: Yup.string(),
      }),

      mother_income: Yup.number().when('select_family', {
        is: '',
        then: Yup.number().required('Mother’s income is required'),
        otherwise: Yup.number(),
      }),
      total_siblings: Yup.number(),
      address: Yup.string().required('Address is required'),
      email: Yup.string().email('Invalid email address').required('User email is required'),
      password: Yup.string().required('Password is required'),
    });
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Add Student | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Add Student" />
            <Row className="justify-content-center">
              <Col md={10} lg={10} xl={10}>
                <Card>
                  <CardBody>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={this.handleSubmit}
                    >
                      {({ setFieldValue }) => (
                        <Form>
                          <h4>Student Information</h4>
                          <div className="mb-3">
                            <label htmlFor="student_name" className="form-label">Student Name</label>
                            <Field name="student_name" type="text" className="form-control" />
                            <ErrorMessage name="student_name" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="picture" className="form-label">Picture</label>
                            <input
                              id="picture"
                              name="picture"
                              type="file"
                              className="form-control"
                              onChange={(event) => {
                                const file = event.currentTarget.files[0];
                                setFieldValue("picture", file);
                              }}
                              accept="image/*"
                            />
                            <ErrorMessage name="picture" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="registration_no" className="form-label">Registration Number</label>
                            <Field name="registration_no" type="text" className="form-control" />
                            <ErrorMessage name="registration_no" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="date_of_admission" className="form-label">Date of Admission</label>
                            <Field name="date_of_admission" type="date" className="form-control" />
                            <ErrorMessage name="date_of_admission" component="div" className="text-danger" />
                          </div>


                          <div className="mb-3">
                            <label htmlFor="student_class" className="form-label">Class</label>
                            <Field
                              name="student_class"
                              as="select"
                              className="form-control"
                              value={selectedClassId}
                            >
                              <option value="">Select Class</option>
                              {classesList.map(class_id => (
                                <option key={class_id.id} value={class_id.id}>
                                  {class_id.name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="student_class" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="discount_in_fee" className="form-label">Discount in Fee</label>
                            <Field name="discount_in_fee" type="number" className="form-control" />
                            <ErrorMessage name="discount_in_fee" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="mobile_no" className="form-label">Mobile Number</label>
                            <Field name="mobile_no" type="number" className="form-control" />
                            <ErrorMessage name="mobile_no" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">User Email</label>
                            <Field name="email" type="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="password" className="form-label">User Password</label>
                            <Field name="password" type="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                          </div>


                          <div className="mb-3">
                            <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                            <Field name="date_of_birth" type="date" className="form-control" />
                            <ErrorMessage name="date_of_birth" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <Field name="gender" as="select" className="form-control">
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </Field>
                            <ErrorMessage name="gender" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="identification_mark" className="form-label">Identification Mark</label>
                            <Field name="identification_mark" type="text" className="form-control" />
                            <ErrorMessage name="identification_mark" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="blood_group" className="form-label">Blood Group</label>
                            <Field name="blood_group" type="text" className="form-control" />
                            <ErrorMessage name="blood_group" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="disease" className="form-label">Disease</label>
                            <Field name="disease" type="text" className="form-control" />
                            <ErrorMessage name="disease" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="birth_form_id" className="form-label">Birth Form ID</label>
                            <Field name="birth_form_id" type="text" className="form-control" />
                            <ErrorMessage name="birth_form_id" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="cast" className="form-label">Caste</label>
                            <Field name="cast" type="text" className="form-control" />
                            <ErrorMessage name="cast" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="previous_school" className="form-label">Previous School</label>
                            <Field name="previous_school" type="text" className="form-control" />
                            <ErrorMessage name="previous_school" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="previous_id_board_roll_no" className="form-label">Previous ID Board Roll Number</label>
                            <Field name="previous_id_board_roll_no" type="text" className="form-control" />
                            <ErrorMessage name="previous_id_board_roll_no" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="additional_note" className="form-label">Additional Note</label>
                            <Field name="additional_note" type="text" className="form-control" />
                            <ErrorMessage name="additional_note" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <Field name="orphan_student" type="checkbox" className="form-check-input" />
                            <label htmlFor="orphan_student" className="form-check-label">Orphan Student</label>
                            <ErrorMessage name="orphan_student" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <Field name="osc" type="checkbox" className="form-check-input" />
                            <label htmlFor="osc" className="form-check-label">Out of School Children (OSC)</label>
                            <ErrorMessage name="osc" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="religion" className="form-label">Religion</label>
                            <Field name="religion" type="text" className="form-control" />
                            <ErrorMessage name="religion" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="total_siblings" className="form-label">Total Siblings</label>
                            <Field name="total_siblings" type="number" className="form-control" />
                            <ErrorMessage name="total_siblings" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <Field name="address" type="text" className="form-control" />
                            <ErrorMessage name="address" component="div" className="text-danger" />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="select_family" className="form-label">Select Family (If Parents data is already added)</label>
                            <Field
                              name="select_family"
                              as="select"
                              className="form-control"
                              value={selectedFamily}
                              onChange={(event) => this.handleFamilyChange(event, setFieldValue)}
                            >
                              <option value="">Select Family</option>
                              {familyList.map(class_id => (
                                <option key={class_id.id} value={class_id.id}>
                                  {class_id.family_name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="select_family" component="div" className="text-danger" />
                          </div>
                          {showParentFields && (
                            <>
                              <h4>Father Information</h4>
                              <div className="mb-3">
                                <label htmlFor="father_name" className="form-label">Father&lsquo;s Name</label>
                                <Field name="father_name" type="text" className="form-control" />
                                <ErrorMessage name="father_name" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="father_education" className="form-label">Father&lsquo;s Education</label>
                                <Field name="father_education" type="text" className="form-control" />
                                <ErrorMessage name="father_education" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="father_national_id" className="form-label">Father&lsquo;s National ID</label>
                                <Field name="father_national_id" type="text" className="form-control" />
                                <ErrorMessage name="father_national_id" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="father_mobile_no" className="form-label">Father&lsquo;s Mobile Number</label>
                                <Field name="father_mobile_no" type="number" className="form-control" />
                                <ErrorMessage name="father_mobile_no" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="father_occupation" className="form-label">Father&lsquo;s Occupation</label>
                                <Field name="father_occupation" type="text" className="form-control" />
                                <ErrorMessage name="father_occupation" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="father_profession" className="form-label">Father&lsquo;s Profession</label>
                                <Field name="father_profession" type="text" className="form-control" />
                                <ErrorMessage name="father_profession" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="father_income" className="form-label">Father&lsquo;s Income</label>
                                <Field name="father_income" type="number" className="form-control" />
                                <ErrorMessage name="father_income" component="div" className="text-danger" />
                              </div>
                            </>
                          )}
                          {showParentFields && (
                            <>
                              <h4>Mother Information</h4>
                              <div className="mb-3">
                                <label htmlFor="mother_name" className="form-label">Mother&lsquo;s Name</label>
                                <Field name="mother_name" type="text" className="form-control" />
                                <ErrorMessage name="mother_name" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="mother_education" className="form-label">Mother&lsquo;s Education</label>
                                <Field name="mother_education" type="text" className="form-control" />
                                <ErrorMessage name="mother_education" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="mother_national_id" className="form-label">Mother&lsquo;s National ID</label>
                                <Field name="mother_national_id" type="text" className="form-control" />
                                <ErrorMessage name="mother_national_id" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="mother_mobile_no" className="form-label">Mother&lsquo;s Mobile Number</label>
                                <Field name="mother_mobile_no" type="number" className="form-control" />
                                <ErrorMessage name="mother_mobile_no" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="mother_occupation" className="form-label">Mother&lsquo;s Occupation</label>
                                <Field name="mother_occupation" type="text" className="form-control" />
                                <ErrorMessage name="mother_occupation" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="mother_profession" className="form-label">Mother&lsquo;s Profession</label>
                                <Field name="mother_profession" type="text" className="form-control" />
                                <ErrorMessage name="mother_profession" component="div" className="text-danger" />
                              </div>

                              <div className="mb-3">
                                <label htmlFor="mother_income" className="form-label">Mother&lsquo;s Income</label>
                                <Field name="mother_income" type="number" className="form-control" />
                                <ErrorMessage name="mother_income" component="div" className="text-danger" />
                              </div>
                            </>
                          )}
                          <button type="submit" className="btn btn-primary">Submit</button>
                        </Form>
                      )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}
AddStudentPage.propTypes = {
  addNewStudent: PropTypes.func.isRequired,
  getClassesList: PropTypes.func.isRequired,
  classesList: PropTypes.array.isRequired,
  getFamilyList: PropTypes.func.isRequired,
  familyList: PropTypes.array.isRequired,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
};

const mapStateToProps = state => ({
  successMessage: state.students.successMessage,
  errorMessage: state.students.errorMessage,
  classesList: state.classeslist.classesList,
  familyList: state.family.familyList,
});
const mapDispatchToProps = (dispatch) => ({
  addNewStudent: (employeeData, id) => {
    console.log("Dispatching addNewStudent action:", employeeData, id);
    dispatch(addNewStudent(employeeData, id));
  },
  getClassesList: (id) => {
    console.log("Dispatching getClassesList action:", id);
    dispatch(getClassesList(id));
  },
  getFamilyList: (id) => {
    console.log("Dispatching getFamilyList action:", id);
    dispatch(getFamilyList(id));
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddStudentPage));
