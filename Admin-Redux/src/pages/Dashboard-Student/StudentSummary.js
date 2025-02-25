import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import profileImg from "../../assets/images/profile-img.png";

// actions
import { getStudentProfile } from "../../store/auth/studentprofile/actions";

class StudentSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      student_name: "",
      email: "",
      picture: "",
      completedAppointments: "",
      inProcessAppointments: "",
      monthlyRevenue: "",
      annualRevenue: "",
      inProcessAppointments: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    console.log("USERRRRRR29",JSON.parse(localStorage.getItem("authUser")).account_type, JSON.parse(localStorage.getItem("authUser")).type)
    this.props.getStudentProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        student_name: this.props.success.student_name,
        email: this.props.success.email,
        picture: process.env.REACT_APP_BACKENDURL + this.props.success.picture,
        // completedAppointments: this.props.success.completed_appointments,
        // inProcessAppointments: this.props.success.inprocess_appointments,
        // monthlyRevenue: this.props.success.monthly_revenue,
        // annualRevenue: this.props.success.annual_revenue,
      });
    }, 1500);
  }

  render() {
    return (
      <React.Fragment>
        {/* Welcome profile */}
        <Col xl="4">
          <Card className="overflow-hidden">
            <div className="bg-primary bg-soft">
              <Row>
                <Col xs="7">
                  <div className="text-primary p-3">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p>School Management System Dashboard</p>
                    <Link
                            to={"/lab-profile"}
                            className="btn btn-primary btn-sm"
                          >
                            View Profile{" "}
                            <i className="mdi mdi-arrow-right ms-1" />
                          </Link>
                  </div>
                </Col>
                <Col xs="5" className="align-self-end">
                  <img src={profileImg} alt="" className="img-fluid" />
                </Col>
              </Row>
            </div>
            <CardBody>

                    <Row className="pt-2">
                      <Col xs="4">
                      <div className="avatar-md profile-user-wid">
                  <img
                    src={this.state.picture}
                    alt="Logo"
                    className="text-end"
                    style={{ maxWidth: '100%', maxHeight: '100%', float: 'end' }}                  />
                </div>
                        
                      </Col>
                      <Col xs="8">
                      <h5 className="font-size-15 text-truncate">
                          {this.state.student_name}
                        </h5>
                        <p className="text-muted mb-0 text-truncate">
                          {this.state.email}
                        </p>
                      </Col>
                    </Row>
                  
            </CardBody>
          </Card>
        </Col>

        {/* Revenue and Appointment Details */}
        <Col xl="8">
          <Row>
            <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Appointments Completed
                      </p>
                      <h4 className="mb-0">
                        {this.state.completedAppointments}
                      </h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-list-check font-size-24"} />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Appointments Inprocess
                      </p>
                      <h4 className="mb-0">
                        {this.state.inProcessAppointments}
                      </h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-copy-alt font-size-24"} />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                      Appointments History
                      </p>
                      <h4 className="mb-0">
                      Activity Log
                      </h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                    <Link
                             to={
                              this.state.uuid
                                ? `/activity-log/${this.state.uuid}`
                                : `/activity-log`
                            }
                            // className="btn btn-primary btn-sm"
                          >
                        <span className="avatar-title">
                        <i className={"bx bx-history font-size-24"} />
                      </span>                        </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                      Labs Review
                      </p>
                      <h4 className="mb-0">
                      Audit
                      </h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                    <Link
                             to={
                              this.state.uuid
                                ? `/lab-audit/${this.state.uuid}`
                                : `/lab-audit`
                            }
                            // className="btn btn-primary btn-sm"
                          >
                        <span className="avatar-title">
                        <i className={"mdi mdi-note-search font-size-24"} />
                      </span>                        </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </React.Fragment>
    );
  }
}

StudentSummary.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getStudentProfile: PropTypes.func,
};

const mapStateToProps = state => ({
  success: state.studentProfile.success,
  error: state.studentProfile.error,
});

export default withRouter(
  connect(mapStateToProps, { getStudentProfile })(withTranslation()(StudentSummary))
);
