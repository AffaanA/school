import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addNewEmployee } from '../../store/employees/actions'; // Adjust the import path as needed
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

class AddEmployeePage extends Component {
  state = {
    user_id: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
  };

  handleSubmit = (values, { setSubmitting, resetForm }) => {
    const { addNewEmployee } = this.props;
    const { user_id } = this.state;
    addNewEmployee(values, user_id);
    setSubmitting(false);
    resetForm();
  };

  componentDidUpdate(prevProps) {
    if (this.props.successMessage && this.props.successMessage !== prevProps.successMessage) {
      toast.success(this.props.successMessage);
      setTimeout(() => {
        this.props.history.push('/employee');
      }, 2000);
    }
    if (this.props.errorMessage && this.props.errorMessage !== prevProps.errorMessage) {
      toast.error(this.props.errorMessage);
    }
  }

  render() {
    const initialValues = {
      name: '',
      email: '',
      phone: '',
      education: '',
      monthly_salary: '',
      address: '',
      date_joined: '',
      dob: '',
      experience: '',
      national_id: '',
      father_husband_name: '',
      blood_group: '',
      password:'',
    };

    const validationSchema = Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().required('Phone number is required'),
      education: Yup.string().required('Education is required'),
      monthly_salary: Yup.number().required('Monthly salary is required').positive(),
      address: Yup.string().required('Address is required'),
      date_joined: Yup.date().required('Date joined is required'),
      dob: Yup.date().required('Date of birth is required'),
      experience: Yup.string().required('Experience is required'),
      national_id: Yup.string().required('National ID is required'),
      father_husband_name: Yup.string().required('Father/Husband name is required'),
      password: Yup.string().required('Password is required')
    });

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Add Employee | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Add Employee" />
            <Row className="justify-content-center">
              <Col md={10} lg={10} xl={10}>
                <Card>
                  <CardBody>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={this.handleSubmit}
                    >
                      <Form>
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <Field name="name" type="text" className="form-control" />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <Field name="email" type="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                          </div>
                          
                          <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <Field name="password" type="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                          </div>
                          
                          <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <Field name="phone" type="text" className="form-control" />
                            <ErrorMessage name="phone" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="education" className="form-label">Education</label>
                            <Field name="education" type="text" className="form-control" />
                            <ErrorMessage name="education" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="monthly_salary" className="form-label">Monthly Salary</label>
                            <Field name="monthly_salary" type="number" className="form-control" />
                            <ErrorMessage name="monthly_salary" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <Field name="address" type="text" className="form-control" />
                            <ErrorMessage name="address" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="date_joined" className="form-label">Date Joined</label>
                            <Field name="date_joined" type="date" className="form-control" />
                            <ErrorMessage name="date_joined" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="dob" className="form-label">Date of Birth</label>
                            <Field name="dob" type="date" className="form-control" />
                            <ErrorMessage name="dob" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="experience" className="form-label">Experience</label>
                            <Field name="experience" type="text" className="form-control" />
                            <ErrorMessage name="experience" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="national_id" className="form-label">National ID</label>
                            <Field name="national_id" type="text" className="form-control" />
                            <ErrorMessage name="national_id" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="father_husband_name" className="form-label">Father/Husband Name</label>
                            <Field name="father_husband_name" type="text" className="form-control" />
                            <ErrorMessage name="father_husband_name" component="div" className="text-danger" />
                          </div>

                          <div className="mb-3">
                            <label htmlFor="blood_group" className="form-label">Blood Group</label>
                            <Field name="blood_group" type="text" className="form-control" />
                            <ErrorMessage name="blood_group" component="div" className="text-danger" />
                          </div>

                          <button type="submit" className="btn btn-primary">Add Employee</button>
                        </Form>
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

AddEmployeePage.propTypes = {
  addNewEmployee: PropTypes.func.isRequired,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
};

const mapStateToProps = state => ({
  successMessage: state.employees.successMessage,
  errorMessage: state.employees.errorMessage,
});

const mapDispatchToProps = dispatch => ({
  addNewEmployee: (employeeData, id) => dispatch(addNewEmployee(employeeData, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddEmployeePage));
