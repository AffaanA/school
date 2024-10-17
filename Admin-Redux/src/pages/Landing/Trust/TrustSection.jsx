import React from "react";
import styles from "./TrustSection.module.css"; // Import the module CSS
const logos = [
  "assets/landing/c1.png",
  "assets/landing/c2.png",
  "assets/landing/c6.png",
  "assets/landing/c8.png",
  "assets/landing/c9.png",
  "assets/landing/c11.png",
  "assets/landing/c12.png",
  "assets/landing/c13.png",
  "assets/landing/c14.png",
  "assets/landing/c3.png",
  "assets/landing/c7.png",
  "assets/landing/c4.png",
  "assets/landing/c5.png",
  "assets/landing/c10.png",
  "assets/landing/c16.png",
];
const TrustSection = () => {
  return (
    <section
      className={`${styles.trustSection} py-5`}
      style={{
        background:
          "linear-gradient(to left, var(--primary-blue), var(--secondary-blue))",
        height: "100vh",
      }}
    >
      <div className={`${styles.trustContainer} container`}>
        <div className={`text-center ${styles.trustHeadings} mb-4`}>
          <p>We build Trust.</p>
          <h3>
            <strong>45K+ Schools</strong> use our product.
          </h3>
        </div>
        <div
          className={`row row-cols-2 row-cols-md-5 g-2 ${styles.trustContent}`}
        >
          {logos.map((logo, index) => (
            <div
              key={index}
              className={`col d-flex justify-content-center align-items-center ${
                index < 10 ? styles.imageContainerWithBorder : ""
              } ${index % 5 < 4 ? styles.imageContainerWithRightBorder : ""} ${
                styles.imageContainer
              }`}
            >
              <img
                src={logo}
                alt={`Logo ${index + 1}`}
                className={`img-fluid ${styles.logoImage}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
