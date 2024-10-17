import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { getSchoolSubjects, updateSchoolSubjects, getClassesList, getClassSubjects } from "../../store/actions";
import { Button, Card, CardBody, Col, Container, Row, Input, Modal, ModalBody, ModalFooter } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import _ from 'lodash'; // Add lodash for debouncing

class SubjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedClassId: '', // Store selected class ID
      subjects: [], // Store subjects
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      showAlert: false, // State to control the visibility of the alert
      loading: false, // Track loading state
    };

    this.handleAddSubject = this.handleAddSubject.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.handleAlertButtonClick = this.handleAlertButtonClick.bind(this);
    
    // Debounce handleSaveChanges to prevent multiple calls
    this.debouncedHandleSaveChanges = _.debounce(this.handleSaveChanges, 2000);
  }

  componentDidMount() {
    const { getSchoolSubjects, getClassesList } = this.props;
    const { user_id } = this.state;
    getClassesList(user_id);    // Fetch classes
  }

  componentDidUpdate(prevProps) {
    if (prevProps.subjects !== this.props.subjects) {
      console.log("Subjects updated from props. Updating local state...");
      this.setState({ subjects: this.props.subjects });
    }
    if (prevProps.classesList !== this.props.classesList && this.props.classesList.length === 0) {
      // Show alert if there are no classes
      this.setState({ showAlert: true });
    }
    if (this.props.success && this.props.success !== prevProps.success) {
      toast.success(this.props.success);
      setTimeout(() => {
        this.props.history.push('/classes');
      }, 2000);
    }
    if (this.props.errorMessage && this.props.errorMessage !== prevProps.errorMessage) {
      toast.error(this.props.errorMessage);
    }
  }

  handleClassChange(event) {
    const { value } = event.target;
    this.setState({ selectedClassId: value });
   console.log("class id changeddd", value)
    if (value) {
      this.props.getClassSubjects(value);
    }
  }

  handleAddSubject() {
    console.log("Adding a new subject row...");
    this.setState((prevState) => ({
      subjects: [
        ...prevState.subjects,
        { name: "", exam_marks: "", id: null },
      ],
    }));
  }

  handleInputChange(index, event) {
    const { name, value } = event.target;
    console.log(`Input changed for index ${index}. Field: ${name}, Value: ${value}`);
    this.setState((prevState) => {
      const subjects = [...prevState.subjects];
      subjects[index][name] = value;
      return { subjects };
    });
  }

  handleSaveChanges = async () => {
    const { subjects, selectedClassId, user_id } = this.state;
    const subjectsWithClass = subjects.map(subject => ({
      ...subject,
      class_id: selectedClassId 
    }));
    
    if (this.state.loading) {
      console.log("Save Changes button clicked but already loading. Ignoring...");
      return;
    }

    console.log("Save Changes clicked. Setting loading state to true...");
    this.setState({ loading: true });

    try {
      console.log("Sending API request to update school subjects...");
      await this.props.updateSchoolSubjects(subjectsWithClass, user_id);
      toast.success("Subjects saved successfully!");
      console.log("Subjects processed successfully");

      console.log("Redirecting to all-subjects...");
      setTimeout(() => {
        this.props.history.push('/all-subjects');
      }, 2000);
    } catch (error) {
      console.error('Error saving subjects:', error);
      toast.error("Error saving subjects. Please try again.");
    } finally {
      console.log("Resetting loading state...");
      this.setState({ loading: false });
    }
  };

  handleAlertButtonClick() {
    this.props.history.push('/add-class');
  }

  render() {
    const { subjects, selectedClassId, showAlert, loading } = this.state;
    const { classesList } = this.props;
  
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumb title="School" breadcrumbItem="Subjects" />
            <Row className="justify-content-center">
              <Col md={10} lg={10} xl={10}> 
                <Card>
                  <CardBody>
                    <Formik>
                      {({ errors, status, touched }) => (
                        <Form className="form-horizontal">
                          <div className="grade-form">
                            <div className="mb-3">
                              <label htmlFor="class_id" className="form-label">Class</label>
                              <Field
                                name="class_id"
                                as="select"
                                className="form-control"
                                value={selectedClassId}
                                onChange={this.handleClassChange}
                              >
                                <option value="">Select Class</option>
                                {classesList.map(classItem => (
                                  <option key={classItem.id} value={classItem.id}>
                                    {classItem.name}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="class_id" component="div" className="text-danger" />
                            </div>
                            {selectedClassId && subjects.map((subject, index) => (
                              <div key={index} className="grade-row">
                                <Input
                                  type="text"
                                  name="name"
                                  placeholder="Subject"
                                  value={subject.name}
                                  onChange={(e) => this.handleInputChange(index, e)}
                                />
                                <Input
                                  type="number"
                                  name="exam_marks"
                                  placeholder="Total Exam Marks"
                                  value={subject.exam_marks}
                                  onChange={(e) => this.handleInputChange(index, e)}
                                />
                              </div>
                            ))}
                            <div className="btn-container">
                              <Button
                                className="button-add"
                                type="button"
                                onClick={this.handleAddSubject}
                                disabled={!selectedClassId}
                              >
                                + Add More Option
                              </Button>
                              <Button
                                className="button-remove"
                                type="button"
                                onClick={() => this.setState({ subjects: subjects.slice(0, -1) })}
                                disabled={!selectedClassId || subjects.length === 0}
                              >
                                - Remove Option
                              </Button>
                            </div>
                            
                            <div className="btn-container-save">
                              <Button
                                className="button-grade"
                                type="button"
                                onClick={this.debouncedHandleSaveChanges}
                                disabled={!selectedClassId || subjects.length === 0 || loading}
                              >
                                Save Changes
                              </Button>
                            </div>
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
  
        {/* Alert Modal */}
        {showAlert && (
          <Modal isOpen={showAlert} toggle={() => this.setState({ showAlert: false })}>
            <ModalBody>
              No Class has been found. Please add at least one Class before accessing this feature.
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleAlertButtonClick}>
                Add Class
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

SubjectForm.propTypes = {
  subjects: PropTypes.array.isRequired,
  classesList: PropTypes.array.isRequired,
  getSchoolSubjects: PropTypes.func.isRequired,
  updateSchoolSubjects: PropTypes.func.isRequired,
  getClassesList: PropTypes.func.isRequired,
  getClassSubjects: PropTypes.func.isRequired,
  success: PropTypes.string,
  errorMessage: PropTypes.string,
};

const mapStateToProps = (state) => ({
  subjects: state.schoolSubjects.schoolSubjects,
  classesList: state.classeslist.classesList,
});

const mapDispatchToProps = {
  getSchoolSubjects,
  updateSchoolSubjects,
  getClassesList,
  getClassSubjects
};

export default connect(mapStateToProps, mapDispatchToProps)(SubjectForm);
