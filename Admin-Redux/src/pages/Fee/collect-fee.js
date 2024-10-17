import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getStudentsList } from "../../store/students-list/actions";
import { addChallanWithImage } from "../../store/fee-challan/actions";
import MetaTags from "react-meta-tags";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS

class AddChallanPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.formikRef = React.createRef(); // Reference for Formik instance
  }

  componentDidMount() {
    const { getStudentsList } = this.props;
    const { user_id } = this.state;
    getStudentsList(user_id);
  }

  handleSubmit = (values, { setSubmitting }) => {
    console.log("submitsubmit", values)
    const { addChallanWithImage } = this.props;
    const { user_id } = this.state;

    addChallanWithImage(values, user_id, )
      .then(() => {
        // Reset the form fields after a successful API call
        this.formikRef.current.resetForm();
        toast.success("Fee Challan added successfully");
      })
      .catch(error => {
        this.formikRef.current.resetForm();
        toast.error("Failed to add fee challan");
      })
      .finally(() => {
        setSubmitting(false); // Set submitting to false to enable form submission again
      });
  };

  componentDidUpdate(prevProps) {
    const { successMessage, errorMessage } = this.props;

    if (successMessage && successMessage !== prevProps.successMessage) {
      toast.success(successMessage);
      // Reset the form fields if needed
      if (this.formikRef.current) {
        this.formikRef.current.resetForm();
      }
    }
    if (errorMessage && errorMessage !== prevProps.errorMessage) {
      toast.error(errorMessage);
    }
  }

  render() {
    const { studentsList } = this.props;

    const initialValues = {
      month: new Date(), // Default to current date
      student: "",
      challan_number: "",
      image: null,
    };

    const validationSchema = Yup.object({
      month: Yup.date().required("Month is required"),
      student: Yup.string().required("Student is required"),
      challan_number: Yup.string().required("Challan Number is required"),
    });

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Collect Fee | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Collect Fee" />
            <Row className="justify-content-center">
              <Col md={10}>
                <Card>
                  <CardBody>
                    <Formik
                      innerRef={this.formikRef} // Attach ref to Formik instance
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={this.handleSubmit}
                    >
                      {({ setFieldValue, values }) => (
                        <Form className="grade-form">
                          <h4 className="text-center">
                            Collect Fee for Student
                          </h4>
                          {/* Student Selection */}
                          <div className="grade-row">
                            <Field
                              as="select"
                              name="student"
                              id="student"
                              className="form-control grade-row-field"
                            >
                              <option value="">Select Student</option>
                              {studentsList.map(student => (
                                <option key={student.id} value={student.id}>
                                  {student.student_name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="student"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                          {/* Month Selection */}
                          {/* <div className="grade-row">
                            <DatePicker
                              selected={values.month}
                              onChange={date => setFieldValue("month", date)}
                              dateFormat="MMMM yyyy"
                              showMonthYearPicker
                              className="form-control grade-row-field"
                              id="month"
                            />
                            <ErrorMessage
                              name="month"
                              component="div"
                              className="text-danger"
                            />
                          </div> */}

                          {/* Challan Number */}
                          <div className="grade-row">
                            <Label for="challan_number">Challan Number</Label>
                            <Field
                              type="text"
                              name="challan_number"
                              id="challan_number"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="challan_number"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          {/* Challan Image */}
                          <div className="grade-row">
                            <Label for="image">Challan Image</Label>
                            <Input
                              type="file"
                              name="image"
                              id="image"
                              onChange={event =>
                                setFieldValue(
                                  "image",
                                  event.currentTarget.files[0]
                                )
                              }
                            />
                            <ErrorMessage
                              name="image"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="btn-container-save">
                            <Button className="button-grade" type="submit">
                              Save Changes
                            </Button>
                          </div>
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

AddChallanPage.propTypes = {
  addChallanWithImage: PropTypes.func.isRequired,
  getStudentsList: PropTypes.func.isRequired,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  studentsList: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  successMessage: state.challans.successMessage,
  errorMessage: state.challans.errorMessage,
  studentsList: state.studentslist.studentsList,
});

const mapDispatchToProps = dispatch => ({
  addChallanWithImage: (challanData, id) =>
    dispatch(addChallanWithImage(challanData, id)),
  getStudentsList: user_id => dispatch(getStudentsList(user_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddChallanPage));
