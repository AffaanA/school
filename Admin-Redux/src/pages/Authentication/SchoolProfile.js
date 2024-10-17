import PropTypes from "prop-types";
import Select from "react-select";
import React, { Component } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import { updateSchoolProfile, getSchoolProfile } from "../../store/actions";
import { error } from "toastr";

// import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

class SchoolProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      logo: "",
      target_line: "",
      // email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      isProfileUpdated: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  // The code for converting "Base64" to javascript "File Object"
  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  componentDidMount() {
    this.props.getSchoolProfile(this.state.user_id);
    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        logo: process.env.REACT_APP_BACKENDURL + this.props.success.logo,
        website: this.props.success.website,
        // email: this.props.success.email,
        phone: this.props.success.phone,
        address: this.props.success.address,
        city: this.props.success.city,
        target_line: this.props.success.target_line,
      });
    }, 1500);
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Account" breadcrumbItem="Profile" />
            <Row className="justify-content-center">
              <Col md={10} lg={10} xl={10}>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex">
                      <div className="me-3">
                        <img
                          src={this.state.logo}
                          alt=""
                          className="avatar-md rounded-circle img-thumbnail"
                        />
                      </div>
                      <div className="align-self-center flex-1">
                        <div className="text-muted">
                          <h5>{this.state.name}</h5>
                          {/* <p className="mb-0">{this.state.email}</p> */}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {this.state.isProfileUpdated && this.state.isProfileUpdated ? (
              <Alert color="success">Your profile is updated.</Alert>
            ) : null}

            <h4 className="card-title mb-4">Update School Profile</h4>

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    name: this.state.name || "",
                    logo: this.state.logo || "",
                    website: this.state.website || "",
                    // email: this.state.email || "",
                    phone: this.state.phone || "",
                    target_line: this.state.target_line || "",
                    address: this.state.address || "",
                    country: this.state.country || "",
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .trim()
                      .required("Please enter your name")
                      .min(3, "Please enter at least 3 characters")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^[a-zA-Z][a-zA-Z ]+$/,
                        "Please enter only alphabets and spaces"
                      ),
                      logo: Yup.string()
                      .required("Logo is required") // This makes the logo field mandatory
                      .nullable(false),
                    // email: Yup.string()
                    //   .required("Please enter your email")
                    //   .email("Please enter valid email")
                    //   .max(255, "Please enter maximum 255 characters"),
                    website: Yup.string()
                      .required("Please enter your website url")
                      .max(255, "Please enter maximum 255 characters"),
                    // landline: Yup.string()
                    //   .required("Please enter your landline no.")
                    //   .max(255, "Please enter maximum 255 characters")
                    //   .matches(
                    //     /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                    //     "Please enter a valid Pakistani landline number"
                    //   ),
                    phone: Yup.string()
                    .required("Please enter your phone no.")
                    .max(
                      255,
                      "Please enter maximum 255 characters"
                    ),
                    address: Yup.string()
                      .trim()
                      .required("Please enter your full address")
                      .max(255, "Please enter maximum 255 characters"),
                    // country: Yup.string()
                    //   .trim()
                    //   .required("Please enter your country")
                    //   .max(255, "Please enter maximum 255 characters")
                    //   .matches(
                    //     /^[a-zA-Z][a-zA-Z ]+$/,
                    //     "Please enter only alphabets and spaces"
                    //   ),
                  })}
                  onSubmit={values => {
                    console.log("submit is clicekd")
                    // if no file was selected for logo then get current image from url and convert to file
                    if (typeof values.logo == "string") {
                      this.toDataURL(values.logo).then(dataUrl => {
                        var fileData = this.dataURLtoFile(
                          dataUrl,
                          values.logo.split("/").at(-1)
                        );
                        values.logo = fileData;

                        this.props.updateSchoolProfile(values, this.state.user_id);
                      });
                    }

                    // Otherwise just call update method
                    else {
                      this.props.updateSchoolProfile(values, this.state.user_id);
                    }

                    // To show success message of update
                    this.setState({ isProfileUpdated: true });
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});


                    // To get updated profile again
                    setTimeout(() => {
                      this.props.getSchoolProfile(this.state.user_id);
                    }, 1000);

                    // To display updated logo
                    setTimeout(() => {
                      this.setState({
                        logo:
                          process.env.REACT_APP_BACKENDURL +
                          this.props.success.logo,
                      });
                    }, 2000);

                    // To make success message disappear after sometime
                    setTimeout(() => {
                      this.setState({
                        isProfileUpdated: false,
                      });
                    }, 5000);
                  }}
                >
                  {({ errors, status, touched }) => (
                    <Form className="form-horizontal">
                      {/* Name field */}
                      <div className="grade-row">
                        {/* <Label for="name" className="form-label">
                          School name
                        </Label> */}
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          placeholder="School name"
                          onChange={e =>
                            this.setState({ name: e.target.value })
                          }
                          value={this.state.name}
                          className={
                            "form-control" +
                            (errors.name && touched.name ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* Logo field */}
                      <div className="grade-row">
                        {/* <Label for="name" className="form-label">
                          Logo (Choose file only if you want to change logo)
                        </Label> */}
                        <Row>
                          <Col md={8} lg={8}>
                            <Input
                              id="formFile"
                              name="logo"
                              type="file"
                              multiple={false}
                              placeholder="Logo"
                              accept=".jpg,.jpeg,.png"
                              onChange={e =>
                                this.setState({
                                  logo: e.target.files[0],
                                })
                              }
                              className={
                                "form-control" +
                                (errors.logo && touched.logo
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                             <ErrorMessage
                              name="logo"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Col>

                          <Col md={4} lg={4}>
                            <div className="mt-2">
                              <strong>Currently: </strong>{" "}
                              <Link
                                to={{
                                  pathname:
                                    process.env.REACT_APP_BACKENDURL +
                                    this.props.success.logo,
                                }}
                                target="_blank"
                              >
                                Logo
                              </Link>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      {/* National Taxation No  field */}
                      <div className="grade-row">
                        {/* <Label
                          for="website"
                          className="form-label"
                        >
                          Website URL
                        </Label> */}
                        <Field
                          id="website"
                          name="website"
                          type="text"
                          placeholder="Webiste"
                          onChange={e =>
                            this.setState({ website: e.target.value })
                          }
                          value={this.state.website}
                          className={
                            "form-control" +
                            (errors.website && touched.website
                              ? " is-invalid"
                              : "")
                          }
                        />
                         <ErrorMessage
                          name="website"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* Lab experience field */}
                      <div className="grade-row">
                        {/* <Label for="target_line" className="form-label">
                          Target line
                        </Label> */}
                        <Field
                          id="target_line"
                          name="target_line"
                          type="text"
                          placeholder="Target Line"
                          onChange={e =>
                            this.setState({ target_line: e.target.value })
                          }
                          value={this.state.target_line}
                          className={
                            "form-control" +
                            (errors.target_line && touched.target_line
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="target_line"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* Email field */}
                      {/* <div className="mb-3">
                        <Label for="email" className="form-label">
                          Email
                        </Label>
                        <Field
                          name="email"
                          type="text"
                          onChange={e =>
                            this.setState({ email: e.target.value })
                          }
                          value={this.state.email}
                          className={
                            "form-control" +
                            (errors.email && touched.email ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div> */}
                      {/* Landline field */}
                      <div className="grade-row">
                        {/* <Label for="phone" className="form-label">
                          Phone
                        </Label> */}
                        <Field
                          id="phone"
                          name="phone"
                          type="text"
                          placeholder="Phone"
                          onChange={e =>
                            this.setState({
                              phone: e.target.value,
                            })
                          }
                          value={this.state.phone}
                          className={
                            "form-control" +
                            (errors.phone && touched.phone
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
                      {/* Address field */}
                      <div className="grade-row">
                        {/* <Label for="address" className="form-label">
                          Complete address
                        </Label> */}
                        <Field
                          id="address"
                          name="address"
                          type="text"
                          placeholder="Address"
                          onChange={e =>
                            this.setState({ address: e.target.value })
                          }
                          value={this.state.address}
                          className={
                            "form-control" +
                            (errors.address && touched.address
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
                      {/* country field */}
                      <div className="grade-row">
                        {/* <Label for="type" className="form-label">
                          Country
                        </Label> */}
                        <Field
                          name="country"
                          component="select"
                          onChange={e =>
                            this.setState({
                              country: e.target.value,
                            })
                          }
                          value={this.state.country}
                          className="form-select"
                        >
                          <option value="">Please Select</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Sindh">Sindh</option>
                          <option value="Balochistan">Balochistan</option>
                          <option value="Khyber Pakhtunkhawa">
                            Khyber Pakhtunkhawa
                          </option>
                          <option value="Islamabad Capital Territory">
                            Islamabad Capital Territory
                          </option>
                        </Field>
                      </div>
                      <div className="text-center mt-4">
                        <Button type="submit" color="danger">
                          Update Profile
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
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

SchoolProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateSchoolProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getSchoolProfile: PropTypes.func,
};

const mapStateToProps = state => ({
  success: state.schoolProfile.success,
  error: state.schoolProfile.error,
});

const mapDispatchToProps = {
  getSchoolProfile,
  updateSchoolProfile,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SchoolProfile));

