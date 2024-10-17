import React from 'react';
import ReactToPrint from 'react-to-print';
import PrintDoc from './PintDoc'; // Adjust the path as necessary
import { connect } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Card, CardBody, Col, Container, Row, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addNewChallan, getBanks, getStudentsList } from '../../store/actions'; // Adjust import paths

class AddChallanPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      banks: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      challandata: null
    };
    this.formikRef = React.createRef();
    this.componentRef2 = React.createRef(); // Ref for PrintDoc
    this.printButton = React.createRef(); // Ref for print trigger button
  }

  componentDidMount() {
    const { ongetBanks, getStudentsList } = this.props;
    const { user_id } = this.state;
    ongetBanks(user_id);
    getStudentsList(user_id);
  }

  handleSubmit = (values, { setSubmitting }) => {
    const { addNewChallan } = this.props;
    const { user_id } = this.state;

    addNewChallan(values, user_id);
    setSubmitting(false);
  };

  componentDidUpdate(prevProps) {
    const { successMessage, errorMessage, challans } = this.props;
    if (successMessage && successMessage !== prevProps.successMessage) {
      toast.success(successMessage);
      if (this.formikRef.current) {
        this.formikRef.current.resetForm();
      }
    }
    if (errorMessage && errorMessage !== prevProps.errorMessage) {
      toast.error(errorMessage);
    }
    if (challans !== prevProps.challans) {
      const validChallans = challans.filter(challan => challan !== undefined && challan !== null);
      if (validChallans.length > 0) {
        this.setState({ challandata: validChallans[validChallans.length - 1] }, () => {
          // Automatically trigger print
          if (this.printButton.current) {
            this.printButton.current.click();
          }
        });
      }
    }
  }

  render() {
    const { banks, studentsList } = this.props;
    const { challandata } = this.state;

    const initialValues = {
      month: new Date().toLocaleString("default", { month: "long" }) + " " + new Date().getFullYear(),
      due_date: "",
      bank: "",
      student: "",
      late_fine: 0,
    };

    const validationSchema = Yup.object({
      month: Yup.string().required("Month is required"),
      due_date: Yup.date().required("Due date is required"),
      bank: Yup.string().required("Bank is required"),
      student: Yup.string().required("Student is required"),
      late_fine: Yup.number().min(0, "Late fine must be positive").required("Late fine is required"),
    });

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Row className="justify-content-center">
              <Col md={10}>
                <Card>
                  <CardBody>
                    <Formik
                      innerRef={this.formikRef}
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={this.handleSubmit}
                    >
                      {({ setFieldValue, resetForm }) => (
                        <Form className="grade-form">
                          <h4 className="text-center">Fee Challan Form</h4>
                          <div className="grade-row">
                            <Label for="month">Month</Label>
                            <Field
                              type="text"
                              name="month"
                              id="month"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="month"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="grade-row">
                            <Label for="due_date">Due Date</Label>
                            <Field
                              type="date"
                              name="due_date"
                              id="due_date"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="due_date"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="grade-row">
                            <Label for="late_fine">Late Fine</Label>
                            <Field
                              type="number"
                              name="late_fine"
                              id="late_fine"
                              className="form-control"
                            />
                            <ErrorMessage
                              name="late_fine"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="grade-row">
                            <Field
                              as="select"
                              name="bank"
                              id="bank"
                              className="form-control grade-row-field"
                            >
                              <option value="">Select Bank</option>
                              {banks.map(bank => (
                                <option key={bank.id} value={bank.id}>
                                  {bank.name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="bank"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="grade-row">
                            <Field
                              as="select"
                              name="student"
                              id="student"
                              className="form-control grade-row-field"
                            >
                              <option value="">Select Student</option>
                              {studentsList.map(student => (
                                <option key={student.id} value={student.id}>
                                  {student.student_name}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="student"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          <div className="btn-container-save">
                            <Button className="button-grade" type="submit">
                              Save Changes
                            </Button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <div style={{ display: 'none' }}>
              <ReactToPrint
                trigger={() => <button ref={this.printButton} style={{ display: 'none' }} />}
                content={() => this.componentRef2.current}
              />
              <PrintDoc
                ref={this.componentRef2}
                challanData={challandata}
              />
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

AddChallanPage.propTypes = {
  addNewChallan: PropTypes.func.isRequired,
  ongetBanks: PropTypes.func.isRequired,
  getStudentsList: PropTypes.func.isRequired,
  banks: PropTypes.array.isRequired,
  challans: PropTypes.array,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  studentsList: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  banks: state.banks.banks,
  successMessage: state.challans.successMessage,
  errorMessage: state.challans.errorMessage,
  challans: state.challans.challans,
  studentsList: state.studentslist.studentsList,
});

const mapDispatchToProps = dispatch => ({
  addNewChallan: (challanData, id) => dispatch(addNewChallan(challanData, id)),
  ongetBanks: (id) => dispatch(getBanks(id)),
  getStudentsList: (id) => dispatch(getStudentsList(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddChallanPage));
