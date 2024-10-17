import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
// import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
} from "reactstrap";

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Required for auto-table plugin
import { getTeachersList } from '../../store/actions';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";

import {
getEmployeesAttendence,
} from "../../store/actions";

import { isEmpty, size } from "lodash";
import "../../assets/scss/table.scss";
class EmployeeAttendenceList extends Component {
    constructor(props) {
        super(props);
        this.node = React.createRef();
        this.state = {
          classes: [],
          clas: "",
          type: "",
          modal: false,
      
          deleteModal: false,
          clasDetails: null,
          clasmodal: false,
          daysOfWeek : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          user_id: localStorage.getItem("authUser")
            ? JSON.parse(localStorage.getItem("authUser")).user_id
            : "",
          clasListColumns: [
            {
              text: "id",
              dataField: "id",
              sort: true,
              hidden: true,
              formatter: (cellContent, clas) => <>{clas.id}</>,
            },
            {
              dataField: "date",
              text: "Date",
              sort: true,
            },
            {
              dataField: "day",
              text: "Day",
              sort: true,
              formatter: (cellContent, row) => {
                const date = new Date(row.date);  // Parse the date field
                return this.state.daysOfWeek[date.getDay()];  // Use 'this.state.daysOfWeek'
              },
            },
            {
              dataField: "employee.employee_id",
              text: "ID",
              sort: true,
            }, 
            {
              dataField: "employee.name",
              text: "Name",
              sort: true,
            }, 
            {
              dataField: "employee.user_type",
              text: "Type",
              sort: true,
            },
            {
              dataField: "status",
              text: "Status",
              sort: true,
            },
          ],
        };
      }
      

  componentDidMount() {
    const { classes, onGetEmployeesAttendence } = this.props;
    console.log("getiingclasses", onGetEmployeesAttendence(this.state.user_id));
    this.setState({ classes });
    console.log("state", this.state.classes);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { classes } = this.props;
    if (!isEmpty(classes) && size(prevProps.classes) !== size(classes)) {
      this.setState({ classes: {}, isEdit: false });
    }
  }
// Function to export data to Excel with specified structure
exportToExcel = () => {
  const { classes } = this.props;

  // Check if classes is an array
  if (!Array.isArray(classes) || classes.length === 0) {
      console.error("Classes data is not an array or is empty", typeof (classes));
      return; // Exit the function if the data is not valid
  }

  // Grouping by date
  const groupedData = classes.reduce((acc, row) => {
      const date = row.date;
      if (!acc[date]) {
          acc[date] = []; // Initialize array for new date
      }
      acc[date].push({
          id: row.employee ? row.employee.employee_id : "N/A",
          name: row.employee ? row.employee.name : "N/A",
          type: row.employee ? row.employee.user_type : "N/A",
          status: row.status,
      });
      return acc;
  }, {});

  const finalData = [];

  // Preparing data for the worksheet
  Object.keys(groupedData).forEach(date => {
      // Adding date header row
      finalData.push([date, '', '', '']); // Date in the first column, leave others empty
      // Adding the updated headers row
      finalData.push(['Employee ID', 'Name', 'Type', 'Status']);
      // Adding attendance records
      groupedData[date].forEach(record => {
          finalData.push([record.id, record.name, record.type, record.status]);
      });
      finalData.push(['', '', '', '']); // Adding an empty row for spacing between dates
  });

  const worksheet = XLSX.utils.aoa_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  // Apply styles for the date headers
  Object.keys(groupedData).forEach((date, index) => {
      const rowIndex = index * (groupedData[date].length + 2); // Calculate row index
      const cellAddress = `A${rowIndex + 1}`; // Date header in the first column

      // Style for the date header
      worksheet[cellAddress] = {
          v: date,
          s: {
              fill: { fgColor: { rgb: "FFC000" } }, // Background color
              font: { bold: true, color: { rgb: "FFFFFF" } }, // Font style
              alignment: { horizontal: "center", vertical: "center" }, // Center alignment
          },
      };

      // Merge cells for the date header
      worksheet[`!merges`] = worksheet[`!merges`] || [];
      worksheet[`!merges`].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 3 } }); // Merge across the first row
  });

  // Set column widths for better visibility
  const colWidths = [
      { wpx: 120 }, // ID column
      { wpx: 150 }, // Name column
      { wpx: 100 }, // Type column
      { wpx: 100 }, // Status column
  ];
  worksheet['!cols'] = colWidths;

  // Write the file
  XLSX.writeFile(workbook, "AttendanceData.xlsx");
};

// Function to export data to PDF with pagination support
exportToPDF = () => {
  const { classes } = this.props;
  const doc = new jsPDF();

  // Grouping data by date
  const groupedData = classes.reduce((acc, row) => {
      const date = row.date;
      if (!acc[date]) {
          acc[date] = []; // Initialize array for new date
      }
      acc[date].push({
          id: row.employee ? row.employee.employee_id : "N/A",
          name: row.employee ? row.employee.name : "N/A",
          type: row.employee ? row.employee.user_type : "N/A",
          status: row.status || "N/A", // Ensure status is checked for null/undefined
      });
      return acc;
  }, {});

  let yOffset = 10; // Start from 10 units down from the top
  const pageHeight = doc.internal.pageSize.height; // Get the height of the page

  // Adding content to the PDF
  Object.keys(groupedData).forEach(date => {
      // Set font styles for the date header
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255); // White text color

      // Set background color for date header
      doc.setFillColor(255, 192, 0); // Yellow color for background
      doc.rect(10, yOffset, 190, 10, "F"); // Draw rectangle

      // Center the date text
      const pageWidth = doc.internal.pageSize.getWidth(); // Get the width of the page
      const textWidth = doc.getTextWidth(date); // Get the width of the text
      const xPosition = (pageWidth - textWidth) / 2; // Calculate X position for center alignment

      // Add the date text
      doc.text(date, xPosition, yOffset + 7); // Center text

      yOffset += 10; // Move down for the next row

      // Set font styles for the table header
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255); // White text for header
      doc.setFillColor(0, 112, 192); // Blue color for header background

      // Draw header rectangle
      doc.rect(10, yOffset, 190, 10, "F");

      // Add updated headers
      const headers = ['ID', 'Name', 'Type', 'Status'];
      const columnWidth = 190 / headers.length; // Calculate width for each column

      headers.forEach((header, index) => {
          doc.text(header, 15 + index * columnWidth + columnWidth / 2, yOffset + 7, { align: 'center' });
      });

      yOffset += 10; // Move down for the next row

      // Add margin before the data rows
      yOffset += 5; // Add margin to create space above data rows

      // Add data rows
      groupedData[date].forEach(record => {
          if (yOffset >= pageHeight - 20) { // Check if nearing the bottom of the page
              doc.addPage(); // Add a new page
              yOffset = 10; // Reset yOffset for the new page
          }

          doc.setFont("helvetica", "normal");
          doc.setTextColor(0); // Black text color
          doc.text((record.id || "N/A").toString(), 15, yOffset); // Check for null/undefined, then toString
          doc.text(record.name || "N/A", 15 + columnWidth, yOffset); // Check for null/undefined
          doc.text(record.type || "N/A", 15 + columnWidth * 2, yOffset); // Check for null/undefined
          doc.text(record.status || "N/A", 15 + columnWidth * 3, yOffset); // Check for null/undefined
          yOffset += 10; // Move down for the next row
      });

      yOffset += 5; // Add a little space before the next date
  });

  // Save the PDF
  doc.save('AttendanceData.pdf');
};




  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };
  render() {
    const { SearchBar } = Search;

    const { classes } = this.props;

    const { isEdit, deleteModal } = this.state;
    const { clasmodal, clasDetails } = this.state;
    const { onUpdateEmployee, onGetEmployeesAttendence } = this.props;
    const clas = this.state.clas;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: classes.length, // replace later with size(classes),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteEmployee}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Employee Attendence List | School Management System</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="School" breadcrumbItem="Employee Attendence List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.clasListColumns}
                      data={classes}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.clasListColumns}
                          data={classes}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="8" lg="8">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                                <Col sm="4" lg="4" className="text-end">
                                  <Button onClick={this.exportToExcel} color="success" className="me-2">Export to Excel</Button>
                                  <Button onClick={this.exportToPDF} color="primary">Export to PDF</Button>
                                </Col>
                              </Row>

                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-condensed table-hover"
                                      }
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

EmployeeAttendenceList.propTypes = {
  match: PropTypes.object,
  classes: PropTypes.array,
  className: PropTypes.any,
  onGetEmployeesAttendence: PropTypes.func,
};
const mapStateToProps = state => ({
  classes: state.employeesbyschoollist.employeesbyschoolList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetEmployeesAttendence: id => dispatch(getEmployeesAttendence(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EmployeeAttendenceList));
