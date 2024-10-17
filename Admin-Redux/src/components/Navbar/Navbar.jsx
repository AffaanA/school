import React, { useState } from "react";
import { FaBars, FaUser, FaSignInAlt } from "react-icons/fa";
import { FaStar, FaCheck } from "react-icons/fa";

import "./Navbar.css";
import Buttons from "../buttons/Buttons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar navbar-no-padding navbar-expand-md navbar-dark navbar-custom fixed-top">
      <div className="container d-flex align-items-center">
        {/* Logo */}
        <a
          href="/"
          className="navbar-brand d-flex align-items-center flex-shrink-1 me-auto"
        >
          <img
            src="assets/landing/logox.png"
            alt="Logo"
            className="logo me-2"
            style={{ width: "95px", height: "50px" }}
          />
        </a>

        {/* Hamburger Menu */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        {/* Main Navbar Content */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <div className="d-flex flex-md-row  flex-column justify-content-between w-100 align-items-responsive">
            {/* Left side - Products & Help */}
            <div className="d-flex flex-grow-1 align-items-center justify-content-start ps-md-5">
              <a
                href="#products"
                className="nav-link me-3 d-none d-md-block" // Hides on md and below
                style={{
                  color: "var(--primary-white)",
                  fontSize: "16px",
                  fontWeight: 200,
                }}
              >
                Products
              </a>
              <a
                href="#help"
                className="pe-5 pe-md-0"
                style={{
                  color: "var(--primary-white)",
                  fontSize: "16px",
                  fontWeight: 200,
                }}
              >
                Help
              </a>
            </div>

            {/* Right side - Sign Up & Login */}
            <div className="d-flex flex-md-row flex-column align-items-center justify-content-end gap-4 mt-3 mt-md-0">
              <Buttons
                variant="btn-purple-round"
                icon={<FaCheck />}
                style={{
                  fontWeight: 200,
                }}
              >
                Sign Up
              </Buttons>
              <Buttons
                variant="btn-white-round"
                icon={<FaCheck />}
                style={{
                  fontWeight: 200,
                }}
              >
                Login
              </Buttons>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
