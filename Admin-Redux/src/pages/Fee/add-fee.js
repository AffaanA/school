import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateSchoolFee,
  getClassesList,
  getStudentsList,
  getSchoolFee,
} from "../../store/actions";
import { debounce } from "lodash"; // Import debounce from lodash
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
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Common/Breadcrumb";
import Select from "react-select";

class FeeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fee: {
        admission_fee: "",
        registration_fee: "",
        art_material: "",
        transport: "",
        books: "",
        uniform: "",
        fine: "",
        others: "",
        class_id: "", // For specific class selection
        student: "",
      },
      selectedParticular: "all_students",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.formRef = React.createRef(); // Create a ref for the form
    // this.debouncedHandleSaveChanges = _.debounce(this.handleSaveChanges, 2000);
    this.debouncedHandleSaveChanges = debounce(this.handleSaveChanges.bind(this), 300);

  }

  componentDidMount() {
    const { getSchoolFee, getClassesList, getStudentsList } = this.props;
    const { user_id } = this.state;
    const fee_particulars_for = "all_students";

    console.log("Component did mount - user_id:", user_id);
    getSchoolFee(user_id, fee_particulars_for);
    getClassesList(user_id);
    getStudentsList(user_id);
  }

  componentDidUpdate(prevProps) {
    const { success, error, fee } = this.props;

    if (fee !== prevProps.fee) {
      console.log("Fee data updated:", fee);
      this.setState({ fee });
    }

    if (success && success !== prevProps.success) {
      toast.success(success);
      this.setState({ ...this.initialState }); // Reset state to initial values
    }

    if (error && error !== prevProps.error) {
      toast.error(error);
    }
  }

  handleInputChange = (name, event) => {
    const { value } = event.target;
    console.log(`Input changed - ${name}:`, value);

    this.setState(prevState => {
      const updatedFee = { ...prevState.fee, [name]: value };
      // Check if the changed field requires re-fetching data
      if (name === 'class_id' || name === 'student') {
        this.handleGettingData(updatedFee);
      }
      return { fee: updatedFee };
    });
  };

  handleParticularsChange = event => {
    const selectedParticular = event.target.value;
    console.log("Particulars changed:", selectedParticular);
    this.setState({ selectedParticular }, () => {
      this.handleGettingData(this.state.fee); // Pass the current fee state
    });
  };

  handleGettingData = async (updatedFee) => {
    const { user_id, selectedParticular } = this.state;
    let queryParams = {};

    if (selectedParticular === "all_students") {
      queryParams = { fee_particulars_for: "all_students" };
    } else if (selectedParticular === "specific_class") {
      queryParams = {
        fee_particulars_for: "specific_class",
        class_id: updatedFee.class_id,
      };
    } else if (selectedParticular === "specific_student") {
      queryParams = {
        fee_particulars_for: "specific_student",
        student_id: updatedFee.student,
      };
    }

    console.log("Fetching data with queryParams:", queryParams);
    try {
      await this.props.getSchoolFee(user_id, queryParams);
    } catch (error) {
      toast.error("Unexpected error occurred");
      console.error("Unexpected error:", error);
    }
  };

  handleSaveChanges = async () => {
    const { fee, user_id, selectedParticular } = this.state;

    if (selectedParticular === "specific_class" && !fee.class_id) {
      toast.error("Class ID is required for the selected class.");
      console.log("Error: Class ID is required.");
      return;
    }

    if (selectedParticular === "specific_student" && !fee.student) {
      toast.error("Student is required for the selected student.");
      console.log("Error: Student is required.");
      return;
    }

    const dataToSend = {
      fee,
      particular_type: selectedParticular,
    };

    console.log("Saving changes with data:", dataToSend);
    try {
      await this.props.updateSchoolFee(dataToSend, user_id);
    } catch (error) {
      toast.error("Unexpected error occurred");
      console.error("Unexpected error:", error);
    }
  };

  render() {
    const { selectedParticular, fee } = this.state;
    const { classesList, studentsList } = this.props;

    const classOptions = classesList.map(classItem => ({
      label: classItem.name,
      value: classItem.id,
    }));

    const studentOptions = studentsList.map(student => ({
      label: student.student_name,
      value: student.id,
    }));
    const fieldsToInclude = [
      "admission_fee",
      "registration_fee",
      "art_material",
      "transport",
      "books",
      "uniform",
      "fine",
      "others",
    ];
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumb title="School" breadcrumbItem="Fee" />
            <Row className="justify-content-center">
              <Col md={10} lg={10} xl={10}>
                <Card>
                  <CardBody>
                    <form ref={this.formRef} className="form-horizontal">
                      <div className="grade-form">
                        <div className="grade-row">
                          <Input
                            type="select"
                            name="fee_particulars_for"
                            id="fee_particulars_for"
                            value={selectedParticular}
                            onChange={this.handleParticularsChange}
                          >
                            <option value="all_students">All Students</option>
                            <option value="specific_class">
                              Specific Class
                            </option>
                            <option value="specific_student">
                              Specific Student
                            </option>
                          </Input>
                        </div>

                        {selectedParticular === "specific_class" && (
                          <div className="grade-row">
                            <Input
                              type="select"
                              name="class_id"
                              className="form-control grade-row-field"
                              value={fee.class_id || ""}
                              onChange={e =>
                                this.handleInputChange("class_id", e)
                              }
                            >
                              <option value="">Select Class</option>
                              {classOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Input>
                          </div>
                        )}

                        {selectedParticular === "specific_student" && (
                          <div className="grade-row">
                            <Input
                              type="select"
                              name="student"
                              className="form-control grade-row-field"
                              value={fee.student || ""}
                              onChange={e =>
                                this.handleInputChange("student", e)
                              }
                            >
                              <option value="">Select Student</option>
                              {studentOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Input>
                          </div>
                        )}

                        {Object.keys(fee).map(
                          key =>
                            fieldsToInclude.includes(key) && (
                              <div className="grade-row" key={key}>
                                <Label for={key}>
                                  {key.replace("_", " ").toUpperCase()}
                                </Label>
                                <Input
                                  type="number"
                                  name={key}
                                  id={key}
                                  placeholder="Fee"
                                  value={fee[key] || ""}
                                  onChange={e => this.handleInputChange(key, e)}
                                />
                              </div>
                            )
                        )}
                      </div>

                      <div className="btn-container-save">
                        <Button
                          className="button-grade"
                          type="button"
                          onClick={this.debouncedHandleSaveChanges} // Use debounced function
                          >
                          Save Changes
                        </Button>
                      </div>
                    </form>
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

const mapStateToProps = state => ({
  fee: state.schoolFee.success,
  success: state.schoolFee.success,
  error: state.schoolFee.error,
  classesList: state.classeslist.classesList,
  studentsList: state.studentslist.studentsList,
});

const mapDispatchToProps = dispatch => ({
  updateSchoolFee: (data, user_id) => dispatch(updateSchoolFee(data, user_id)),
  getClassesList: user_id => dispatch(getClassesList(user_id)),
  getStudentsList: user_id => dispatch(getStudentsList(user_id)),
  getSchoolFee: (user_id, queryParams) => {
    console.log("Dispatching getSchoolFee with user_id:", user_id, "and queryParams:", queryParams);
    dispatch(getSchoolFee(user_id, queryParams));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FeeForm);
