import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useApp } from '../context/AppContext';
import DataTable from '../components/DataTable';
import Message from '../components/Message';

const columns = [
  { key: 'name', label: 'Doctor' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'totalAppointments', label: 'Total' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

function Home() {
  const { doctors, patients } = useApp();
  const navigate = useNavigate();
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState('');

  // Fetch the raw SQL report from the backend when the page opens
  useEffect(() => {
    api
      .get('/reports/doctor-summary')
      .then(setSummary)
      .catch((err) => setError(err.message));
  }, []);

  const totalAppointments = useMemo(
    () => summary.reduce((sum, row) => sum + Number(row.totalAppointments), 0),
    [summary]
  );

  return (
    <div>
      <h2>Dashboard</h2>
      <Message type="error" text={error} />

      <div className="cards">
        <div className="card">
          <h3>{doctors.length}</h3>
          <p>Doctors</p>
        </div>
        <div className="card">
          <h3>{patients.length}</h3>
          <p>Patients</p>
        </div>
        <div className="card">
          <h3>{totalAppointments}</h3>
          <p>Appointments</p>
        </div>
      </div>

      <div className="actions">
        <button className="btn" onClick={() => navigate('/appointments')}>
          Book Appointment
        </button>
        <button className="btn" onClick={() => navigate('/prescriptions')}>
          Add Prescription
        </button>
      </div>

      <h3>Appointments per Doctor</h3>
      <DataTable columns={columns} rows={summary} />
    </div>
  );
}

export default Home;
