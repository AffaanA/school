import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
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

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import { getSchoolSubjects, updateSchoolSubjects, getClassesList , deleteSchoolSubjects} from "../../store/actions";
import { isEmpty, size } from "lodash";
import "../../assets/scss/table.scss";

class schoolSubjectsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      schoolSubjects: [],
      schoolSubject: "",
      type: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      schoolSubjectListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, schoolSubject) => <>{schoolSubject.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
        },
        {
            dataField: "class_name",
            text: "Class",
            sort: true,
          },
        {
          dataField: "exam_marks",
          text: "Exam Marks",
          sort: true,
          formatter: (cellContent, schoolSubject) => (
            <>
              {
                <span>
                  {schoolSubject.exam_marks
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
          formatter: (cellContent, schoolSubject) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEmployeeClick(schoolSubject)}
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(schoolSubject)}
                ></i>
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
  }
componentDidMount() {
    const { onGetschoolSubjects,schoolSubjects } = this.props;
    onGetschoolSubjects(this.state.user_id);
    this.setState({ schoolSubjects });
    const { onGetClassesList,classes } = this.props;
    onGetClassesList(this.state.user_id);
    this.setState({ classes });
  }

  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  handleEmployeeClicks = () => {
    this.setState({ schoolSubject: "", isEdit: false, schoolSubject_id: "" });
    this.toggle();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { schoolSubjects } = this.props;
    if (!isEmpty(schoolSubjects) && size(prevProps.schoolSubjects) !== size(schoolSubjects)) {
      console.log("Updated school subjects:", schoolSubjects);
      this.setState({ schoolSubjects: {}, isEdit: false });
    }
  }

  onPaginationPageChange = (page) => {
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

  toggleDeleteModal = () => {
    this.setState((prevState) => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = (schoolSubject) => {
    this.setState({ schoolSubject: schoolSubject });
    this.setState({ deleteModal: true });
  };

  handleDeleteEmployee = () => {
    const { onDeleteSchoolSubjects, onGetschoolSubjects } = this.props;
    const { schoolSubject } = this.state;
    if (schoolSubject.id !== undefined) {
        onDeleteSchoolSubjects(schoolSubject);
      setTimeout(() => {
        onGetschoolSubjects(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleEmployeeClick = (arg) => {
    const schoolSubject = arg;
    this.setState({
      schoolSubject_id: schoolSubject.id,
      schoolSubject: {
        id: schoolSubject.id,
        name: schoolSubject.name,
        exam_marks: schoolSubject.exam_marks,
        class_id: schoolSubject.class_id,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;
    const { classesList } = this.props;
    const { schoolSubjects } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onUpdateSchoolSubjects,
      onGetschoolSubjects,
      onGetClassesList,
    } = this.props;
    const schoolSubject = this.state.schoolSubject;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: schoolSubjects.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteEmployee}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>schoolSubjects List | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="schoolSubjects List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.schoolSubjectListColumns}
                      data={schoolSubjects}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.schoolSubjectListColumns}
                          data={schoolSubjects}
                          search
                        >
                          {(toolkitprops) => (
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

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Subjects"
                                          : "Add Offered Test"}
                                      </ModalHeader>
                                      <ModalBody>
  <Formik
    enableReinitialize={true}
    initialValues={{
      schoolSubject_id: schoolSubject ? schoolSubject.id : "",
      name: schoolSubject ? schoolSubject.name : "",
      exam_marks: schoolSubject ? schoolSubject.exam_marks : "",
      class_id: schoolSubject ? schoolSubject.class_id : "",
    }}
    validationSchema={Yup.object().shape({
      name: Yup.string().required("Name is required"),
      exam_marks: Yup.number().required("Exam marks are required").positive("Exam marks must be positive"),
      class_id: Yup.string().required("Class is required"),
    })}
    onSubmit={(values) => {
      if (isEdit) {
        const updateSubjectData = {
          id: values.schoolSubject_id,
          name: values.name,
          exam_marks: values.exam_marks,
          class_id: values.class_id,
        };

        console.log("onUpdateSchoolSubjects",onUpdateSchoolSubjects(updateSubjectData, this.state.user_id));
        setTimeout(() => {
            onGetschoolSubjects(
              this.state.user_id
            );
          }, 1000);
          this.toggle();
      } else {
      }
    }}
  >
    {({
      handleSubmit,
      setFieldValue,
      values,
      isValid,
      dirty,
    }) => (
      <Form onSubmit={handleSubmit} className="custom-validation">
        <Row>
          <Col className="col-12">
            <div className="mb-3">
              <Label className="form-label">Name</Label>
              <Field
                name="name"
                type="text"
                className="form-control"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="invalid-feedback d-block"
              />
            </div>
            <div className="mb-3">
              <Label className="form-label">Exam Marks</Label>
              <Field
                name="exam_marks"
                type="number" // Ensure this is set to "number"
                className="form-control"
              />
              <ErrorMessage
                name="exam_marks"
                component="div"
                className="invalid-feedback d-block"
              />
            </div>
            <div className="mb-3">
              <Label className="form-label">Class</Label>
              <Field
                name="class_id"
                as="select"
                className="form-control"
                onChange={(e) => setFieldValue("class_id", e.target.value)}
                value={values.class_id} // Ensure that the value is set
              >
                <option value="">Select Class</option>
                {classesList.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="class_id" component="div" className="text-danger" />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-end">
              <Button
                type="submit"
                color="primary"
                className="submit-btn"
              >
                Submit
              </Button>
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
                                <Col lg="2"></Col>
                              </Row>
                              <Row>
                                <Col lg="12">
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

schoolSubjectsList.propTypes = {
  schoolSubjects: PropTypes.array,
  onGetschoolSubjects: PropTypes.func,
  classesList: PropTypes.array.isRequired,
  onGetClassesList: PropTypes.func,
  onDeleteSchoolSubjects : PropTypes.func,
  onUpdateSchoolSubjects : PropTypes.func,
};
const mapStateToProps = (state) => ({
    schoolSubjects: state.schoolSubjects.schoolSubjects,
    classesList: state.classeslist.classesList,
  });

const mapDispatchToProps = (dispatch) => ({
  onGetschoolSubjects: (id) => dispatch(getSchoolSubjects(id)),
    onUpdateSchoolSubjects : (schoolSubject, id) => dispatch(updateSchoolSubjects(schoolSubject,id)),
    onDeleteSchoolSubjects : (schoolSubject) => dispatch(deleteSchoolSubjects(schoolSubject)),
  onGetClassesList: id => dispatch(getClassesList(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(schoolSubjectsList));
