import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import { useApp } from '../context/AppContext';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import Message from '../components/Message';

const emptyForm = { name: '', specialization: '', email: '', phone: '', experienceYears: '' };

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'specialization', label: 'Specialization' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'experienceYears', label: 'Experience (yrs)' },
];

function Doctors() {
  const { doctors, loadDoctors } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nameRef = useRef(null);

  // Put the cursor in the first field when the page opens
  useEffect(() => {
    nameRef.current.focus();
  }, []);

  // Only recalculate the filtered list when doctors or the search text change
  const filteredDoctors = useMemo(() => {
    const term = search.toLowerCase();
    return doctors.filter(
      (d) => d.name.toLowerCase().includes(term) || d.specialization.toLowerCase().includes(term)
    );
  }, [doctors, search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/doctors', {
        ...form,
        experienceYears: form.experienceYears === '' ? undefined : Number(form.experienceYears),
      });
      setSuccess('Doctor added successfully');
      setForm(emptyForm);
      await loadDoctors();
      nameRef.current.focus();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (doctor) => {
    if (!window.confirm(`Delete ${doctor.name}? Their appointments and prescriptions will also be deleted.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await api.delete(`/doctors/${doctor.id}`);
      setSuccess('Doctor deleted successfully');
      await loadDoctors();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Doctors</h2>
      <Message type="error" text={error} />
      <Message type="success" text={success} />

      <form className="form" onSubmit={handleSubmit}>
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} inputRef={nameRef} />
        <FormField label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <FormField label="Phone (10 digits)" name="phone" value={form.phone} onChange={handleChange} />
        <FormField label="Experience (years)" name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} />
        <button className="btn" type="submit">
          Add Doctor
        </button>
      </form>

      <input
        className="search"
        placeholder="Search by name or specialization"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <DataTable columns={columns} rows={filteredDoctors} onDelete={handleDelete} />
    </div>
  );
}

export default Doctors;
