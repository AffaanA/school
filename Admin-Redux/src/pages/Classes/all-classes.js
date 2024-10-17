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
import { getTeachersList } from '../../store/actions';
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
  getClasses,
  addNewEmployee,
  updateClass,
  deleteClass,
} from "../../store/classes/actions";

import { isEmpty, size } from "lodash";
import "../../assets/scss/table.scss";
class ClassesList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      classes: [],
      clas: "",
      type: "",
      modal: false,

      deleteModal: false,
      clasDetails: null,
      clasmodal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      clasListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, clas) => <>{clas.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,

        },

        {
          dataField: "teacher_names", // Update this field to match the data structure
          text: "Teacher",
          sort: true,
          formatter: (cellContent, clas) => (
            <>
              {clas.teacher_names && clas.teacher_names.length > 0
                ? clas.teacher_names.join(", ") // Join all teacher names with a comma
                : "No Teacher Assigned"}
            </>
          ),
        },
        {
          dataField: "monthly_fee",
          text: "Salary",
          sort: true,
          formatter: (cellContent, clas) => (
            <>
              {
                <span>
                  {clas.monthly_fee
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
              }
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, clas) => (
            <div className="d-flex gap-3 align-items-center justify-content-center">
              <Link className="text-primary" to="#">
                <i className="mdi mdi-eye font-size-18" id="detailtooltip" onClick={() => this.handleClassClick(clas)}></i>
              </Link>
              <Link className="text-success" to="#">
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" onClick={() => this.handleEmployeeClick(clas)}></i>
              </Link>
              <Link className="text-danger" to="#">
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" onClick={() => this.onClickDelete(clas)}></i>
              </Link>
            </div>
          ),
        },

      ],
    };
    this.handleEmployeeClick = this.handleEmployeeClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleEmployeeClicks = this.handleEmployeeClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.togglemyModal = this.togglemyModal.bind(this);
    this.handleClassClick = this.handleClassClick.bind(this);
  }

  componentDidMount() {
    const { teachersList, onGetTeachersList } = this.props;
    if (teachersList && !teachersList.length) {
      onGetTeachersList(this.state.user_id);
    }
    const { classes, onGetClasses } = this.props;
    console.log("getiingclasses", onGetClasses(this.state.user_id));
    this.setState({ classes });
    console.log("state", this.state.classes);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  // Function to handle class click
  handleClassClick(clas) {
    console.log("Class clicked:", clas); // Debugging: Check if this logs

    // Set selected class details and open modal
    this.setState({
      clasDetails: clas,
      clasmodal: true, // Open the modal
    }, () => {
      // Verify the modal state is updated
      console.log("Modal open state:", this.state.clasmodal); // Debugging: Check if modal state is true
    });
  }

  // Toggle modal visibility
  togglemyModal() {
    this.setState(prevState => ({
      clasmodal: !prevState.clasmodal,
    }), () => {
      // Debugging: Check the modal state when toggled
      console.log("Modal toggled, new state:", this.state.clasmodal);
    });
  }
  handleSelectGroup = selectedGroup => {
    this.setState({ clas: selectedGroup.value });
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
    this.setState({ clas: "", isEdit: false, clas_id: "" });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { classes } = this.props;
    if (!isEmpty(classes) && size(prevProps.classes) !== size(classes)) {
      this.setState({ classes: {}, isEdit: false });
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

  onClickDelete = classes => {
    this.setState({ classes: classes });
    this.setState({ deleteModal: true });
  };

  handleDeleteEmployee = () => {
    const { onDeleteEmployee, onGetClasses } = this.props;
    const { classes } = this.state;
    if (classes.id !== undefined) {
      onDeleteEmployee(classes);
      setTimeout(() => {
        onGetClasses(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleEmployeeClick = arg => {
    const clas = arg;
    this.setState({
      clas_id: clas.id,
      clas: {
        id: clas.id,
        name: clas.name,
        monthly_fee: clas.monthly_fee,
        teacher: clas.teacher,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { classes } = this.props;

    const { isEdit, deleteModal } = this.state;
    const { clasmodal, clasDetails } = this.state;
    const { onUpdateEmployee, onGetClasses } = this.props;
    const clas = this.state.clas;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: classes.length, // replace later with size(classes),
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
    //   for (let j = 0; j < classes.length; j++) {
    //     if (tests[i].id == classes[j].test_id) {
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
            <title>Classes List | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Classes List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.clasListColumns}
                      data={classes}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.clasListColumns}
                          data={classes}
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
                                    <Modal isOpen={clasmodal} toggle={this.togglemyModal} className={this.props.className}>
                                      <ModalHeader toggle={this.togglemyModal}>Class Details</ModalHeader>
                                      <ModalBody>
                                        {clasDetails ? (
                                          <table className="table table-bordered">
                                            <thead>
                                              <tr>
                                                <th>Detail</th>
                                                <th>Information</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td><strong>Class Name</strong></td>
                                                <td>{clasDetails.name}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Teacher Names</strong></td>
                                                <td>{clasDetails.teacher_names ? clasDetails.teacher_names.join(", ") : "No Teacher Assigned"}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Total Students</strong></td>
                                                <td>{clasDetails.student_count}</td>
                                              </tr>
                                              <tr>
                                                <td><strong>Subjects</strong></td>
                                                <td>{clasDetails.subjects ? clasDetails.subjects.join(", ") : "No Subjects Available"}</td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        ) : (
                                          <p>No class details available</p>
                                        )}
                                      </ModalBody>
                                    </Modal>

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
                                          ? "Edit Class"
                                          : "Add Class"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            clas_id: (clas && clas.id) || "",
                                            name: (clas && clas.name) || "",
                                            monthly_fee:
                                              (clas && clas.monthly_fee) || "",
                                            teacher:
                                              (clas && clas.teacher) || "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            monthly_fee: Yup.number()
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
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateClass = {
                                                id: clas.id,
                                                name: values.name,
                                                teacher: values.teacher,
                                                monthly_fee: values.monthly_fee,
                                              };

                                              // Update Employee
                                              onUpdateEmployee(
                                                updateClass,
                                                this.state.user_id
                                              );

                                              setTimeout(() => {
                                                onGetClasses(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            } else {
                                            }

                                            this.setState({
                                              selectedClass: null,
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
                                                      Class Name
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
                                                      Monthly Salary
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="monthly_fee"
                                                      type="number"
                                                      className={
                                                        "form-control" +
                                                        (errors.monthly_fee &&
                                                          touched.monthly_fee
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="monthly_fee"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <label
                                                      htmlFor="teacher"
                                                      className="form-label"
                                                    >
                                                      Teacher
                                                    </label>
                                                    <Field
                                                      name="teacher"
                                                      as="select"
                                                      className="form-control"
                                                    >
                                                      <option value="">
                                                        Select Teacher
                                                      </option>
                                                      {this.props.teachersList.map(
                                                        teacher => (
                                                          <option
                                                            key={teacher.id}
                                                            value={teacher.id}
                                                          >
                                                            {teacher.name}
                                                          </option>
                                                        )
                                                      )}
                                                    </Field>
                                                    <ErrorMessage
                                                      name="teacher"
                                                      component="div"
                                                      className="text-danger"
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
                                                        !this.state.clas.id
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

ClassesList.propTypes = {
  match: PropTypes.object,
  classes: PropTypes.array,
  className: PropTypes.any,
  onGetClasses: PropTypes.func,
  onDeleteEmployee: PropTypes.func,
  onUpdateEmployee: PropTypes.func,
  teachersList: PropTypes.array.isRequired,
  onGetTeachersList: PropTypes.func.isRequired,
};

// const mapStateToProps = ({ classes }) => ({
//   classes: classes.classes,
// });
const mapStateToProps = state => ({
  classes: state.classes.classes,
  teachersList: state.teachers.teachersList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetClasses: id => dispatch(getClasses(id)),
  onUpdateEmployee: clas => dispatch(updateClass(clas)),
  onDeleteEmployee: clas => dispatch(deleteClass(clas)),
  onGetTeachersList: id => dispatch(getTeachersList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ClassesList));
