import React, { Component } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { connect } from "react-redux";
import {
  authProtectedRoutes,
  publicRoutes,
  adminauthProtectedRoutes,
  studentauthProtectedRoutes,
} from "./routes/";
import AppRoute from "./routes/route";
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import "./assets/scss/theme.scss";
import "react-toastify/dist/ReactToastify.css";

import fakeBackend from "./helpers/AuthType/fakeBackend";
fakeBackend();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getLayout = this.getLayout.bind(this);
  }
  getLayout() {
    let layoutCls = VerticalLayout;

    // For patient protected routes
    if (authProtectedRoutes) {
      layoutCls = HorizontalLayout;
    } else {
      switch (this.props.layout.layoutType) {
        default:
          layoutCls = VerticalLayout;
          break;
      }
    }
    return layoutCls;
  }

  render() {
    const Layout = this.getLayout();

    return (
      <React.Fragment>
        <Router>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
                isAdminAuthProtected={false}
                isStudentAuthProtected={false}
              />
            ))}
            {authProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={HorizontalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isAdminAuthProtected={false}
                isStudentAuthProtected={false}
                exact
              />
            ))}
            {adminauthProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={VerticalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isAdminAuthProtected={true}
                isStudentAuthProtected={false}
                exact
              />
            ))}
            {studentauthProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={VerticalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={true}
                isAdminAuthProtected={false}
                isStudentAuthProtected={true}
                exact
              />
            ))}
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  };
};

App.propTypes = {
  layout: PropTypes.object,
};

export default connect(mapStateToProps, null)(App);
