import React from "react";
import { FaThumbsUp, FaMobileAlt, FaCloud, FaChartLine } from "react-icons/fa";
import styles from "./Features.module.css";

const Features = () => {
  return (
    <section
      className={`${styles.featuresSection} py-5 text-center text-white`}
    >
      <div className={styles.featureContainer}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Features Of School Management Software
          </h2>
          <p className={`${styles.sectionDescription}  mx-auto`}>
            eSkooly is a complete and feature-rich school management software
            for all educational institutes. This school management software is
            for learning, administration, and management activities in schools,
            colleges, universities, tuition centers, or training centers. Our
            free school management system manages everything starting from
            admission to attendance and exams to result in cards.
          </p>
        </div>

        <div className={styles.subFeatureContainer}>
          <div>
            {[
              {
                title: "Absolutely Free",
                description:
                  "eSkooly is an absolutely 100% free school management software for a lifetime with no limitations. No need to buy anything. Just Sign Up",
                icon: <FaThumbsUp />,
              },
              {
                title: "Cloud Based Software",
                description:
                  "eSkooly is an absolutely 100% free school management software for a lifetime with no limitations. No need to buy anything. Just Sign Up",
                icon: <FaCloud />,
              },
              {
                title: "Regular Updates & Support",
                description:
                  "eSkooly is an absolutely 100% free school management software for a lifetime with no limitations. No need to buy anything. Just Sign Up",
                icon: <FaChartLine />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${styles.subFeature} ${styles.leftSide}`}
              >
                <div className={`${styles.iconCircle} mx-auto mb-3`}>
                  {feature.icon}
                </div>
                <div className={styles.subFeatureText}>
                  <h4>{feature.title}</h4>
                  <p className=" mx-auto">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.mobileImgContainer}>
            <img src="assets/landing/mobile.png" alt="Mobile Application" />
          </div>

          <div>
            {[
              {
                title: "Responsive Web Design",
                description:
                  "You can use our free school management software on any device, like Mobile, Tablet, Laptop, or desktop due to its responsive design.",
                icon: <FaMobileAlt />,
              },
              {
                title: "Infographics & Animations",
                description:
                  "You can use our free school management software on any device, like Mobile, Tablet, Laptop, or desktop due to its responsive design.",
                icon: <FaCloud />,
              },
              {
                title: "Fast, Secure & Easy",
                description:
                  "You can use our free school management software on any device, like Mobile, Tablet, Laptop, or desktop due to its responsive design.",

                icon: <FaChartLine />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${styles.subFeature} ${styles.rightSide}`}
              >
                <div className={`${styles.iconCircle} mx-auto mb-3`}>
                  {feature.icon}
                </div>
                <div className={styles.subFeatureText}>
                  <h4>{feature.title}</h4>
                  <p className=" mx-auto">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
