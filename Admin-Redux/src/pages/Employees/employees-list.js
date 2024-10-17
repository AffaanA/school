import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
// import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
  getEmployees,
  addNewEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../store/employees/actions";

import { isEmpty, size } from "lodash";
import "../../assets/scss/table.scss";
class EmployeesList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      employees: [],
      employeeDetails: null, // Employee details for modal
      employeeModal: false,
      employee: "",
      type: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      employeeListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, employee) => <>{employee.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
          formatter: (cellContent, employee) => (
            <Link to="#" onClick={() => this.openEmployeeDetails(employee)}>
              {employee.name}
            </Link>
          ),
        },
        {
          dataField: "phone",
          text: "Phone",
          sort: true,
          //   formatter: (cellContent, employee) => (
          //     <>
          //       <span>
          //       {employee.test_type != "Test" && (
          //                       <div>
          //                         <Link
          //                         to="#"
          //                         onClick={e => this.openPatientModal(e, employee)}
          //                       >
          //                         <span>
          //                         {employee.phone}
          //                         </span>
          //                       </Link>
          //                       </div>
          //                     )}
          //        {employee.test_type == "Test" && (
          //                       <div>
          //                         <span>
          //                         {employee.test_name}
          //                         </span>
          //                       </div>
          //                     )}
          //           {/* <Link
          //             to="#"
          //             onClick={e => this.openPatientModal(e, employee)}
          //           >
          //            {employee.test_name}
          //           </Link> */}
          //       </span>
          //     </>
          //   ),
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
        },
        {
          dataField: "monthly_salary",
          text: "Salary",
          sort: true,
          formatter: (cellContent, employee) => (
            <>
              {
                <span>
                  {employee.monthly_salary
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
              }
            </>
          ),
        },
        {
          dataField: "address",
          text: "Address",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, employee) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#" onClick={() => this.handleEmployeeClick(employee)}>
                <i className="mdi mdi-pencil font-size-18" id="edittooltip"></i>
              </Link>
              <Link className="text-danger" to="#" onClick={() => this.onClickDelete(employee)}>
                <i className="mdi mdi-delete font-size-18" id="deletetooltip"></i>
              </Link>
            </div>
          ),
        }

      ],
    };
    this.handleEmployeeClick = this.handleEmployeeClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleEmployeeClicks = this.handleEmployeeClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.toggleEmployeeModal = this.toggleEmployeeModal.bind(this);
    this.openEmployeeDetails = this.openEmployeeDetails.bind(this);
  }

  componentDidMount() {
    const { employees, onGetEmployees } = this.props;
    console.log("getiingemployees", onGetEmployees(this.state.user_id));
    this.setState({ employees });
    console.log("state", this.state.employees);
  }

  openEmployeeDetails(employee) {
    this.setState({
      employeeDetails: employee,
      employeeModal: true, // Open modal
    });
  }


  toggleEmployeeModal() {
    this.setState((prevState) => ({
      employeeModal: !prevState.employeeModal, // Toggle modal
    }));
  }


  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleSelectGroup = selectedGroup => {
    this.setState({ employee: selectedGroup.value });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      test_details: arg.test_details,
    });
  };

  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  handleEmployeeClicks = () => {
    this.setState({ employee: "", isEdit: false, employee_id: "" });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { employees } = this.props;
    if (!isEmpty(employees) && size(prevProps.employees) !== size(employees)) {
      this.setState({ employees: {}, isEdit: false });
    }
  }

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = employees => {
    this.setState({ employees: employees });
    this.setState({ deleteModal: true });
  };

  handleDeleteEmployee = () => {
    console.log("i am called")
    const { onDeleteEmployee, onGetEmployees } = this.props;
    const { employees } = this.state;
    console.log("i am called", employees)
    if (employees.id !== undefined) {
      console.log("i am called", employees)
      onDeleteEmployee(employees);
      setTimeout(() => {
        onGetEmployees(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleEmployeeClick = arg => {
    const employee = arg;
    this.setState({
      employee_id: employee.id,
      employee: {
        id: employee.id,
        name: employee.name,
        national_id: employee.national_id,
        email: employee.email,
        phone: employee.phone,
        monthly_salary: employee.monthly_salary,
        education: employee.education,
        experience: employee.experience,
        address: employee.address,
        blood_group: employee.blood_group,
        date_joined: employee.date_joined,
        dob: employee.dob,
        father_husband_name: employee.father_husband_name,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { employees } = this.props;

    const { isEdit, deleteModal } = this.state;
    const { employeeDetails, employeeModal } = this.state;
    const {
      onUpdateEmployee,
      onGetEmployees,
    } = this.props;
    const employee = this.state.employee;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: employees.length, // replace later with size(employees),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    // const testList = [];
    // for (let i = 0; i < tests.length; i++) {
    //   let flag = 0;

    //   // Check if test available in our database is already being offered by lab
    //   // If yes then don't push it in testList
    //   for (let j = 0; j < employees.length; j++) {
    //     if (tests[i].id == employees[j].test_id) {
    //       flag = 1;
    //     }
    //   }

    //   if (!flag) {
    //     testList.push({
    //       label: tests[i].name,
    //       value: tests[i].id,
    //     });
    //   }
    // }

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteEmployee}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Employees List | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Employees List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.employeeListColumns}
                      data={employees}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.employeeListColumns}
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

                                {/* <Col sm="2" lg="2">
                                  <div>
                                    <Link
                                      to={"/medical-test-sheet"}
                                      className="w-100 font-16 btn btn-secondary"
                                    >
                                      {" "}
                                      <i className="mdi mdi-microsoft-excel me-1" />
                                      Tests Sheet{" "}
                                    </Link>
                                  </div>
                                </Col> */}
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
                                    {/* Employee Details Modal */}
                                    {employeeDetails && (
                                      <Modal
                                        isOpen={employeeModal}
                                        toggle={this.toggleEmployeeModal}
                                        centered
                                      >
                                        <ModalHeader toggle={this.toggleEmployeeModal} close={
                                          <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            onClick={this.toggleEmployeeModal}
                                          ></button>
                                        }>
                                          {employeeDetails.name} - Classes and Subjects
                                        </ModalHeader>
                                        <ModalBody>
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr>
                                                <th>Class</th>
                                                <th>Subjects</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {employeeDetails.classes?.map((cls) => (
                                                <tr key={cls.name}>
                                                  <td>{cls.name}</td>
                                                  <td>
                                                    {cls.subjects?.length > 0 ? (
                                                      cls.subjects.map((subject) => subject.name).join(", ")
                                                    ) : (
                                                      "No Subjects Available"
                                                    )}
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </ModalBody>
                                      </Modal>
                                    )}

                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Included Tests
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <textarea
                                                      name="test_details"
                                                      id="test_details"
                                                      rows="10"
                                                      cols="10"
                                                      value={
                                                        this.state.test_details
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Employee"
                                          : "Add Offered Test"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            employee_id:
                                              (employee && employee.id) || "",
                                            name:
                                              (employee && employee.name) || "",
                                            email:
                                              (employee && employee.email) ||
                                              "",
                                            phone:
                                              (employee && employee.phone) ||
                                              "",
                                            education:
                                              (employee &&
                                                employee.education) ||
                                              "",
                                            monthly_salary:
                                              (employee &&
                                                employee.monthly_salary) ||
                                              "",
                                            address:
                                              (employee && employee.address) ||
                                              "",
                                            date_joined:
                                              (employee &&
                                                employee.date_joined) ||
                                              "",
                                            dob:
                                              (employee && employee.dob) || "",
                                            experience:
                                              (employee &&
                                                employee.experience) ||
                                              "",
                                            national_id:
                                              (employee &&
                                                employee.national_id) ||
                                              "",
                                            father_husband_name:
                                              (employee &&
                                                employee.father_husband_name) ||
                                              "",
                                            blood_group:
                                              (employee &&
                                                employee.blood_group) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            email: Yup.string()
                                              .email(
                                                "Please enter a valid email address"
                                              )
                                              .required(
                                                "Please enter an email"
                                              ),
                                            phone: Yup.string()
                                              .required(
                                                "Please enter a phone number"
                                              )
                                              .matches(
                                                /^[0-9]+$/,
                                                "Please enter a valid phone number"
                                              )
                                              .min(
                                                10,
                                                "Phone number must be at least 10 digits"
                                              )
                                              .max(
                                                15,
                                                "Phone number must be no more than 15 digits"
                                              ),
                                            education: Yup.string().required(
                                              "Please enter education details"
                                            ),
                                            monthly_salary: Yup.number()
                                              .required(
                                                "Please enter the monthly salary"
                                              )
                                              .positive(
                                                "Salary must be a positive number"
                                              )
                                              .integer(
                                                "Salary must be an integer"
                                              )
                                              .min(
                                                0,
                                                "Please enter a number greater than or equal to 0"
                                              )
                                              .max(
                                                50000,
                                                "Please enter a number less than or equal to 50000"
                                              ),
                                            address: Yup.string().required(
                                              "Please enter the address"
                                            ),
                                            date_joined: Yup.date().required(
                                              "Please enter the date joined"
                                            ),
                                            dob: Yup.date().required(
                                              "Please enter the date of birth"
                                            ),
                                            experience: Yup.string().required(
                                              "Please enter experience details"
                                            ),
                                            national_id: Yup.string()
                                              .required(
                                                "Please enter the CNIC/National ID"
                                              )
                                              .matches(
                                                /^[0-9]{13}$/,
                                                "Please enter a valid 13-digit CNIC"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateEmployee = {
                                                id: employee.id,
                                                name: values.name,
                                                email: values.email,
                                                phone: values.phone,
                                                education: values.education,
                                                monthly_salary:
                                                  values.monthly_salary,
                                                address: values.address,
                                                date_joined: values.date_joined,
                                                dob: values.dob,
                                                experience: values.experience,
                                                national_id: values.national_id,
                                                father_husband_name: values.father_husband_name,
                                                blood_group: values.blood_group,
                                              };

                                              // Update Employee
                                              onUpdateEmployee(
                                                updateEmployee,
                                                this.state.user_id
                                              );

                                              setTimeout(() => {
                                                onGetEmployees(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            } else {
                                              // Logic for adding a new employee
                                            }

                                            this.setState({
                                              selectedEmployee: null,
                                            });
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Employee Name
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.name &&
                                                          touched.name
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Phone
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="phone"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.phone &&
                                                          touched.phone
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="phone"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      CNIC
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="national_id"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.national_id &&
                                                          touched.national_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="national_id"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Email
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="email"
                                                      type="email"
                                                      className={
                                                        "form-control" +
                                                        (errors.email &&
                                                          touched.email
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="email"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Monthly Salary
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="monthly_salary"
                                                      type="number"
                                                      className={
                                                        "form-control" +
                                                        (errors.monthly_salary &&
                                                          touched.monthly_salary
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="monthly_salary"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Education
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="education"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.education &&
                                                          touched.education
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="education"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Experience
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="experience"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.experience &&
                                                          touched.experience
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="experience"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Address
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="address"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.address &&
                                                          touched.address
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="address"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Blood Group
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="blood_group"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.blood_group &&
                                                          touched.blood_group
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="blood_group"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Date of Birth
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="dob"
                                                      type="date"
                                                      value={employee.dob}
                                                      className={
                                                        "form-control" +
                                                        (errors.dob &&
                                                          touched.dob
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="dob"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Date Joined
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="date_joined"
                                                      type="date"
                                                      className={
                                                        "form-control" +
                                                        (errors.date_joined &&
                                                          touched.date_joined
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="date_joined"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Father/Husband Name
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="father_husband_name"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.father_husband_name &&
                                                          touched.father_husband_name
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="father_husband_name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                </Col>
                                              </Row>

                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                      disabled={
                                                        !this.state.employee.id
                                                      }
                                                    >
                                                      Save
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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

EmployeesList.propTypes = {
  match: PropTypes.object,
  employees: PropTypes.array,
  className: PropTypes.any,
  onGetEmployees: PropTypes.func,
  onDeleteEmployee: PropTypes.func,
  onUpdateEmployee: PropTypes.func,
};

const mapStateToProps = ({ employees }) => ({
  employees: employees.employees,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetEmployees: id => dispatch(getEmployees(id)),
  onUpdateEmployee: employee => dispatch(updateEmployee(employee)),
  onDeleteEmployee: employee => dispatch(deleteEmployee(employee)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EmployeesList));
