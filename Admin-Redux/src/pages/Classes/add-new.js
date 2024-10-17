import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addNewClass, clearErrorMessage, clearSuccessMessage } from '../../store/classes/actions'; // Adjust the import path as needed
import { getTeachersList } from '../../store/actions';
import MetaTags from 'react-meta-tags';
import { Button, Card, CardBody, Col, Container, Row, Input, Modal, ModalBody, ModalFooter } from "reactstrap";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';

class AddClassPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      showAlert: false,
    };
    this.handleAlertButtonClick = this.handleAlertButtonClick.bind(this); // Bind the alert button click handler
  }
  componentDidMount() {
    const { teachersList, onGetTeachersList } = this.props;
    if (teachersList && !teachersList.length) {
      onGetTeachersList(this.state.user_id);
    }
  }
  handleAlertButtonClick() {
    this.props.history.push('/add-employee');
  }
  handleSubmit = (values, { setSubmitting, resetForm }) => {
    const { addNewClass } = this.props;
    const { user_id } = this.state;

    // Dispatch the action and handle promise to show toast messages
    addNewClass(values, user_id);
    setSubmitting(false);
    resetForm();
  };

  componentDidUpdate(prevProps) {
    const { successMessage, errorMessage } = this.props;
    console.log('Previous Props:', prevProps);
    console.log('Current Props:', this.props);
    if (prevProps.successMessage !== successMessage && successMessage) {
      toast.success(successMessage);
      setTimeout(() => {
        this.props.history.push('/classes');
      }, 2000);
      this.props.clearSuccessMessage();
    }
  
    if (prevProps.errorMessage !== errorMessage && errorMessage) {
      toast.error(errorMessage);
      // Clear error message after showing it
      this.props.clearErrorMessage();
    }
  }
  

  render() {
    const initialValues = {
      name: '',
      monthly_fee: '',
      teacher: [],
    };
    const {showAlert } = this.state;
    const validationSchema = Yup.object({
      name: Yup.string().required('Name is required'),
      monthly_fee: Yup.number().required('Monthly Fee is required').positive(),
      teacher: Yup.array().min(1, 'At least one teacher must be selected'),
    });

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Add Class | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Add Class" />
            <Row className="justify-content-center">
              <Col md={10} lg={10} xl={10}>
                <Card>
                  <CardBody>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={this.handleSubmit}
                    >
                        {({ isSubmitting }) => (
                      <Form>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">Name</label>
                          <Field name="name" type="text" className="form-control" />
                          <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="monthly_fee" className="form-label">Monthly Fee</label>
                          <Field name="monthly_fee" type="number" className="form-control" />
                          <ErrorMessage name="monthly_fee" component="div" className="text-danger" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="teacher" className="form-label">Teachers</label>

                            <Field name="teacher">
                              {({ field, form }) => (
                                <Select
                                  isMulti
                                  name="teacher"
                                  options={this.props.teachersList.map((teacher) => ({
                                    value: teacher.id,
                                    label: teacher.name,
                                  }))}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  placeholder="Select Teachers"
                                  onChange={(selectedOptions) => {
                                    // Map selected options to an array of IDs and set form field value
                                    const selectedTeachers = selectedOptions.map((option) => option.value);
                                    form.setFieldValue('teacher', selectedTeachers);
                                  }}
                                />
                              )}
                            </Field>

                            <ErrorMessage name="teacher" component="div" className="text-danger" />
                          </div>

                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add Class</button>
                      </Form>
                        )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
         {/* Alert Modal */}
         {showAlert && (
          <Modal isOpen={showAlert} toggle={() => this.setState({ showAlert: false })}>
            <ModalBody>
              No Teacher has been found. Please add at least one Teacher before accessing this feature.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleAlertButtonClick}>
                Add Teacher
              </Button>
              <Button color="secondary" onClick={() => this.setState({ showAlert: false })}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

AddClassPage.propTypes = {
  addNewClass: PropTypes.func.isRequired,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  teachersList: PropTypes.array.isRequired,
  onGetTeachersList: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  successMessage: state.classes.successMessage,
  errorMessage: state.classes.errorMessage,
  teachersList: state.teachers.teachersList,
});

const mapDispatchToProps = dispatch => ({
  addNewClass: (classData, id) => dispatch(addNewClass(classData, id)),
  onGetTeachersList: id => dispatch(getTeachersList(id)),
  clearSuccessMessage: () => dispatch(clearSuccessMessage()), // Add this
  clearErrorMessage: () => dispatch(clearErrorMessage()), 
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddClassPage));
