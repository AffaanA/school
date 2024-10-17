import React from "react";
import Buttons from "../../../components/buttons/Buttons";
import styles from "./Management.module.css";

const Management = () => {
  return (
    <section
      className={`py-5 ${styles.managementSection}`}
      style={{
        background:
          "linear-gradient(to right, var(--secondary-blue), var(--primary-blue))",
      }}
    >
      <div className={styles.managementContainer}>
        <div className="row align-items-center mb-5 justify-content-between">
          <div className="col-md-5">
            <div className={styles.serviceContainer}>
              <h3 className="mb-2">
                Single Stop Solution For School Management
              </h3>
              <p className="fw-thin mb-4">
                Managing any educational institute is not a piece of cake.
                Managing students, staff, timetable, exams, class test,
                attendance, fees collection, accounts, etc. It does not end
                here. Parents are always worried about their childs performance
                and they need satisfaction. They care about their childs
                academic statics. Moreover, we have seen schools using huge
                registers to mark the attendance of their students and staff.
                And we have also seen that schools manage their admission, exams
                data, class tests data, etc, manually. We know it takes a lot of
                time and is very difficult to manage. Well! its time to put
                check on these worries. eSkooly presents you a free online
                school management software to make conventional tasks easier.
                This is the one-stop solution to manage, track and record
                everything within your school or organization. Our free online
                school management software includes admin, staff and students
                panel, exams module, attendance module, fees collection module,
                salary and expense management, class tests management, inventory
                management, students and staff data record system, and many
                more. It is very easy to use and manage because eskooly is a
                free online school management software for end-users. If you can
                send an email you can use eskooly.
              </p>

              <div className="d-flex align-items-center gap-2">
                <Buttons variant="btn-transparent-round">
                  Get Started For Free
                </Buttons>
                <p className="m-0">Right Now</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 text-center my-2">
            <img
              src="assets/landing/desktop-min.png"
              alt="img"
              className={`img-fluid ${styles.serviceImage}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Management;
