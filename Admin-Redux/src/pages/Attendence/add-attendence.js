import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  getClassesList,
  getStudentsByClass,
  addAttendence,
} from "../../store/actions";
import { withRouter, Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

class AddAttendencePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      students: [],
      showTable: false, // State to control the visibility of the table
      selectedDate: new Date(), // Manage date in state
    };
    this.formikRef = React.createRef(); // Reference for Formik instance
  }

  componentDidMount() {
    const { getClassesList } = this.props;
    const { user_id } = this.state;
    getClassesList(user_id);
  }

  handleSubmit = (values, { setSubmitting }) => {
    console.log("submitsubmit", values.date);
    const { getStudentsByClass } = this.props;
    const { clas } = values; // Get the selected class ID from form values

    if (clas) {
      getStudentsByClass(clas); // Dispatch action without expecting a Promise

      // Update the state with loading status
      this.setState({ showTable: false, selectedDate: values.date }); // Set date in state
      setSubmitting(false); // Set submitting to false to enable form submission again
    }
  };

  handleSaveAttendance = () => {
    const { students, selectedDate } = this.state;

    const attendanceData = students.map((student, index) => {
      // Select the radio button input elements by name
      const presentInput = document.querySelector(
        `input[name='attendance[${index}]'][value='P']`
      );
      const leaveInput = document.querySelector(
        `input[name='attendance[${index}]'][value='L']`
      );
      const absentInput = document.querySelector(
        `input[name='attendance[${index}]'][value='A']`
      );

      let attendance = "A"; // Default to "Absent"

      if (presentInput && presentInput.checked) {
        attendance = "P";
      } else if (leaveInput && leaveInput.checked) {
        attendance = "L";
      }

      return {
        student_id: student.id,
        attendance,
        date: selectedDate, // Include date in attendance data
      };
    });

    console.log("Attendance Data:", attendanceData);
    this.props.addAttendence(attendanceData, this.state.user_id); // Dispatch the action to save attendance
  };

  componentDidUpdate(prevProps) {
    const { successMessage, errorMessage, students } = this.props;

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

    // Update the table visibility based on students data
    if (students !== prevProps.students) {
      this.setState({ students, showTable: students.length > 0 });
    }
  }

  render() {
    const { classesList } = this.props;
    const { students, showTable } = this.state;
    const { SearchBar } = Search;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: students.length, // replace later with size(classes),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const initialValues = {
      date: new Date(), // Default to current date
      clas: "",
    };

    const validationSchema = Yup.object({
      date: Yup.date().required("Date is required"),
      clas: Yup.string().required("Class is required"),
    });

    const columns = [
      {
        text: "id",
        dataField: "id",
        sort: true,
        hidden: true,
        formatter: (cellContent, student) => <>{student.id}</>,
      },
      {
        dataField: "registration_no",
        text: "Registration ID",
        sort: true,
      },
      {
        dataField: "student_name",
        text: "Name",
        sort: true,
      },
      {
        dataField: "attendance",
        isDummyField: true,
        editable: false,
        text: "Attendance",
        formatter: (cellContent, student, rowIndex) => (
          <div className="d-flex justify-content-center gap-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={`attendance[${rowIndex}]`}
                id={`present-${rowIndex}`}
                value="P"
                defaultChecked={true} // Set default checked for "Present"
              />
              <label
                className="form-check-label"
                htmlFor={`present-${rowIndex}`}
              >
                P
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={`attendance[${rowIndex}]`}
                id={`leave-${rowIndex}`}
                value="L"
              />
              <label className="form-check-label" htmlFor={`leave-${rowIndex}`}>
                L
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={`attendance[${rowIndex}]`}
                id={`absent-${rowIndex}`}
                value="A"
              />
              <label
                className="form-check-label"
                htmlFor={`absent-${rowIndex}`}
              >
                A
              </label>
            </div>
          </div>
        ),
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Mark Attendance | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Mark Attendance" />
            <Row className="justify-content-center">
              <Col md={10}>
                <Card>
                  <CardBody>
                    {!showTable ? (
                      <Formik
                        innerRef={this.formikRef}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={this.handleSubmit}
                      >
                        {({ setFieldValue, values }) => (
                          <Form className="grade-form">
                            <h4 className="text-center">
                              Mark Manual Attendance Class Wise
                            </h4>
                            {/* Date Selection */}
                            <div className="grade-row">
                              <DatePicker
                                selected={values.date}
                                onChange={date => setFieldValue("date", date)}
                                dateFormat="dd/MM/yyyy"
                                className="form-control grade-row-field"
                                id="date"
                              />
                              <ErrorMessage
                                name="date"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            {/* Class Selection */}
                            <div className="grade-row">
                              <Field
                                as="select"
                                name="clas"
                                id="clas"
                                className="form-control grade-row-field"
                              >
                                <option value="">Select Class</option>
                                {classesList.map(clas => (
                                  <option key={clas.id} value={clas.id}>
                                    {clas.name}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="clas"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="btn-container-save">
                              <Button className="button-grade" type="submit">
                                Search
                              </Button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    ) : (
                      <div>
                        {/* <PaginationProvider
                          pagination={paginationFactory(pageOptions)}
                          keyField="id"
                          columns={columns}
                          data={students}
                        >
                          {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                              keyField="id"
                              columns={columns}
                              data={students}
                              search
                            >
                              {toolkitprops => (
                                <React.Fragment>
                                  <Row className="mb-2">
                                    <Col sm="8" lg="8">
                                      <div className="search-box ms-2 mb-2 d-inline-block">
                                        <div className="position-relative">
                                          <SearchBar
                                            {...toolkitprops.searchProps}
                                          />
                                          <i className="bx bx-search-alt" />
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                  <BootstrapTable
                                    {...paginationTableProps}
                                    {...toolkitprops.baseProps}
                                  />
                                  <Col sm="4" lg="4" className="btn-container-save mt-4">
                                      <Button
                                        className="button-grade"
                                        onClick={this.handleSaveAttendance}
                                      >
                                        Save Attendance
                                      </Button>
                                    </Col>
                                  
                                </React.Fragment>
                              )}
                            </ToolkitProvider>
                          )}
                        </PaginationProvider> */}
                        <PaginationProvider
                          pagination={paginationFactory(pageOptions)}
                          keyField="id"
                          columns={columns}
                          data={students}
                        >
                          {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                              keyField="id"
                              columns={columns}
                              data={students}
                              search
                            >
                              {toolkitprops => (
                                <React.Fragment>
                                  <Row className="mb-2">
                                    <Col sm="8" lg="8">
                                      <div className="search-box ms-2 mb-2 d-inline-block">
                                        <div className="position-relative">
                                          <SearchBar
                                            {...toolkitprops.searchProps}
                                          />
                                          <i className="bx bx-search-alt search-icon" />
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row className="mb-4">
                                    <Col xl="12">
                                      <div className="table-responsive">
                                        <BootstrapTable
                                          {...toolkitprops.baseProps}
                                          {...paginationTableProps}
                                          defaultSorted={defaultSorted}
                                          classes={
                                            "table align-middle table-condensed table-hover"
                                          }
                                          bordered={false}
                                          striped={true}
                                          headerWrapperClasses={"table-light"}
                                          responsive
                                          ref={this.node}
                                        />
                                        <div className="btn-container-save mt-4">
                                          <Button
                                            className="button-grade"
                                            onClick={this.handleSaveAttendance}
                                          >
                                            Save Attendance
                                          </Button>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </React.Fragment>
                              )}
                            </ToolkitProvider>
                          )}
                        </PaginationProvider>
                      </div>
                    )}
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

AddAttendencePage.propTypes = {
  addAttendence: PropTypes.func.isRequired,
  getClassesList: PropTypes.func.isRequired,
  getStudentsByClass: PropTypes.func.isRequired,
  students: PropTypes.array.isRequired,
  classesList: PropTypes.array.isRequired,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
};

const mapStateToProps = state => ({
  successMessage: state.studentsbyclasslist.successMessage || "", // Ensure default values
  errorMessage: state.studentsbyclasslist.errorMessage || "",
  classesList: state.classeslist.classesList || [],
  students: state.studentsbyclasslist.studentsbyclassList || [],
});

export default connect(mapStateToProps, {
  getClassesList,
  getStudentsByClass,
  addAttendence,
})(withRouter(AddAttendencePage));
