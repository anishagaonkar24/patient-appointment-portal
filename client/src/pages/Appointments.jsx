import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import Message from '../components/Message';

const statuses = ['Scheduled', 'Completed', 'Cancelled'];

const emptyForm = { doctorId: '', patientId: '', appointmentDate: '', timeSlot: '', reason: '' };

function Appointments() {
  const { doctors, patients } = useApp();
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const reasonRef = useRef(null);

  const doctorOptions = doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialization})` }));
  const patientOptions = patients.map((p) => ({ value: p.id, label: p.name }));

  // Fetch appointments from the backend (the status filter is sent as a query parameter)
  const loadAppointments = useCallback(async () => {
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const data = await api.get(`/appointments${query}`);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    }
  }, [statusFilter]);

  // Runs when the page opens and every time the filter changes
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/appointments', {
        ...form,
        doctorId: Number(form.doctorId),
        patientId: Number(form.patientId),
      });
      setSuccess('Appointment booked successfully');
      setForm(emptyForm);
      await loadAppointments();
      reasonRef.current.focus();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (appointment, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/appointments/${appointment.id}`, { status: newStatus });
      setSuccess('Appointment status updated');
      await loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (appointment) => {
    if (!window.confirm('Delete this appointment?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/appointments/${appointment.id}`);
      setSuccess('Appointment deleted successfully');
      await loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'doctor', label: 'Doctor', render: (row) => row.doctor?.name },
    { key: 'patient', label: 'Patient', render: (row) => row.patient?.name },
    { key: 'appointmentDate', label: 'Date', render: (row) => formatDate(row.appointmentDate) },
    { key: 'timeSlot', label: 'Time' },
    { key: 'reason', label: 'Reason' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <select value={row.status} onChange={(e) => handleStatusChange(row, e.target.value)}>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div>
      <h2>Appointments</h2>
      <Message type="error" text={error} />
      <Message type="success" text={success} />

      <form className="form" onSubmit={handleSubmit}>
        <FormField label="Doctor" name="doctorId" value={form.doctorId} onChange={handleChange} options={doctorOptions} />
        <FormField label="Patient" name="patientId" value={form.patientId} onChange={handleChange} options={patientOptions} />
        <FormField label="Date" name="appointmentDate" type="date" value={form.appointmentDate} onChange={handleChange} />
        <FormField label="Time" name="timeSlot" type="time" value={form.timeSlot} onChange={handleChange} />
        <FormField label="Reason" name="reason" value={form.reason} onChange={handleChange} inputRef={reasonRef} />
        <button className="btn" type="submit">
          Book Appointment
        </button>
      </form>

      <div className="filter">
        <label>
          Filter by status:{' '}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <DataTable columns={columns} rows={appointments} onDelete={handleDelete} />
    </div>
  );
}

export default Appointments;
