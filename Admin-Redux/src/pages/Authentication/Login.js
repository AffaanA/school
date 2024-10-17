import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Alert, Col, Container, Row, Label } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// actions
import { apiError, loginUser } from "../../store/actions";

// import images
import CarouselPage from "../AuthenticationInner/CarouselPage";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    // Removing attributes from the body
    const elem = document.getElementsByTagName("body")[0];
    while (elem.attributes.length > 0) {
      elem.removeAttribute(elem.attributes[0].name);
    }
    if (localStorage.getItem("authUser")) {
      this.props.history.push("/logout");
    }
    this.props.apiError("");
  }

  removeAttributes(element, ...attrs) {
    attrs.forEach(attr => element.removeAttribute(attr));
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


  render() {
    const isLargeScreen = window.innerWidth > 470;
    return (
      <React.Fragment>
        <div>
          <HelmetProvider>
            <Helmet>
            <title>Login | School Management System</title>
            </Helmet>
          </HelmetProvider>
          <Container fluid className="p-0">
            <Row className="g-0">
              <CarouselPage />
              <Col md={6} lg={6} xl={6}>
                <div className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="my-auto">
                        <div>
                          <h5 className="text-primary">Welcome Back!</h5>
                          <p className="text-muted">
                            Sign in to continue to School Management System
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.error && this.props.error && (
                            <Alert color="danger">{this.props.error}</Alert>
                          )}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              username:
                                (this.state && this.state.username) || "",
                              password:
                                (this.state && this.state.password) || "",
                            }
                            }
                            validationSchema={Yup.object().shape({
                              username: Yup.string().required(
                                "Please enter your username or email"
                              ),
                              password: Yup.string().required(
                                "Please enter your password"
                              ),
                            })}
                            onSubmit={values => {
                              this.props.loginUser(values, this.props.history);
                              console.log("page: ", values);
                              setTimeout(() => {
                                console.log(values);
                                const success = this.props.success;
                                console.log("successsuccess", success);
                                if (success && success.type === "School") {
                                  this.props.history.push(`/dashboard`);
                                } else if (success && success.type === "Student") {
                                  this.props.history.push(`/dashboard-student`);
                                }
                              }, 1000);
                            }}
                            
                          >
                            {({ errors, status, touched }) => (
                              <Form className="form-horizontal">
                                <div className="mb-3">
                                  <Label for="username" className="form-label">
                                    Username or Email
                                  </Label>
                                  <Field
                                    name="username"
                                    type="text"
                                    className={
                                      "form-control" +
                                      (errors.username && touched.username
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                <div className="mb-3">
                                  <Label for="password" className="form-label">
                                    Password
                                  </Label>
                                  <div className="input-group auth-pass-inputgroup">
                                    <Field
                                      name="password"
                                      type="password"
                                      autoComplete="true"
                                      className={
                                        "form-control" +
                                        (errors.password && touched.password ? " is-invalid" : "")
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
                                </div>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="customControlInline"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="customControlInline"
                                  >
                                    Remember me
                                  </label>
                                </div>

                                <div className="mt-3 d-grid">
                                  <button
                                    className="btn btn-primary btn-block"
                                    type="submit"
                                  >
                                    Log In
                                  </button>
                                </div>

                                <div className="mt-4 text-center">
                                  <Link
                                    to="/forgot-password"
                                    className="text-muted"
                                  >
                                    <i className="mdi mdi-lock me-1" /> Forgot
                                    your password?
                                  </Link>
                                </div>

                                <div className="mt-3 text-center">
                                  <p>
                                    Do not have an account?{" "}
                                    <Link
                                      // to={{ pathname: "/register" }}
                                      to={
                                        this.props.match.params.uuid
                                          ? `/register/${this.props.match.params.uuid}`
                                          : `/register`
                                      }
                                      className="fw-medium text-primary"
                                    >
                                      {" "}
                                      Register
                                    </Link>{" "}
                                  </p>
                                </div>
                              </Form>
                            )}
                          </Formik>
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

Login.propTypes = {
  match: PropTypes.object,
  apiError: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.Login;
  console.log('mapStateToProps', { error, success }); // Debugging
  return { error, success };
};


export default withRouter(
  connect(mapStateToProps, { loginUser, apiError })(Login)
);
