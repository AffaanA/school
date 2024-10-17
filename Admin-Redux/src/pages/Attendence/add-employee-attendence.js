import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {addEmployeesAttendence, getEmployeesBySchool} from "../../store/actions";
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

class AddEmployeeAttendencePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      employees: [],
      showTable: false, // State to control the visibility of the table
      selectedDate: new Date(), // Manage date in state
    };
    this.formikRef = React.createRef(); // Reference for Formik instance
  }



  handleSubmit = (values, { setSubmitting }) => {
    console.log("submitsubmit", values.date);
    const { getEmployeesBySchool } = this.props;
    const { user_id } = this.state;
    if (user_id) {
        getEmployeesBySchool(user_id); // Dispatch action without expecting a Promise
      // Update the state with loading status
      this.setState({ showTable: false, selectedDate: values.date }); // Set date in state
      setSubmitting(false); // Set submitting to false to enable form submission again
    }
  };
  handleSaveAttendance = () => {
    const { employees, selectedDate } = this.state;
  
    // Format the selectedDate to YYYY-MM-DD
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0]; // Get YYYY-MM-DD
  
    const attendanceData = employees.map((employee, index) => {
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
  
      // Select check-in and check-out time input elements
      const checkInInput = document.querySelector(
        `input[name='check_in[${index}]']`
      );
      const checkOutInput = document.querySelector(
        `input[name='check_out[${index}]']`
      );
  
      let attendance = "A"; // Default to "Absent"
  
      if (presentInput && presentInput.checked) {
        attendance = "P";
      } else if (leaveInput && leaveInput.checked) {
        attendance = "L";
      }
  
      // Capture and format check-in and check-out times
      const checkInTime = checkInInput ? checkInInput.value : '';
      const checkOutTime = checkOutInput ? checkOutInput.value : '';
  
      // Combine date and time to match the required format
      const check_in = checkInTime ? `${formattedDate}T${checkInTime}:00Z` : ''; // ISO format
      const check_out = checkOutTime ? `${formattedDate}T${checkOutTime}:00Z` : ''; // ISO format
  
      // Debugging - Log the check-in and check-out times for each employee
      console.log(`Employee ${employee.id} check-in time:`, check_in);
      console.log(`Employee ${employee.id} check-out time:`, check_out);
  
      return {
        employee_id: employee.id,
        attendance,
        check_in,
        check_out,
        date: selectedDate, // Include date in attendance data
      };
    });
  
    // Debugging - Log the final attendance data
    console.log("Final Attendance Data to be sent:", attendanceData);
  
    // Dispatch the action to save attendance
    this.props.addEmployeesAttendence(attendanceData, this.state.user_id);
  };
  
  

  componentDidUpdate(prevProps) {
    const { successMessage, errorMessage, employees } = this.props;

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

    // Update the table visibility based on employees data
    if (employees !== prevProps.employees) {
      this.setState({ employees, showTable: employees.length > 0 });
    }
  }

  render() {
    const { classesList } = this.props;
    const { employees, showTable } = this.state;
    const { SearchBar } = Search;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: employees.length, // replace later with size(classes),
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
    };

    const validationSchema = Yup.object({
      date: Yup.date().required("Date is required"),
    });

    const columns = [
      {
        text: "id",
        dataField: "id",
        sort: true,
        hidden: true,
        formatter: (cellContent, employee) => <>{employee.id}</>,
      },
      {
        dataField: "national_id",
        text: "Employee ID",
        sort: true,
      },
      {
        dataField: "name",
        text: "Name",
        sort: true,
      },
      {
        dataField: "attendance",
        isDummyField: true,
        editable: false,
        text: "Attendance and Time",
        formatter: (cellContent, employee, rowIndex) => (
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
            {/* Check-in input */}
      <div>
        <label htmlFor={`check_in-${rowIndex}`}>Check-in</label>
        <input
          type="time"
          name={`check_in[${rowIndex}]`}
          id={`check_in-${rowIndex}`}
          className="form-control"
        />
      </div>

      {/* Check-out input */}
      <div>
        <label htmlFor={`check_out-${rowIndex}`}>Check-out</label>
        <input
          type="time"
          name={`check_out[${rowIndex}]`}
          id={`check_out-${rowIndex}`}
          className="form-control"
        />
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
                              Mark Manual Attendance of Employees
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
                          data={employees}
                        >
                          {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                              keyField="id"
                              columns={columns}
                              data={employees}
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
                          data={employees}
                        >
                          {({ paginationProps, paginationTableProps }) => (
                            <ToolkitProvider
                              keyField="id"
                              columns={columns}
                              data={employees}
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

AddEmployeeAttendencePage.propTypes = {
  addEmployeesAttendence: PropTypes.func.isRequired,
  getEmployeesBySchool: PropTypes.func.isRequired,
  employees: PropTypes.array.isRequired,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
};

const mapStateToProps = state => ({
  successMessage: state.employeesbyschoollist.successMessage || "", // Ensure default values
  errorMessage: state.employeesbyschoollist.errorMessage || "",
  employees: state.employeesbyschoollist.employeesbyschoolList || [],
});

export default connect(mapStateToProps, {
  getEmployeesBySchool,
  addEmployeesAttendence,
})(withRouter(AddEmployeeAttendencePage));
