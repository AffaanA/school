import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
const AppRoute = ({
  component: Component,
  layout: Layout,
  isAuthProtected,
  isAdminAuthProtected,
  isStudentAuthProtected,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      if (isAuthProtected && !localStorage.getItem("authUser")) {
        return (
          <Redirect
            to={
              { pathname: "/login", state: { from: props.location } }
            }
          />
        );
      }
      else if (isAuthProtected &&
        (isStudentAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type === "School"
      ) {
        return <Redirect to="/dashboard" />;
      }
      else if (
        isAuthProtected &&
        (isAdminAuthProtected) &&
        JSON.parse(localStorage.getItem("authUser")).account_type === "Student"
      ) {
        return <Redirect to="/dashboard-student" />;
      }
      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
);

AppRoute.propTypes = {
  isAuthProtected: PropTypes.bool,
  isAdminAuthProtected: PropTypes.bool,
  isStudentAuthProtected:PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default AppRoute;
