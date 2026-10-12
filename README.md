# Patient Appointment Management Portal: API Documentation (ISA-II)

Base URL: `http://localhost:5000`

## Doctors
| Method | URL | Description | Success | Errors |
|---|---|---|---|---|
| GET | /api/doctors | List doctors (`?specialization=`) | 200 | 500 |
| GET | /api/doctors/:id | Doctor with appointments | 200 | 404 |
| POST | /api/doctors | Create doctor | 201 | 400, 409 |
| PUT | /api/doctors/:id | Update doctor | 200 | 400, 404, 409 |
| DELETE | /api/doctors/:id | Delete doctor | 200 | 404 |

Example payload:
```json
{ "name": "Dr. Kavita Rao", "specialization": "Neurologist", "email": "kavita.rao@clinic.com", "phone": "9876500010", "experienceYears": 10 }
```

## Patients
| Method | URL | Description | Success | Errors |
|---|---|---|---|---|
| GET | /api/patients | List patients | 200 | 500 |
| GET | /api/patients/:id | Patient with appointments and prescriptions | 200 | 404 |
| POST | /api/patients | Create patient | 201 | 400, 409 |
| PUT | /api/patients/:id | Update patient | 200 | 400, 404, 409 |
| DELETE | /api/patients/:id | Delete patient | 200 | 404 |

Example payload:
```json
{ "name": "Kiran Patil", "email": "kiran@mail.com", "phone": "9123400010", "dateOfBirth": "1999-03-15", "gender": "Male" }
```

## Appointments
| Method | URL | Description | Success | Errors |
|---|---|---|---|---|
| GET | /api/appointments | List with filters: `status, doctorId, patientId, from, to, search` | 200 | 500 |
| GET | /api/appointments/:id | Single appointment with doctor and patient | 200 | 404 |
| POST | /api/appointments | Book appointment | 201 | 400, 404, 409 |
| PUT | /api/appointments/:id | Update appointment or change status | 200 | 400, 404, 409 |
| DELETE | /api/appointments/:id | Delete appointment | 200 | 404 |

Example payload:
```json
{ "doctorId": 1, "patientId": 2, "appointmentDate": "2026-12-15", "timeSlot": "15:30", "reason": "Routine heart check" }
```

Example filter: `GET /api/appointments?status=Scheduled&doctorId=1&from=2026-10-01&to=2026-12-31`

## Prescription Logs
| Method | URL | Description | Success | Errors |
|---|---|---|---|---|
| GET | /api/prescriptions | List (`?patientId=&doctorId=`) | 200 | 500 |
| GET | /api/prescriptions/:id | Single log | 200 | 404 |
| POST | /api/prescriptions | Add prescription | 201 | 400, 404 |
| PUT | /api/prescriptions/:id | Update prescription | 200 | 400, 404 |
| DELETE | /api/prescriptions/:id | Delete prescription | 200 | 404 |

Example payload:
```json
{ "patientId": 1, "doctorId": 1, "medicine": "Aspirin 75mg", "dosage": "1 tablet daily", "durationDays": 30, "instructions": "Take after breakfast" }
```

## Report (Raw SQL)
| Method | URL | Description | Success | Errors |
|---|---|---|---|---|
| GET | /api/reports/doctor-summary | Appointment counts per doctor by status | 200 | 500 |

## HTTP Status Response Behavior
- 200 OK: request succeeded (fetch, update, delete)
- 201 Created: new record created
- 400 Bad Request: validation failed or invalid doctorId/patientId
- 404 Not Found: record does not exist
- 409 Conflict: duplicate email or doctor already booked for that date and time slot
- 500 Internal Server Error: unexpected server error