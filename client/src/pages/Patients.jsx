import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import Message from '../components/Message';

const emptyForm = { name: '', email: '', phone: '', dateOfBirth: '', gender: '' };

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'dateOfBirth', label: 'Date of Birth', render: (row) => formatDate(row.dateOfBirth) },
  { key: 'gender', label: 'Gender' },
];

function Patients() {
  const { patients, loadPatients } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const filteredPatients = useMemo(() => {
    const term = search.toLowerCase();
    return patients.filter(
      (p) => p.name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term)
    );
  }, [patients, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/patients', form);
      setSuccess('Patient added successfully');
      setForm(emptyForm);
      await loadPatients();
      nameRef.current.focus();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (patient) => {
    if (!window.confirm(`Delete ${patient.name}? Their appointments and prescriptions will also be deleted.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await api.delete(`/patients/${patient.id}`);
      setSuccess('Patient deleted successfully');
      await loadPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Patients</h2>
      <Message type="error" text={error} />
      <Message type="success" text={success} />

      <form className="form" onSubmit={handleSubmit}>
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} inputRef={nameRef} />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <FormField label="Phone (10 digits)" name="phone" value={form.phone} onChange={handleChange} />
        <FormField label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
        <FormField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={genderOptions} />
        <button className="btn" type="submit">
          Add Patient
        </button>
      </form>

      <input
        className="search"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <DataTable columns={columns} rows={filteredPatients} onDelete={handleDelete} />
    </div>
  );
}

export default Patients;
