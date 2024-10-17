import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addNewBank, getBanks, updateBank, deleteBank, clearErrorMsg, clearSuccessMsg} from '../../store/banks/actions'; // Adjust the import path as needed
import MetaTags from 'react-meta-tags';
import { Button, Card, CardBody, Col, Container, Row, Input, Modal, ModalBody, ModalFooter, ModalHeader,Label } from "reactstrap";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import PropTypes from 'prop-types';
import { withRouter, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import DeleteModal from "../../components/Common/DeleteModal";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { isEmpty, size } from "lodash";
import "../../assets/scss/table.scss";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
class AddBankPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        banks: [],
        bank: "",
        type: "",
        modal: false,
        deleteModal: false,
        user_id: localStorage.getItem("authUser")
          ? JSON.parse(localStorage.getItem("authUser")).user_id
          : "",
        bankListColumns: [
          {
            text: "id",
            dataField: "id",
            sort: true,
            hidden: true,
            formatter: (cellContent, bank) => <>{bank.id}</>,
          },
          {
            dataField: "name",
            text: "Name",
            sort: true,
          },
          {
            dataField: "account_no",
            text: "Account No",
            sort: true,
          },
          {
            dataField: "branch_address",
            text: "Branch Address",
            sort: true,
          },
          {
            dataField: "menu",
            isDummyField: true,
            editable: false,
            text: "Action",
            formatter: (cellContent, bank) => (
              <div className="d-flex gap-3">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.handleBankClick(bank)}
                  ></i>
                </Link>
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(bank)}
                  ></i>
                </Link>
              </div>
            ),
          },
        ],
      };
      this.handleBankClick = this.handleBankClick.bind(this);
      this.toggle = this.toggle.bind(this);
      this.handleBankClicks = this.handleBankClicks.bind(this);
      this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { ongetBanks, banks } = this.props;
    if (banks && !banks.length) {
        ongetBanks(this.state.user_id);
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ bank: selectedGroup.value });
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
  handleBankClicks = () => {
    this.setState({ bank: "", isEdit: false, bank_id: "" });
    this.toggle();
  };


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

  onClickDelete = banks => {
    this.setState({ banks: banks });
    this.setState({ deleteModal: true });
  };

  handleDeleteBank = () => {
    const { onDeleteBank, ongetBanks } = this.props;
    const { banks } = this.state;
    if (banks.id !== undefined) {
      onDeleteBank(banks);
      setTimeout(() => {
        ongetBanks(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleBankClick = arg => {
    const bank = arg;
    this.setState({
      bank_id: bank.id,
      bank: {
        id: bank.id,
        name: bank.name,
        account_no: bank.account_no,
        branch_address: bank.branch_address,
      },
      isEdit: true,
    });

    this.toggle();
  };
  handleAlertButtonClick() {
    this.props.history.push('/add-banks');
  }

  handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("handle submit is called", values)
    const { addNewBank } = this.props;
    const { user_id } = this.state;

    addNewBank(values, user_id);
    setSubmitting(false);
    resetForm();
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { banks } = this.props;
    console.log('Previous Props:', prevProps);
    console.log('Current Props:', this.props);
    if (!isEmpty(banks) && size(prevProps.banks) !== size(banks)) {
      this.setState({ banks: {}, isEdit: false });
    }
    if (this.props.successMessage && this.props.successMessage !== prevProps.successMessage) {
      toast.success(this.props.successMessage);
      this.props.clearSuccessMsg();
    }
    if (this.props.errorMessage && this.props.errorMessage !== prevProps.errorMessage) {
      toast.error(this.props.errorMessage);
      this.props.clearErrorMsg();
    }
  }

  render() {
    const initialValues = {
      name: '',
      branch_address: '',
      account_no: '',
    };

    const validationSchema = Yup.object({
      name: Yup.string().required('Bank name is required'),
      branch_address: Yup.string().required('Branch address is required'),
      account_no: Yup.number().required('Account number is required').positive(),
    });

    const { banks } = this.props;
    const { SearchBar } = Search;
    const { isEdit, deleteModal } = this.state;

    const { onUpdateBank, ongetBanks } = this.props;
    const bank = this.state.bank;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: banks.length, // replace later with size(banks),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteBank}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Add Bank | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Add Bank" />
            <Row>
              <Col md={4}>
                <Card>
                  <CardBody>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={this.handleSubmit}
                    >
                                              {({ isSubmitting }) => (

                      <Form>
                        <div className="grade-row">
                          <Field name="name" placeholder="Bank Name" type="text" className="form-control" />
                          <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>

                        <div className="grade-row">
                          <Field name="branch_address" placeholder="Branch Address" type="text" className="form-control" />
                          <ErrorMessage name="branch_address" component="div" className="text-danger" />
                        </div>

                        <div className="grade-row">
                          <Field name="account_no" placeholder="Account Number" type="number" className="form-control" />
                          <ErrorMessage name="account_no" component="div" className="text-danger" />
                        </div>
                        <button type="submit" className="button-grade" disabled={isSubmitting}>Add Bank</button>
                      </Form>
                                              )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
              <Col md={8}>
              <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.bankListColumns}
                      data={banks}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.bankListColumns}
                          data={banks}
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
                                          ? "Edit Bank"
                                          : "Add Class"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            bank_id: (bank && bank.id) || "",
                                            name: (bank && bank.name) || "",
                                            account_no:
                                              (bank && bank.account_no) || "",
                                              branch_address:
                                              (bank && bank.branch_address) || "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            account_no: Yup.string()
                                              .required(
                                                "Please enter the Account Number"
                                              ),
                                              branch_address: Yup.string()
                                              .required(
                                                "Please enter the Branch Address"
                                              ),
                                              name: Yup.string()
                                              .required(
                                                "Please enter the Name"
                                              )
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateClass = {
                                                id: bank.id,
                                                name: values.name,
                                                account_no: values.account_no,
                                                branch_address: values.branch_address,
                                              };

                                              // Update Bank
                                              onUpdateBank(
                                                updateClass,
                                                this.state.user_id
                                              );

                                              setTimeout(() => {
                                                ongetBanks(
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
                                                      Bank Name
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
                                                      Branch Address
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="branch_address"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.branch_address &&
                                                        touched.branch_address
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="branch_address"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Account No
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="account_no"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.account_no &&
                                                        touched.account_no
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="account_no"
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
                                                        !this.state.bank.id
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

AddBankPage.propTypes = {
  addNewBank: PropTypes.func.isRequired,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  banks: PropTypes.array.isRequired,
  ongetBanks: PropTypes.func.isRequired,
  onUpdateBank: PropTypes.func,
  onDeleteBank: PropTypes.func,
};

const mapStateToProps = state => ({
  successMessage: state.banks.successMessage,
  errorMessage: state.banks.errorMessage,
  banks: state.banks.banks,
});

const mapDispatchToProps = dispatch => ({
  addNewBank: (bankData, id) => dispatch(addNewBank(bankData, id)),
  ongetBanks: id => dispatch(getBanks(id)),
  onUpdateBank: bank => dispatch(updateBank(bank)),
  onDeleteBank: bank => dispatch(deleteBank(bank)),
  clearSuccessMsg: () => dispatch(clearSuccessMsg()), // Add this
  clearErrorMsg: () => dispatch(clearErrorMsg()), 
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddBankPage));
