import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, Container, Row, Label, Alert } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { FaUserShield, FaUser, FaUserGraduate } from "react-icons/fa"; // Import icons from react-icons

// action
import {
  apiError,
  registerUser,
  registerUserFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailFieldError: null,
      passwordFieldError: null,
      incompleteRegistrationError: null,
      submittedMessage: null,
    };
  }

  componentDidMount() {
    console.log("uuid", this.props.match.params.uuid)
    // Removing attributes from the body
    const elem = document.getElementsByTagName("body")[0];
    while (elem.attributes.length > 0) {
      elem.removeAttribute(elem.attributes[0].name);
    }

    this.props.apiError("");
    this.props.registerUserFailed("");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.emailError != this.props.emailError) {
      this.setState({ emailFieldError: this.props.emailError });
    }

    if (prevProps.passwordError != this.props.passwordError) {
      this.setState({ passwordFieldError: this.props.passwordError });
    }

    if (
      prevProps.incompleteRegistrationError !=
      this.props.incompleteRegistrationError
    ) {
      this.setState({
        incompleteRegistrationError: this.props.incompleteRegistrationError,
      });
    }
  }

  togglePasswordVisibility = () => {
    const passwordInput = document.querySelector('input[name="password"]');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.className = 'mdi mdi-eye-off-outline';
    } else if (passwordInput) {
      passwordInput.type = 'password';
      eyeIcon.className = 'mdi mdi-eye-outline';
    }
  };
  togglePassword2Visibility = () => {
    const passwordInput = document.querySelector('input[name="password2"]');
    const eyeIcon2 = document.getElementById('eye-icon2');

    if (passwordInput && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon2.className = 'mdi mdi-eye-off-outline';
    } else if (passwordInput) {
      passwordInput.type = 'password';
      eyeIcon2.className = 'mdi mdi-eye-outline';
    }
  };

  render() {
    const isLargeScreen = window.innerWidth > 470;
    if (this.props.userID) {
      if (this.props.userAccountType == "patient") {
        if (!this.props.match.params.uuid) {
          return (
            <Redirect
              to={{
                pathname: "/patient-information/" + this.props.userID,
                state: { redirectState: null }, // sending state so that lab page doesn't redirect back to register
              }}
            />
          );
        } else {
          return (
            <Redirect
              to={{
                pathname:
                  "/patient-information/" +
                  this.props.userID +
                  "/" +
                  this.props.match.params.uuid,
                state: { redirectState: null }, // sending state so that lab page doesn't redirect back to register
              }}
            />
          );
        }
      } else if (this.props.userAccountType == "labowner") {
        return (
          <Redirect
            to={{
              pathname: "/lab-information/" + this.props.userID,
              state: { redirectState: null }, // sending state so that lab page doesn't redirect back to register
            }}
          />
        );
      } else if (this.props.userAccountType == "corporate") {
        return (
          <Redirect
            to={{
              pathname: "/corporate-information/" + this.props.userID,
              state: { redirectState: null }, // sending state so that corporate page doesn't redirect back to register
            }}
          />
        );
      } else if (this.props.userAccountType == "b2bclient") {
        return (
          <Redirect
            to={{
              pathname: "/b2bclient-information/" + this.props.userID,
              state: { redirectState: null }, // sending state so that corporate page doesn't redirect back to register
            }}
          />
        );
      }
      else if (this.props.userAccountType == "donor") {
        return (
          <Redirect
            to={{
              pathname: "/donor-information/" + this.props.userID,
              state: { redirectState: null }, // sending state so that corporate page doesn't redirect back to register
            }}
          />
        );
      }
    }

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Register | Lab Hazir</title>
          </MetaTags>
          <Container fluid className="p-0">
            <Row className="g-0">
              <CarouselPage />

              <Col md={6} lg={6} xl={6}>
                <div className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="my-auto">
                        <div>
                          <h5 className="text-primary">
                            Register account
                          </h5>
                        </div>

                        {/* To show submitted message of processing if submission is succesful */}
                        <div className="mt-4">
                          {this.state.submittedMessage && (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              {this.state.submittedMessage}
                            </Alert>
                          )}

                          {/* To show incomplete registration error to inform user */}
                          {this.state.incompleteRegistrationError && (
                            <div>
                              <Alert
                                color="danger"
                                style={{ marginTop: "13px" }}
                              >
                                Your registration process was{" "}
                                <strong>
                                  incomplete last time when you registered
                                </strong>
                                . If you want to
                                regispatient-information/113893749834ter now,
                                please click on <strong>Next</strong> button
                                once again.
                              </Alert>
                              <Alert color="info" style={{ marginTop: "13px" }}>
                                After completing the step 2 of registration,
                                please make sure to{" "}
                                <strong>
                                  verify your account on new verification email
                                </strong>{" "}
                                you will receive from us and{" "}
                                <strong>ignore the old one</strong> (if any) you
                                have received last time.
                              </Alert>
                            </div>
                          )}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                               email: (this.state && this.state.email) || "",
                              password:
                                (this.state && this.state.password) || "",
                              password2:
                                (this.state && this.state.password2) || "",
                              type: (this.state && this.state.type) || "", // Add this line

                            }}
                            validationSchema={Yup.object().shape({
                              email: Yup.string()
                                .required("Please enter your email")
                                .email("Please enter valid email"),
                              password: Yup.string().required(
                                "Please enter your password"
                              ),
                              password2: Yup.string()
                                .required("Please re-enter your password")
                                .when("password", {
                                  is: val =>
                                    val && val.length > 0 ? true : false,
                                  then: Yup.string().oneOf(
                                    [Yup.ref("password")],
                                    "Both password need to be the same"
                                  ),
                                }),
                                type: Yup.string().required(
                                  "Please Select Account Type"
                                ),
                            })}
                            onSubmit={values => {
                              const accountTypeMap = {
                                ADMIN: 2,
                                TEACHER: 3,
                                STUDENT: 4,
                              };
                              const accountTypeNumber = accountTypeMap[values.type] || 0;
                            
                              this.props.registerUser({
                                ...values,
                                type: accountTypeNumber,
                              });
                            
                              // Scroll to top
                              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                            
                              // Wait for the registration process to complete
                              setTimeout(() => {
                                // Check if there are no errors
                                if (
                                  !this.state.passwordFieldError &&
                                  !this.state.emailFieldError &&
                                  !this.state.incompleteRegistrationError
                                ) {
                                  // Set the success message
                                  this.setState({
                                    submittedMessage:
                                      "You are Registered Successfully. Please login to your account.",
                                  });
                            
                                  // Show the success message for 2 seconds
                                  setTimeout(() => {
                                    // Redirect to the login page after 2 seconds
                                    this.props.history.push("/login");
                                  }, 2000); // 2 seconds delay
                                }
                              }, 1000); // Delay to ensure registration process is complete
                            }}
                            
                          >
                            {({ errors, status, touched, 
                          values,
                          setFieldValue, }) => (
                              <Form className="form-horizontal">
<div className="mb-3">
                              <Label className="form-label">Account Type</Label>
                              <div
                                className="form-group has-text-centered"
                                style={{ color: "gray" }}
                              >
                                <b>I am</b>
                                <br />
                                <div data-toggle="buttons" className="mt-10">
                                  <label className="btn btn-light">
                                    <Field
                                      type="radio"
                                      name="type"
                                      value="ADMIN"
                                      onChange={() =>
                                        setFieldValue("type", "ADMIN")
                                      }
                                      checked={values.type === "ADMIN"}
                                      as="input"
                                    />
                                    <FaUserShield
                                      style={{ fontSize: "35px" }}
                                    />
                                    <br /> Admin
                                  </label>
                                  <label className="btn btn-light">
                                    <Field
                                      type="radio"
                                      name="type"
                                      value="EMP"
                                      onChange={() =>
                                        setFieldValue("type", "TEACHER")
                                      }
                                      checked={values.type === "TEACHER"}
                                      as="input"
                                    />
                                    <FaUser style={{ fontSize: "35px" }} />
                                    <br /> Teacher
                                  </label>
                                  <label className="btn btn-light">
                                    <Field
                                      type="radio"
                                      name="type"
                                      value="STUDENT"
                                      onChange={() =>
                                        setFieldValue("type", "STUDENT")
                                      }
                                      checked={values.type === "STUDENT"}
                                      as="input"
                                    />
                                    <FaUserGraduate
                                      style={{ fontSize: "35px" }}
                                    />
                                    <br /> Student
                                  </label>
                                </div>
                              </div>
                            </div>  

                                {/* Email field */}
                                <div className="mb-3">
                                  <Label for="email" className="form-label">
                                    Email
                                  </Label>
                                  <Field
                                    name="email"
                                    placeholder="Enter email"
                                    type="text"
                                    onFocus={() => {
                                      this.setState({ emailFieldError: null });
                                    }}
                                    className={
                                      "form-control" +
                                      ((errors.email && touched.email) ||
                                      this.state.emailFieldError
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="invalid-feedback"
                                  />

                                  <div className="invalid-feedback">
                                    {this.state.emailFieldError}
                                  </div>
                                </div>

                                {/* Password field */}

                                <div className="mb-3">
                                  <Label className="form-label">Password</Label>
                                  <div>
                                    <div className="input-group auth-pass-inputgroup">
                                      <Field
                                        name="password"
                                        type="password"
                                        placeholder="Enter password"
                                        autoComplete="on"
                                        onFocus={() => {
                                          this.setState({
                                            passwordFieldError: null,
                                          });
                                        }}
                                        className={
                                          "form-control" +
                                          ((errors.password && touched.password) || this.state.passwordFieldError
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <button
                                        className="btn btn-light"
                                        type="button"
                                        id="password-addon"
                                        onClick={this.togglePasswordVisibility}
                                      >
                                        <i id="eye-icon" className="mdi mdi-eye-outline"></i>
                                      </button>
                                    </div>
                                    <ErrorMessage
                                      name="password"
                                      component="div"
                                      className="invalid-feedback"
                                    />

                                    <div className="invalid-feedback">
                                      {this.state.passwordFieldError}
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <div className="input-group auth-pass-inputgroup">
                                      <Field
                                        name="password2"
                                        type="password"
                                        placeholder="Re-enter password"
                                        autoComplete="on"
                                        className={
                                          "form-control" +
                                          (errors.password2 && touched.password2 ? " is-invalid" : "")
                                        }
                                      />
                                      <button
                                        className="btn btn-light"
                                        type="button"
                                        id="password2-addon" // Unique ID for the eye icon of password2
                                        onClick={this.togglePassword2Visibility} // Updated function name
                                      >
                                        <i id="eye-icon2" className="mdi mdi-eye-outline"></i> {/* Updated ID for the eye icon */}
                                      </button>
                                    </div>
                                    <ErrorMessage
                                      name="password2"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                </div>

                                <div className="mt-3 d-grid">
                                  <button
                                    className="btn btn-primary btn-block"
                                    type="submit"
                                    disabled={this.state.submittedMessage}
                                  >
                                    {" "}
                                    Register{" "}
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                          <div className="mt-3 text-center">
                            <p>
                              Already have an account?{" "}
                              <Link
                                // to={{ pathname: "/login" }}
                                to={
                                  this.props.match.params.uuid
                                    ? `/login/${this.props.match.params.uuid}`
                                    : `/login`
                                }
                                className="fw-medium text-primary"
                              >
                                {" "}
                                Login
                              </Link>{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  match: PropTypes.object,
  apiError: PropTypes.any,
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.any,
  emailError: PropTypes.any,
  passwordError: PropTypes.any,
  incompleteRegistrationError: PropTypes.any,
  userID: PropTypes.any,
  userAccountType: PropTypes.any,
};

const mapStateToProps = state => {
  const {
    userID,
    userAccountType,
    emailError,
    passwordError,
    incompleteRegistrationError,
    loading,
  } = state.Account;
  return {
    userID,
    userAccountType,
    emailError,
    passwordError,
    incompleteRegistrationError,
    loading,
  };
};

export default connect(mapStateToProps, {
  registerUser,
  apiError,
  registerUserFailed,
})(Register);
