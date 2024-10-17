import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import { isEmpty } from "lodash";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getDefaultersList, updateDefaultersList } from "../../store/defaulters-list/actions";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for toasts

class Defaulters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      modal: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { ongetDefaultersList } = this.props;
    const { user_id } = this.state;
    ongetDefaultersList(user_id);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  componentDidUpdate(prevProps) {
    // Check for success or failure in updateDefaultersList action
    if (prevProps.updateSuccess !== this.props.updateSuccess && this.props.updateSuccess) {
      toast.success("Balance updated and list cleared successfully");
    }

    if (prevProps.updateError !== this.props.updateError && this.props.updateError) {
      toast.error("Failed to update balance or clear list");
    }
  }

  handleCardClick = () => {
    console.log("i am clicked");
    
    const { onupdateDefaultersList } = this.props;
    const { user_id } = this.state;
    
    onupdateDefaultersList({ user_id }); // Dispatch the update action
  };

  render() {
    const { defaulters } = this.props;
    
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Defaulters List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Defaulters" breadcrumbItem="Defaulters List" />{" "}
            <Row>
              <div className="text-end">
                <Button
                  className="button-grade"
                  type="button"
                  style={{
                    fontSize: "16px",
                    padding: "5px 10px",
                    marginRight: "50px",
                  }}
                >
                  Send Reminder
                </Button>
              </div>
              <Row>
                {!isEmpty(this.props.defaulters) &&
                  this.props.defaulters.map((defaulter, key) => (
                    <Col xl="2" sm="4" lg="2" key={"_col_" + key}>
                      <Card style={{ padding: "10px" }}>
                        <CardBody>
                          {defaulter.picture && (
                            <div className="product-img position-relative">
                              <img
                                src={
                                  process.env.REACT_APP_BACKENDURL +
                                  defaulter.picture
                                }
                                alt="Fee Defaulter Photo"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                                className="img-fluid mx-auto d-block"
                              />
                            </div>
                          )}

                          <div className="mt-2 text-center">
                            <h6
                              className="mb-1 text-truncate"
                              style={{ fontSize: "14px" }}
                            >
                              {defaulter.student_name}
                            </h6>
                            <p
                              className="text-truncate"
                              style={{ fontSize: "12px" }}
                            >
                              {defaulter.email}
                            </p>
                            <p className="" style={{ fontSize: "12px" }}>
                              {defaulter.fee_challans
                                .map(challan => challan.month)
                                .join(", ")}
                            </p>
                          </div>

                          <div className="btn-container-save">
                            <Link
                              to="/collect-fee"
                              className="button-grade"
                              style={{
                                fontSize: "12px",
                                padding: "5px 10px",
                                textDecoration: "none",
                              }}
                            >
                              Submit Fee
                            </Link>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                <Col xl="2" sm="4" lg="2">
                  <Card
                    style={{
                      padding: "10px",
                      background: "linear-gradient(45deg, #4b49ac, #5d5ba9)", // Apply gradient
                      color: "white", // Set text color to white
                    }}
                  >
                    <CardBody  onClick={() => this.handleCardClick()}> {/* Trigger update */}
                      <div className="mt-2 text-center">
                        <h6
                          className="mb-1"
                          style={{ fontSize: "16px", color: "white" }} // White text color
                        >
                          Add Balance<br></br> in Accounts <br></br>
                          <br></br> And <br></br>
                          <br></br> Clear List <br></br>
                          <i
                            className="bx bx-download"
                            style={{ fontSize: "20px" }}
                          ></i>
                        </h6>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                {isEmpty(this.props.defaulters) && (
                  <Row>
                    <Col lg="12">
                      <div className=" mb-5">
                        <h4 className="text-uppercase">
                          Sorry, no result found.
                        </h4>
                      </div>
                    </Col>
                  </Row>
                )}
              </Row>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

Defaulters.propTypes = {
  defaulters: PropTypes.array,
  ongetDefaultersList: PropTypes.func,
  onupdateDefaultersList: PropTypes.func,
  updateSuccess: PropTypes.bool,   // Prop for success status
  updateError: PropTypes.string,   // Prop for error status
};

const mapStateToProps = ({ defaulterslist }) => ({
  defaulters: defaulterslist.defaultersList,
  updateSuccess: defaulterslist.updateSuccess,
  updateError: defaulterslist.updateError,
});

const mapDispatchToProps = dispatch => ({
  ongetDefaultersList: user_id => {
    console.log("Dispatching getDefaultersList with user_id:", user_id);
    dispatch(getDefaultersList(user_id));
  },
  onupdateDefaultersList: user_id => {
    console.log("Dispatching updateDefaultersList with user_id:", user_id);
    dispatch(updateDefaultersList(user_id));
  }
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Defaulters));
