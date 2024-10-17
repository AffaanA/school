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
  getStudents,
  addNewStudent,
  updateStudent,
  deleteStudent,
} from "../../store/students/actions";

import { isEmpty, size } from "lodash";
import "../../assets/scss/table.scss";
class StudentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      students: [],
      student: "",
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
          formatter: (cellContent, student) => <>{student.id}</>,
        },
        {
          dataField: "student_name",
          text: "Name",
          sort: true,
        },
        {
          dataField: "mobile_no",
          text: "Mobile No",
          sort: true,
          //   formatter: (cellContent, student) => (
          //     <>
          //       <span>
          //       {student.test_type != "Test" && (
          //                       <div>
          //                         <Link
          //                         to="#"
          //                         onClick={e => this.openPatientModal(e, student)}
          //                       >
          //                         <span>
          //                         {student.phone}
          //                         </span>
          //                       </Link>
          //                       </div>
          //                     )}
          //        {student.test_type == "Test" && (
          //                       <div>
          //                         <span>
          //                         {student.test_name}
          //                         </span>
          //                       </div>
          //                     )}
          //           {/* <Link
          //             to="#"
          //             onClick={e => this.openPatientModal(e, student)}
          //           >
          //            {student.test_name}
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
        // {
        //   dataField: "previous_id_board_roll_no",
        //   text: "Salary",
        //   sort: true,
        //   formatter: (cellContent, student) => (
        //     <>
        //       {
        //         <span>
        //           {student.previous_id_board_roll_no
        //             .toString()
        //             .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        //         </span>
        //       }
        //     </>
        //   ),
        // },
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
          formatter: (cellContent, student) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleStudentClick(student)}
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(student)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleStudentClick = this.handleStudentClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleStudentClicks = this.handleStudentClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { students, onGetStudents } = this.props;
    console.log("getiingemployees", onGetStudents(this.state.user_id));
    this.setState({ students });
    console.log("state", this.state.students);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ student: selectedGroup.value });
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
  handleStudentClicks = () => {
    this.setState({ student: "", isEdit: false, student_id: "" });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { students } = this.props;
    if (!isEmpty(students) && size(prevProps.students) !== size(students)) {
      this.setState({ students: {}, isEdit: false });
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

  onClickDelete = students => {
    this.setState({ students: students });
    this.setState({ deleteModal: true });
  };

  handleDeleteStudent = () => {
    const { onDeleteStudent, onGetStudents } = this.props;
    const { students } = this.state;
    if (students.id !== undefined) {
      onDeleteStudent(students);
      setTimeout(() => {
        onGetStudents(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleStudentClick = arg => {
    const student = arg;
    this.setState({
      student_id: student.id,
      student: {
        id: student.id,
        student_name: student.student_name,
        birth_form_id: student.birth_form_id,
        email: student.email,
        phone: student.mobile_no,
        previous_id_board_roll_no: student.previous_id_board_roll_no,
        address: student.address,
        blood_group: student.blood_group,
        date_of_admission: student.date_of_admission,
        date_of_birth: student.date_of_birth,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { students } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onUpdateStudent,
      onGetStudents,
    } = this.props;
    const student = this.state.student;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: students.length, // replace later with size(students),
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
    //   for (let j = 0; j < students.length; j++) {
    //     if (tests[i].id == students[j].test_id) {
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
          onDeleteClick={this.handleDeleteStudent}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Students List | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Students List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.employeeListColumns}
                      data={students}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.employeeListColumns}
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
                                          ? "Edit Student"
                                          : "Add Offered Test"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            student_id:
                                              (student && student.id) || "",
                                            student_name:
                                              (student && student.student_name) || "",
                                            email:
                                              (student && student.email) ||
                                              "",
                                            phone:
                                              (student && student.phone) ||
                                              "",
                                            previous_id_board_roll_no:
                                              (student &&
                                                student.previous_id_board_roll_no) ||
                                              "",
                                            address:
                                              (student && student.address) ||
                                              "",
                                            date_of_birth:
                                              (student && student.date_of_birth) || "",
                                            date_of_admission:
                                              (student && student.date_of_admission) || "",
                                            birth_form_id:
                                              (student &&
                                                student.birth_form_id) ||
                                              "",
                                            blood_group:
                                              (student &&
                                                student.blood_group) ||
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
                                            previous_id_board_roll_no: Yup.number()
                                              .required(
                                                "Please enter the monthly salary"
                                              )
                                              .positive(
                                                "Salary must be a positive number"
                                              )
                                              .integer(
                                                "Salary must be an integer"
                                              ),
                                            address: Yup.string().required(
                                              "Please enter the address"
                                            ),
                                            date_of_admission: Yup.date().required(
                                              "Please enter the date joined"
                                            ),
                                            date_of_birth: Yup.date().required(
                                              "Please enter the date of birth"
                                            ),
                                            birth_form_id: Yup.string()
                                              .required(
                                                "Please enter the CNIC/National ID"
                                              )
                                              .matches(
                                                /^[0-9]{13}$/,
                                                "Please enter a valid 13-digit CNIC"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            console.log("i am click editt")
                                            if (isEdit) {
                                              const updateStudent = {
                                                id: student.id,
                                                email: values.email,
                                                student_name: values.student_name,
                                                phone: values.phone,
                                                previous_id_board_roll_no:
                                                  values.previous_id_board_roll_no,
                                                address: values.address,
                                                date_of_birth: values.date_of_birth,
                                                birth_form_id: values.birth_form_id,
                                                blood_group: values.blood_group,
                                                date_of_admission: values.date_of_admission,
                                              };

                                              onUpdateStudent(
                                                updateStudent,
                                                this.state.user_id
                                              );

                                              setTimeout(() => {
                                                onGetStudents(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            } 

                                            this.setState({
                                              selectedStudent: null,
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
                                                      Student Name
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="student_name"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.student_name &&
                                                        touched.student_name
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="student_name"
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
                                                      name="birth_form_id"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.birth_form_id &&
                                                        touched.birth_form_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="birth_form_id"
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
                                                      Previous board roll no
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="previous_id_board_roll_no"
                                                      className={
                                                        "form-control" +
                                                        (errors.previous_id_board_roll_no &&
                                                        touched.previous_id_board_roll_no
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="previous_id_board_roll_no"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* <div className="mb-3">
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
                                                  </div> */}

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
                                                      name="date_of_birth"
                                                      type="date"
                                                      value={student.date_of_birth}
                                                      className={
                                                        "form-control" +
                                                        (errors.date_of_birth &&
                                                        touched.date_of_birth
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="date_of_birth"
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
                                                      name="date_of_admission"
                                                      type="date"
                                                      value={student.date_of_admission}
                                                      className={
                                                        "form-control" +
                                                        (errors.date_of_admission &&
                                                        touched.date_of_admission
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="date_of_admission"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* <div className="mb-3">
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
                                                  </div> */}
                                                </Col>
                                              </Row>

                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                      disabled={
                                                        !this.state.student.id
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

StudentsList.propTypes = {
  match: PropTypes.object,
  students: PropTypes.array,
  className: PropTypes.any,
  onGetStudents: PropTypes.func,
  onDeleteStudent: PropTypes.func,
  onUpdateStudent: PropTypes.func,
};

const mapStateToProps = ({ students }) => ({
  students: students.students,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetStudents: id => dispatch(getStudents(id)),
  onUpdateStudent: student => dispatch(updateStudent(student)),
  onDeleteStudent: student => dispatch(deleteStudent(student)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StudentsList));
