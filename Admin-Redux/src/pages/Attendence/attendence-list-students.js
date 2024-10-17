import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
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

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import { getStudentsAttendence } from "../../store/actions";

import { isEmpty, size } from "lodash";
import "../../assets/scss/table.scss";

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Required for auto-table plugin

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
      daysOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
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
          dataField: "student.id",
          text: "ID",
          sort: true,
        }, 
        {
          dataField: "student.student_name",
          text: "Name",
          sort: true,
        }, 
        {
          dataField: "student.class_name",
          text: "Class",
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
    const { classes, onGetStudentsAttendence } = this.props;
    console.log("getiingstudentattendence", onGetStudentsAttendence(this.state.user_id));
    this.setState({ classes });
    console.log("state", this.state.classes);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { classes } = this.props;
    if (!isEmpty(classes) && size(prevProps.classes) !== size(classes)) {
      this.setState({ classes: {}, isEdit: false });
    }
  }

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

// Function to export data to Excel with specified structure
exportToExcel = () => {
    const { classes } = this.props;
    console.log("this state", this.props.classes);

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
            id: row.student.id,
            name: row.student.student_name,
            class: row.student.class_name,
            status: row.status,
        });
        return acc;
    }, {});

    const finalData = [];

    // Preparing data for the worksheet
    Object.keys(groupedData).forEach(date => {
        // Adding date header row
        finalData.push([date, '', '', '']); // Date in first column, leave others empty
        // Adding the headers row
        finalData.push(['ID', 'Name', 'Class', 'Status']);
        // Adding attendance records
        groupedData[date].forEach(record => {
            finalData.push([record.id, record.name, record.class, record.status]);
        });
        finalData.push(['', '', '', '']); // Adding an empty row for spacing between dates
    });

    const worksheet = XLSX.utils.aoa_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    // Apply styles for the date headers
    const dateHeaderCells = [];
    const startRow = 0; // Row index for the first date header

    // Apply styles for each date header
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

        // Set the width for the date header cell
        worksheet['!cols'] = [{ wpx: 200 }]; // Adjust width as necessary

        // Merge cells for the date header
        const endRowIndex = rowIndex + 1; // Row index for the next row
        worksheet[`!merges`] = worksheet[`!merges`] || [];
        worksheet[`!merges`].push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 3 } }); // Merge across the first row
    });

    // Style for the second row (headers)
    const headerRowIndex = startRow + 1; // Row index for the headers
    const headerCells = ['ID', 'Name', 'Class', 'Status'];

    headerCells.forEach((header, idx) => {
        worksheet[XLSX.utils.encode_cell({ r: headerRowIndex, c: idx })] = {
            v: header,
            s: {
                fill: { fgColor: { rgb: "0070C0" } }, // Background color for headers
                font: { bold: true, color: { rgb: "FFFFFF" } }, // Font style
                alignment: { horizontal: "center", vertical: "center" }, // Center alignment for headers
            },
        };
    });

    // Set column widths for better visibility
    const colWidths = [
        { wpx: 120 }, // Employee ID column
        { wpx: 150 }, // Name column
        { wpx: 100 }, // Class column
        { wpx: 100 }, // Status column
    ];

    worksheet['!cols'] = colWidths;

    // Write the file
    XLSX.writeFile(workbook, "AttendanceData.xlsx");
};
// Function to export data to PDF with pagination support
exportToPDF = () => {
    const { classes } = this.props;
    console.log("Attendance records:", classes); // Log the attendance records
    const doc = new jsPDF();

    // Grouping data by date
    const groupedData = classes.reduce((acc, row) => {
        const date = row.date;
        if (!acc[date]) {
            acc[date] = []; // Initialize array for new date
        }
        acc[date].push({
            id: row.student.id,
            name: row.student.student_name,
            class: row.student.class_name,
            status: row.status,
        });
        return acc;
    }, {});

    // Check if groupedData has all expected dates
    console.log("Grouped Data:", groupedData);

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

        // Add headers
        const headers = ['Employee ID', 'Name', 'Class', 'Status'];
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
            doc.text(record.id.toString(), 15, yOffset);
            doc.text(record.name, 15 + columnWidth, yOffset);
            doc.text(record.class, 15 + columnWidth * 2, yOffset);
            doc.text(record.status, 15 + columnWidth * 3, yOffset);
            yOffset += 10; // Move down for the next row
        });

        yOffset += 5; // Add a little space before the next date
    });

    // Save the PDF
    doc.save('AttendanceData.pdf');
};



  render() {
    const { SearchBar } = Search;

    const { classes } = this.props;

    const { isEdit, deleteModal } = this.state;
    const { clasmodal, clasDetails } = this.state;
    const { onUpdateEmployee, onGetStudentsAttendence } = this.props;
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
                                      <SearchBar {...toolkitprops.searchProps} />
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
                                  <PaginationListStandalone {...paginationProps} />
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
  onGetStudentsAttendence: PropTypes.func,
};

const mapStateToProps = state => ({
  classes: state.studentsbyclasslist.studentsbyclassList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetStudentsAttendence: id => dispatch(getStudentsAttendence(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EmployeeAttendenceList));
