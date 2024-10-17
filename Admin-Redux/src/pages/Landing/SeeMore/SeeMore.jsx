import React from "react";
import styles from "./SeeMore.module.css"; // Import the CSS Module
import {
  FaUniversity,
  FaUsers,
  FaBook,
  FaSmile,
  FaDollarSign,
  FaBalanceScale,
  FaClipboardList,
  FaFileAlt,
  FaGlasses,
} from "react-icons/fa";

const SeeMore = () => {
  const features = [
    {
      icon: <FaUniversity />,
      title: "Institute Info",
      description:
        "You can set your all institute info like logo, name, target line etc, which will display on every printable document and report.",
    },
    {
      icon: <FaUsers />,
      title: "Class Management",
      description:
        "This school management software manages your classes in an easy way. Starts from students to subjects, courses to marks.",
    },
    {
      icon: <FaBook />,
      title: "Exams Management",
      description:
        "eSkooly has a complete solution for exams management starting from new exam to final results, reports, and result cards.",
    },
    {
      icon: <FaSmile />,
      title: "Attendance System",
      description:
        "Our free school software has an outstanding online attendance management system for students and staff.",
    },
    {
      icon: <FaDollarSign />,
      title: "Fee Management",
      description:
        "Our school software opens an account for every student to manage its fees and dues. eSkooly manages everything automatically.",
    },
    {
      icon: <FaClipboardList />,
      title: "Tests Management",
      description:
        "Managing class tests is a piece of cake with this free school management software. It keeps records of every class test.",
    },
    {
      icon: <FaBalanceScale />,
      title: "Accounts",
      description:
        "Managing income, expenses, and staff salaries is no longer difficult. By using our software, you can manage quite easily.",
    },
    {
      icon: <FaFileAlt />,
      title: "Printable Reports",
      description:
        "You can print all the reports and letters like admission letter, fee slip, salary slip, job letter, and result cards.",
    },
  ];

  return (
    <section
      className={`${styles.allFeaturesSection} d-flex flex-column align-items-center justify-content-center text-center py-5`}
    >
      <div className={styles.headingContainer}>
        <p className={styles.subheading}>THATS NOT ALL</p>
        <h2 className={styles.mainHeading}>All Features in one place</h2>
        <div className={`${styles.icon} ${styles.iconGlasses}`}>
          <FaGlasses />
        </div>
      </div>

      {/* Features Grid */}
      <div className={`${styles.featuresGridContainer} mt-5`}>
        <div className="row">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-3 mb-4">
              <div
                className={`${styles.featureItem} d-flex flex-column align-items-center text-center`}
              >
                <div className={`${styles.iconCircleWhite} mb-3`}>
                  {feature.icon}
                </div>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeeMore;
