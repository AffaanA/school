import React from "react";
import "./Hero.module.css";
import "../../constants/theme.css";
import Buttons from "../../components/buttons/Buttons";
import { FaStar, FaCheck } from "react-icons/fa"; // Example icons

const HeroSection = () => {
  return (
    <section
      className="hero-section d-flex align-items-center text-white"
      style={{
        background:
          "linear-gradient(to left, var(--primary-blue), var(--secondary-blue))",
        height: "100vh",
      }}
    >
      <div className="container mt-5">
        <div className="row align-items-center justify-content-center text-center">
          {/* Text Content */}
          <div className="col-lg-8 col-md-12 mb-4">
            <h1
              className="display-4 display-md-6 fw-bold fw-md-normal mb-4"
              style={{ color: "#fff" }}
            >
              Free Online School Management Software
            </h1>
            <p className="lead" style={{ color: "var(--secondary-text)" }}>
              Now you can manage your school, college, or any educational center
              with eSkooly. It&apos;s 100% free for a lifetime with no
              limitations.
            </p>
            <div className="d-flex justify-content-center mt-4 gap-3 flex-column flex-sm-row align-items-center">
              <Buttons
                variant="btn-purple-rect"
                icon={<FaStar />}
                // className="w-auto"
              >
                Sign Up Now, It&apos;s Free
              </Buttons>

              <Buttons
                variant="btn-white-rect"
                icon={<FaStar />}
                // className="w-auto"
              >
                Learn More
              </Buttons>
            </div>
            <div className="mt-3">
              <a href="#video" style={{ color: "var(--secondary-text)" }}>
                See how it works
              </a>
            </div>
          </div>

          {/* Image Content */}
          <div className="col-lg-8 col-md-10 d-flex align-items-center justify-content-center position-relative">
            <img
              src="assets/landing/a6.png"
              alt="Dashboard"
              className="img-fluid mb-3 d-none d-lg-block"
              style={{ maxWidth: "10%" }}
            />
            <img
              src="assets/landing/laptop.png"
              alt="Dashboard"
              className="img-fluid mb-3"
              style={{ maxWidth: "80%" }}
            />
            <img
              src="assets/landing/mobile1.png"
              alt="Mobile App"
              className="img-fluid mt-3 position-absolute"
              style={{
                maxWidth: "20%",
                top: "50%",
                left: "72%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            />
            <img
              src="assets/landing/a4.png"
              alt="Mobile App"
              className="img-fluid mb-3 d-none d-lg-block"
              style={{ maxWidth: "10%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
