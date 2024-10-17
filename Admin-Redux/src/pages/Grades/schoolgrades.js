import React, { Component } from "react";
import { connect } from "react-redux";
import { getSchoolGrades, updateSchoolGrades } from "../../store/actions";
import { Button, Card, CardBody, Col, Container, Row, Input } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { Formik, Form } from "formik";
import _ from 'lodash'; // Add lodash for debouncing

class GradeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grades: [], // grades fetched from backend will be stored here
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      loading: false, // Track loading state
    };

    // Debounce handleSaveChanges to prevent multiple calls
    this.debouncedHandleSaveChanges = _.debounce(this.handleSaveChanges, 2000);
  }

  componentDidMount() {
    console.log("Component mounted. Fetching school grades...");
    this.props.getSchoolGrades(this.state.user_id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.grades !== this.props.grades) {
      console.log("Grades updated from props. Updating local state...");
      this.setState({ grades: this.props.grades });
    }
  }

  handleAddGrade = () => {
    console.log("Adding a new grade row...");
    this.setState((prevState) => ({
      grades: [
        ...prevState.grades,
        { name: "", from_percentage: "", to_percentage: "", status: "", id: null },
      ],
    }));
  };

  handleInputChange = (index, event) => {
    const { name, value } = event.target;
    console.log(`Input changed for index ${index}. Field: ${name}, Value: ${value}`);
    this.setState((prevState) => {
      const grades = [...prevState.grades];
      grades[index][name] = value;
      return { grades };
    });
  };

  handleSaveChanges = async () => {
    const { grades, user_id } = this.state;

    if (this.state.loading) {
      console.log("Save Changes button clicked but already loading. Ignoring...");
      return;
    }

    console.log("Save Changes clicked. Setting loading state to true...");
    this.setState({ loading: true });

    try {
      console.log("Sending API request to update school grades...");
      await this.props.updateSchoolGrades(grades, user_id);
      console.log('Grades processed successfully');

      console.log("Fetching updated school grades...");
      await this.props.getSchoolGrades(user_id);
      console.log('Grades updated successfully');
    } catch (error) {
      console.error('Error processing grades:', error);
    } finally {
      console.log("Resetting loading state...");
      this.setState({ loading: false });
    }
  };

  render() {
    const { grades, loading } = this.state;

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumb title="School" breadcrumbItem="Grades" />
            <Row className="justify-content-center">
              <Col md={10} lg={10} xl={10}> 
                <Card>
                  <CardBody>
                    <Formik>
                      {() => (
                        <Form className="form-horizontal">
                          <div className="grade-form">
                            {grades.map((grade, index) => (
                              <div key={index} className="grade-row">
                                <Input
                                  type="text"
                                  name="name"
                                  placeholder="Grade"
                                  value={grade.name}
                                  onChange={(e) => this.handleInputChange(index, e)}
                                />
                                <Input
                                  type="number"
                                  name="from_percentage"
                                  placeholder="% From"
                                  value={grade.from_percentage}
                                  onChange={(e) => this.handleInputChange(index, e)}
                                />
                                <Input
                                  type="number"
                                  name="to_percentage"
                                  placeholder="% Upto"
                                  value={grade.to_percentage}
                                  onChange={(e) => this.handleInputChange(index, e)}
                                />
                                <Input
                                  type="text"
                                  name="status"
                                  placeholder="Status"
                                  value={grade.status}
                                  onChange={(e) => this.handleInputChange(index, e)}
                                />
                              </div>
                            ))}
                            <div className="btn-container">
                              <Button
                                className="button-add"
                                type="button"
                                onClick={this.handleAddGrade}
                              >
                                + Add More Option
                              </Button>
                              <Button
                                className="button-remove"
                                type="button"
                                onClick={() => this.setState({ grades: grades.slice(0, -1) })}
                              >
                                - Remove Option
                              </Button>
                            </div>
                            <div className="btn-container-save">
                              <Button
                                className="button-grade"
                                type="button"
                                onClick={this.debouncedHandleSaveChanges} // Use debounced function
                                disabled={loading} // Disable button when loading
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  grades: state.schoolGrades.success,
});

const mapDispatchToProps = {
  getSchoolGrades,
  updateSchoolGrades,
};

export default connect(mapStateToProps, mapDispatchToProps)(GradeForm);
