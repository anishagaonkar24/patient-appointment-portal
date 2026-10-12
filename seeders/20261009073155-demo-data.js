'use strict';

// date N days from today as YYYY-MM-DD
const daysFromToday = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const stamp = (rows) => rows.map((r) => ({ ...r, createdAt: now, updatedAt: now }));

    await queryInterface.bulkInsert(
      'Doctors',
      stamp([
        { name: 'Dr. Ramesh Naik', specialization: 'Cardiologist', email: 'ramesh.naik@clinic.com', phone: '9876500001', experienceYears: 15 },
        { name: 'Dr. Sneha Kamat', specialization: 'Dermatologist', email: 'sneha.kamat@clinic.com', phone: '9876500002', experienceYears: 8 },
        { name: 'Dr. Arjun Desai', specialization: 'General Physician', email: 'arjun.desai@clinic.com', phone: '9876500003', experienceYears: 12 },
        { name: 'Dr. Priya Fernandes', specialization: 'Pediatrician', email: 'priya.fernandes@clinic.com', phone: '9876500004', experienceYears: 6 },
      ])
    );

    await queryInterface.bulkInsert(
      'Patients',
      stamp([
        { name: 'Rohan Gaonkar', email: 'rohan@mail.com', phone: '9123400001', dateOfBirth: '1995-04-12', gender: 'Male' },
        { name: 'Meera Shet', email: 'meera@mail.com', phone: '9123400002', dateOfBirth: '1988-09-30', gender: 'Female' },
        { name: 'Sanjay Borkar', email: 'sanjay@mail.com', phone: '9123400003', dateOfBirth: '1975-01-05', gender: 'Male' },
        { name: 'Anita Dias', email: 'anita@mail.com', phone: '9123400004', dateOfBirth: '2001-12-20', gender: 'Female' },
      ])
    );

    // read the real ids so foreign keys are always correct
    const [doctors] = await queryInterface.sequelize.query('SELECT id FROM Doctors ORDER BY id');
    const [patients] = await queryInterface.sequelize.query('SELECT id FROM Patients ORDER BY id');

    await queryInterface.bulkInsert(
      'Appointments',
      stamp([
        { doctorId: doctors[0].id, patientId: patients[0].id, appointmentDate: daysFromToday(1), timeSlot: '10:00', reason: 'Chest pain check-up', status: 'Scheduled' },
        { doctorId: doctors[0].id, patientId: patients[2].id, appointmentDate: daysFromToday(1), timeSlot: '11:00', reason: 'Blood pressure follow-up', status: 'Scheduled' },
        { doctorId: doctors[1].id, patientId: patients[1].id, appointmentDate: daysFromToday(2), timeSlot: '09:30', reason: 'Skin allergy', status: 'Scheduled' },
        { doctorId: doctors[2].id, patientId: patients[3].id, appointmentDate: daysFromToday(3), timeSlot: '14:00', reason: 'Fever and cold', status: 'Scheduled' },
        { doctorId: doctors[2].id, patientId: patients[0].id, appointmentDate: daysFromToday(-5), timeSlot: '16:00', reason: 'Fever', status: 'Completed' },
        { doctorId: doctors[3].id, patientId: patients[1].id, appointmentDate: daysFromToday(-2), timeSlot: '12:00', reason: 'Child vaccination', status: 'Cancelled' },
      ])
    );

    await queryInterface.bulkInsert(
      'PrescriptionLogs',
      stamp([
        { patientId: patients[0].id, doctorId: doctors[2].id, medicine: 'Paracetamol 500mg', dosage: '1 tablet twice a day', durationDays: 5, instructions: 'Take after meals', issuedDate: daysFromToday(-5) },
        { patientId: patients[0].id, doctorId: doctors[2].id, medicine: 'Cetirizine 10mg', dosage: '1 tablet at night', durationDays: 3, instructions: 'May cause drowsiness', issuedDate: daysFromToday(-5) },
        { patientId: patients[2].id, doctorId: doctors[0].id, medicine: 'Amlodipine 5mg', dosage: '1 tablet once a day', durationDays: 30, instructions: 'Take in the morning', issuedDate: daysFromToday(-10) },
        { patientId: patients[1].id, doctorId: doctors[1].id, medicine: 'Hydrocortisone cream', dosage: 'Apply twice daily', durationDays: 7, instructions: 'Apply on affected area only', issuedDate: daysFromToday(-20) },
      ])
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('PrescriptionLogs', null, {});
    await queryInterface.bulkDelete('Appointments', null, {});
    await queryInterface.bulkDelete('Patients', null, {});
    await queryInterface.bulkDelete('Doctors', null, {});
  },
};