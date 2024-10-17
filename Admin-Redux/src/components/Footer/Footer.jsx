import React from "react";
import styles from "./Footer.module.css"; // Importing CSS Module
import Buttons from "../buttons/Buttons";

const Footer = () => {
  return (
    <footer className={styles.footerSection}>
      <div className="container">
        <div className="row">
          {/* Left Section */}
          <div className="col-md-4">
            <div className={styles.footerLogo}>
              <img
                src="assets/landing/logox.png"
                alt="Logo"
                className={styles.logo}
              />
              <p className={styles.footerDescription}>
                eSkooly is the world’s best and #1 ranked free online school
                management software. Our school management software has more
                features than any school software in the market.
              </p>
              <p className={styles.footerCopyright}>
                Copyright © 2024 eSkooly (SMC Private) Ltd. - All rights
                reserved.
              </p>
            </div>
          </div>
          {/* Middle Section */}
          <div className="col-md-4 d-flex gap-5 pt-5">
            <div>
              <h5>ESKOOLY</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#home" className="text-light">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-light">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#get-started" className="text-light">
                    Get started
                  </a>
                </li>
                <li>
                  <a href="#help" className="text-light">
                    Help
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5>TERMS</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#terms-of-service" className="text-light">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#privacy-policy" className="text-light">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#saas-services" className="text-light">
                    SaaS services
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Right Section */}
          <div className="col-md-2">
            <div className={styles.appButtons}>
              <Buttons variant="btn-purple-round" className={styles.buttons}>
                <i className="fab fa-google-play"></i> GET IT ON GOOGLE PLAY
              </Buttons>
              <Buttons variant="btn-purple-round">
                <i className="fab fa-app-store"></i> DOWNLOAD ON APP STORE
              </Buttons>
            </div>
            <div className={styles.socialIcons}>
              <a href="#facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#google">
                <i className="fab fa-google"></i>
              </a>
              <a href="#linkedin">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
