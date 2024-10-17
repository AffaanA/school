import PropTypes from "prop-types";
import Select from "react-select";
import React, { Component } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import { updateStudentProfile, getStudentProfile } from "../../store/actions";
import { error } from "toastr";

// import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

class StudentProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    student_name: "",
    father_name: "",
    picture:"",
    mother_name: "",
    gender: "",
    date_of_birth: "",
    date_of_admission: "",
    registration_no: "",
    blood_group: "",
    religion: "",
    address: "",
    disease: "",
    identification_mark: "",
    mobile_no: "",
    email: "",
    total_siblings: "",
    orphan_student: false,
    father: {},
    mother: {},
    additional_note: "",
    discount_in_fee: "",
    previous_school: "",
    previous_id_board_roll_no: "",
    cast: "",
    birth_form_id: "",
    select_family: null,
    student_class: null,
    user_id: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
    };    
  }
  componentDidMount() {
    this.props.getStudentProfile(this.state.user_id);
    
    setTimeout(() => {
      const { success } = this.props;
      
      if (success) {
        this.setState({
          student_name: success.student_name || "",
          father_name: success.father ? success.father.name : "",
          mother_name: success.mother ? success.mother.name : "",
          gender: success.gender || "",
          date_of_birth: success.date_of_birth || "",
          date_of_admission: success.date_of_admission || "",
          registration_no: success.registration_no || "",
          blood_group: success.blood_group || "",
          picture: success.picture || "",
          religion: success.religion || "",
          address: success.address || "",
          disease: success.disease || "",
          identification_mark: success.identification_mark || "",
          mobile_no: success.mobile_no || "",
          email: success.email || "",
          total_siblings: success.total_siblings || "",
          orphan_student: success.orphan_student || false,
          father: success.father || {},
          mother: success.mother || {},
          additional_note: success.additional_note || "",
          discount_in_fee: success.discount_in_fee || "",
          previous_school: success.previous_school || "",
          previous_id_board_roll_no: success.previous_id_board_roll_no || "",
          cast: success.cast || "",
          birth_form_id: success.birth_form_id || "",
          select_family: success.select_family || null,
          student_class: success.student_class || null,
        });
      }
    }, 1500);
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Account" breadcrumbItem="Profile" />
            <Row className="justify-content-center">
              <Col md={10} lg={10} xl={10}>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex">
                      <div className="me-3">
                        <img
                          src={this.state.picture}
                          alt=""
                          className="avatar-md rounded-circle img-thumbnail"
                        />
                      </div>
                      <div className="align-self-center flex-1">
                        <div className="text-muted">
                          <h5>{this.state.student_name}</h5>
                          <p className="mb-0">{this.state.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {this.state.isProfileUpdated && this.state.isProfileUpdated ? (
              <Alert color="success">Your profile is updated.</Alert>
            ) : null}

            <h4 className="card-title mb-4">Student Profile</h4>

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    student_name: this.state.student_name || "",
                    registration_no: this.state.registration_no || "",
                    date_of_birth: this.state.date_of_birth || "",
                    date_of_admission: this.state.date_of_admission || "",
                    gender: this.state.gender || "",
                    religion: this.state.religion || "",
                    blood_group: this.state.blood_group || "",
                    disease: this.state.disease || "",
                    identification_mark: this.state.identification_mark || "",
                    mobile_no: this.state.mobile_no || "",
                    email: this.state.email || "",
                    address: this.state.address || "",
                    previous_school: this.state.previous_school || "",
                    previous_id_board_roll_no: this.state.previous_id_board_roll_no || "",
                    birth_form_id: this.state.birth_form_id || "",
                    father_name: this.state.father_name || "",
                    father_profession: this.state.father_profession || "",
                    father_occupation: this.state.father_occupation || "",
                    father_national_id: this.state.father_national_id || "",
                    father_mobile_no: this.state.father_mobile_no || "",
                    father_income: this.state.father_income || "",
                    father_education: this.state.father_education || "",
                    mother_name: this.state.mother_name || "",
                    mother_profession: this.state.mother_profession || "",
                    mother_occupation: this.state.mother_occupation || "",
                    mother_national_id: this.state.mother_national_id || "",
                    mother_mobile_no: this.state.mother_mobile_no || "",
                    mother_income: this.state.mother_income || "",
                    mother_education: this.state.mother_education || "",
                    additional_note: this.state.additional_note || "",
                    total_siblings: this.state.total_siblings || "",
                    discount_in_fee: this.state.discount_in_fee || "",
                    family: this.state.family || "",
                    student_class: this.state.student_class || "",
                    orphan_student: this.state.orphan_student || false,
                    osc: this.state.osc || false,
                  }}
                  // onSubmit={values => {
                  //   console.log("submit is clicekd")
                  //   // if no file was selected for logo then get current image from url and convert to file
                  //   if (typeof values.logo == "string") {
                  //     this.toDataURL(values.logo).then(dataUrl => {
                  //       var fileData = this.dataURLtoFile(
                  //         dataUrl,
                  //         values.logo.split("/").at(-1)
                  //       );
                  //       values.logo = fileData;
                  //       // this.props.updateStudentProfile(values, this.state.user_id);
                  //     });
                  //   }

                  //   // Otherwise just call update method
                  //   else {
                  //     // this.props.updateStudentProfile(values, this.state.user_id);
                  //   }

                  //   // To show success message of update
                  //   this.setState({ isProfileUpdated: true });
                  //   window.scrollTo({top: 0, left: 0, behavior: 'smooth'});


                  //   // To get updated profile again
                  //   setTimeout(() => {
                  //     this.props.getStudentProfile(this.state.user_id);
                  //   }, 1000);

                  //   // To display updated logo
                  //   setTimeout(() => {
                  //     this.setState({
                  //       logo:
                  //         process.env.REACT_APP_BACKENDURL +
                  //         this.props.success.logo,
                  //     });
                  //   }, 2000);

                  //   // To make success message disappear after sometime
                  //   setTimeout(() => {
                  //     this.setState({
                  //       isProfileUpdated: false,
                  //     });
                  //   }, 5000);
                  // }}
                >
                  {({ errors, status, touched }) => (
                 <Form className="form-horizontal">
                 {/* Student Name field */}
                 <div className="grade-row">
                   <Field
                     id="student_name"
                     name="student_name"
                     type="text"
                     placeholder="Student name"
                     value={this.state.student_name}
                     className={
                       "form-control" +
                       (errors.student_name && touched.student_name ? " is-invalid" : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="student_name"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Father Name field */}
                 <div className="grade-row">
                   <Field
                     id="father_name"
                     name="father_name"
                     type="text"
                     placeholder="Father's name"
                     value={this.state.father.name || ""}
                     className={
                       "form-control" +
                       (errors.father_name && touched.father_name ? " is-invalid" : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="father_name"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Mother Name field */}
                 <div className="grade-row">
                   <Field
                     id="mother_name"
                     name="mother_name"
                     type="text"
                     placeholder="Mother's name"
                     value={this.state.mother.name || ""}
                     className={
                       "form-control" +
                       (errors.mother_name && touched.mother_name ? " is-invalid" : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="mother_name"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Date of Birth field */}
                 <div className="grade-row">
                   <Field
                     id="date_of_birth"
                     name="date_of_birth"
                     type="text"
                     placeholder="Date of Birth"
                     value={this.state.date_of_birth}
                     className={
                       "form-control" +
                       (errors.date_of_birth && touched.date_of_birth ? " is-invalid" : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="date_of_birth"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Date of Admission field */}
                 <div className="grade-row">
                   <Field
                     id="date_of_admission"
                     name="date_of_admission"
                     type="text"
                     placeholder="Date of Admission"
                     value={this.state.date_of_admission}
                     className={
                       "form-control" +
                       (errors.date_of_admission && touched.date_of_admission
                         ? " is-invalid"
                         : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="date_of_admission"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Blood Group field */}
                 <div className="grade-row">
                   <Field
                     id="blood_group"
                     name="blood_group"
                     type="text"
                     placeholder="Blood Group"
                     value={this.state.blood_group}
                     className={
                       "form-control" +
                       (errors.blood_group && touched.blood_group ? " is-invalid" : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="blood_group"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Registration No field */}
                 <div className="grade-row">
                   <Field
                     id="registration_no"
                     name="registration_no"
                     type="text"
                     placeholder="Registration No"
                     value={this.state.registration_no}
                     className={
                       "form-control" +
                       (errors.registration_no && touched.registration_no
                         ? " is-invalid"
                         : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="registration_no"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Mobile No field */}
                 <div className="grade-row">
                   <Field
                     id="mobile_no"
                     name="mobile_no"
                     type="text"
                     placeholder="Mobile No"
                     value={this.state.mobile_no}
                     className={
                       "form-control" +
                       (errors.mobile_no && touched.mobile_no ? " is-invalid" : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="mobile_no"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Address field */}
                 <div className="grade-row">
                   <Field
                     id="address"
                     name="address"
                     type="text"
                     placeholder="Address"
                     value={this.state.address}
                     className={
                       "form-control" +
                       (errors.address && touched.address ? " is-invalid" : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="address"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Additional Note field */}
                 <div className="grade-row">
                   <Field
                     id="additional_note"
                     name="additional_note"
                     type="text"
                     placeholder="Additional Note"
                     value={this.state.additional_note}
                     className={
                       "form-control" +
                       (errors.additional_note && touched.additional_note
                         ? " is-invalid"
                         : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="additional_note"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div>
               
                 {/* Orphan Student field */}
                 {/* <div className="grade-row">
                   <Field
                     id="orphan_student"
                     name="orphan_student"
                     type="checkbox"
                     checked={this.state.orphan_student}
                     className={
                       "form-control" +
                       (errors.orphan_student && touched.orphan_student
                         ? " is-invalid"
                         : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="orphan_student"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div> */}
               
                 {/* OSC field */}
                 {/* <div className="grade-row">
                   <Field
                     id="osc"
                     name="osc"
                     type="checkbox"
                     checked={this.state.osc}
                     className={
                       "form-control" + (errors.osc && touched.osc ? " is-invalid" : "")
                     }
                     disabled
                   />
                   <ErrorMessage
                     name="osc"
                     component="div"
                     className="invalid-feedback"
                   />
                 </div> */}
               
                 {/* <div className="text-center mt-4">
                   <Button type="submit" color="danger" disabled>
                     Update Profile
                   </Button>
                 </div> */}
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

StudentProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  // updateStudentProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getStudentProfile: PropTypes.func,
};

const mapStateToProps = state => ({
  success: state.studentProfile.success,
  error: state.studentProfile.error,
});

const mapDispatchToProps = {
  getStudentProfile,
  // updateStudentProfile,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentProfile));

