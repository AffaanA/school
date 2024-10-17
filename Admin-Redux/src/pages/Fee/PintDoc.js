import React from 'react';

class PrintDoc extends React.Component {
  render() {
    const { challanData } = this.props;

    if (!challanData) {
      return (
        <div style={styles.container}>
          <p>No data available for printing.</p>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Fee Challan</h1>
          <p style={styles.challanId}>Challan ID: {challanData.challan_id}</p>
        </header>
        <section style={styles.details}>
          <div style={styles.detailRow}>
            <span style={styles.label}>Month:</span>
            <span style={styles.value}>{challanData.month}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Due Date:</span>
            <span style={styles.value}>{new Date(challanData.due_date).toLocaleDateString()}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Bank:</span>
            <span style={styles.value}>{challanData.bank}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Student:</span>
            <span style={styles.value}>{challanData.student}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Admission Fee:</span>
            <span style={styles.value}>{challanData.admission_fee ? `$${challanData.admission_fee}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Tution Fee:</span>
            <span style={styles.value}>{challanData.tution_fee ? `$${challanData.tution_fee}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Transport Fee:</span>
            <span style={styles.value}>{challanData.transport ? `$${challanData.transport}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Registration Fee:</span>
            <span style={styles.value}>{challanData.registration_fee ? `$${challanData.registration_fee}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Uniform Fee:</span>
            <span style={styles.value}>{challanData.uniform ? `$${challanData.uniform}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Art Material :</span>
            <span style={styles.value}>{challanData.art_material ? `$${challanData.art_material}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Uniform Fee:</span>
            <span style={styles.value}>{challanData.uniform ? `$${challanData.uniform}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Books:</span>
            <span style={styles.value}>{challanData.books ? `$${challanData.books}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Fine:</span>
            <span style={styles.value}>{challanData.fine ? `$${challanData.fine}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Others:</span>
            <span style={styles.value}>{challanData.others ? `$${challanData.others}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Previous Balance:</span>
            <span style={styles.value}>{challanData.previous_balance ? `$${challanData.previous_balance}` : 'N/A'}</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.label}>Late Fine:</span>
            <span style={styles.value}>{challanData.late_fine ? `$${challanData.late_fine}` : 'N/A'}</span>
          </div>
          {/* Add more details as needed */}
        </section>
        <footer style={styles.footer}>
          <p>Thank you for your payment.</p>
        </footer>
      </div>
    );
  }
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    margin: 0,
  },
  challanId: {
    fontSize: '16px',
    color: '#666',
  },
  details: {
    margin: '20px 0',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    textAlign: 'right',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
};

export default PrintDoc;
