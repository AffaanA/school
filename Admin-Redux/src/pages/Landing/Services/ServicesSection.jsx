import React from "react";
import styles from "./ServiceSection.module.css"; // CSS Module for scoped styling
import Buttons from "../../../components/buttons/Buttons";

const servicesData = [
  {
    id: 1,
    badge: "Why Us",
    title: "Why eSkooly is the best school management software?",
    description:
      "Besides, eSkooly is a completely free online school management software, it has more school management features than any other online school management system in the market. It does not end here, eSkooly is still enhancing features. You will be automatically updated as a new feature will be a part of our free school management software. Some main school management features are given below.",

    imageSrc: "assets/landing/desktop-min.png",
  },
  {
    id: 2,
    badge: "Manage User Roles",
    title: "Separate Portals Available",
    description:
      "our school management system comes with a separate portal for every user role. An admin portal with full controls, separate portals for Management staff, Accountant, Teachers, Parents, and Students",
    buttonText: "Sign Up Now, it's 100% free",
    imageSrc: "assets/landing/full-team.png",
  },
  {
    id: 3,
    badge: "Message System",
    title: "Messaging and file sharing system",
    description:
      "Discuss and share ideas with other users through our messaging system. With this feature, you can do real-time chat with every individual associated with your institution.",
    buttonText: "Sign Up Now",
    imageSrc: "assets/landing/communicate.png",
  },
  {
    id: 4,
    badge: "SMS Alerts",
    title: "Free SMS Services",
    description:
      "Send unlimited free SMS alerts on mobile numbers with our 100% free SMS gateway application. Now no need to buy expensive branded SMS to send alerts on mobile phones.",
    buttonText: "Download SMS Gateway",
    imageSrc: "assets/landing/smsgateway.png",
  },
  {
    id: 5,
    badge: "Stay Mobile",
    title: "Free Mobile Application",
    description:
      "Download and install our free mobile application to stay on mobile. Our mobile app is for every registered user like Admin, Teacher, Accountant, Management staff, Parents, and students.",
    buttonText: "Get it on Google Play",
    buttonVariant: "primary",
    buttonText2: "Download on App Store",
    buttonVariant2: "primary",
    imageSrc: "assets/landing/mobile-chat.png",
  },
  {
    id: 6,
    badge: "Live Class",
    title: "Free online live classes",
    description:
      "Stop using third-party apps like Zoom, Google meet, or Microsoft team to conduct online classes. Use our most powerful and easy-to-use platform to conduct your live online classes. It's 100% free.",
    buttonText: "Sign Up Now.",

    imageSrc: "assets/landing/online-class.png",
  },
  {
    id: 7,
    badge: "Desktop App",
    title: "Desktop version for Windows, MacOS, and Linux",
    description:
      "Download and install our school management software in your computer just paying a small one time payment.",
    buttonText: "Download Now.",

    imageSrc: "assets/landing/support-team.png",
  },
  {
    id: 8,
    badge: "Multilingual",
    title: "Available In all Languages",
    description:
      "Our  free school management  software comes in all languages. Manage your educational institute with your native language.",
    buttonText: "Sign Up Now.",

    imageSrc: "assets/landing/language.png",
  },
  // Add more services as needed
];

const ServiceSection = () => {
  return (
    <section
      className={`${styles.serviceSection} py-5`}
      style={{
        background:
          "linear-gradient(to left, var(--secondary-blue), var(--primary-blue))",
      }}
    >
      <div className="container">
        {servicesData.map((service, index) => (
          <div
            className={`row align-items-center mb-5 ${
              index % 2 === 0 ? "" : "flex-md-row-reverse"
            }`}
            key={service.id}
          >
            <div className="col-md-5">
              <div className={styles.serviceContainer}>
                <span className={`${styles.badge} mb-2`}>{service.badge}</span>
                <h3 className={`${styles.serviceTitle} mb-2`}>
                  {service.title}
                </h3>
                <p className={`${styles.serviceText} fw-light mb-4`}>
                  {service.description}
                </p>
                {service.buttonText && (
                  <div className="d-flex gap-2">
                    <Buttons variant="btn-pink-round">
                      {service.buttonText}
                    </Buttons>
                    {service.buttonText2 && (
                      <Buttons variant="btn-pink-round">
                        {service.buttonText2}
                      </Buttons>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6 text-center mb-2">
              <img
                src={service.imageSrc}
                alt={service.title}
                className={`img-fluid ${styles.serviceImage}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceSection;
