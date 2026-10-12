import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import Message from '../components/Message';

const emptyForm = {
  patientId: '',
  doctorId: '',
  medicine: '',
  dosage: '',
  durationDays: '',
  instructions: '',
};

function Prescriptions() {
  const { doctors, patients } = useApp();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientFilter, setPatientFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const medicineRef = useRef(null);

  const doctorOptions = doctors.map((d) => ({ value: d.id, label: d.name }));
  const patientOptions = patients.map((p) => ({ value: p.id, label: p.name }));

  // Fetch prescription logs (the patient filter is sent as a query parameter)
  const loadPrescriptions = useCallback(async () => {
    try {
      const query = patientFilter ? `?patientId=${patientFilter}` : '';
      const data = await api.get(`/prescriptions${query}`);
      setPrescriptions(data);
    } catch (err) {
      setError(err.message);
    }
  }, [patientFilter]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/prescriptions', {
        ...form,
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        durationDays: Number(form.durationDays),
      });
      setSuccess('Prescription added successfully');
      setForm(emptyForm);
      await loadPrescriptions();
      medicineRef.current.focus();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (prescription) => {
    if (!window.confirm('Delete this prescription log?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/prescriptions/${prescription.id}`);
      setSuccess('Prescription deleted successfully');
      await loadPrescriptions();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'patient', label: 'Patient', render: (row) => row.patient?.name },
    { key: 'doctor', label: 'Prescribed By', render: (row) => row.doctor?.name },
    { key: 'medicine', label: 'Medicine' },
    { key: 'dosage', label: 'Dosage' },
    { key: 'durationDays', label: 'Days' },
    { key: 'issuedDate', label: 'Issued', render: (row) => formatDate(row.issuedDate) },
    { key: 'instructions', label: 'Instructions' },
  ];

  return (
    <div>
      <h2>Prescription Logs</h2>
      <Message type="error" text={error} />
      <Message type="success" text={success} />

      <form className="form" onSubmit={handleSubmit}>
        <FormField label="Patient" name="patientId" value={form.patientId} onChange={handleChange} options={patientOptions} />
        <FormField label="Doctor" name="doctorId" value={form.doctorId} onChange={handleChange} options={doctorOptions} />
        <FormField label="Medicine" name="medicine" value={form.medicine} onChange={handleChange} inputRef={medicineRef} />
        <FormField label="Dosage" name="dosage" value={form.dosage} onChange={handleChange} placeholder="e.g. 1 tablet twice a day" />
        <FormField label="Duration (days)" name="durationDays" type="number" value={form.durationDays} onChange={handleChange} />
        <FormField label="Instructions" name="instructions" value={form.instructions} onChange={handleChange} />
        <button className="btn" type="submit">
          Add Prescription
        </button>
      </form>

      <div className="filter">
        <label>
          Filter by patient:{' '}
          <select value={patientFilter} onChange={(e) => setPatientFilter(e.target.value)}>
            <option value="">All</option>
            {patientOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <DataTable columns={columns} rows={prescriptions} onDelete={handleDelete} />
    </div>
  );
}

export default Prescriptions;
