import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Message from './components/Message';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';

function App() {
  const { loading, error } = useApp();

  return (
    <>
      <Navbar />
      <main className="container">
        {loading && <p className="empty">Loading data...</p>}
        <Message type="error" text={error} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
