module.exports = (res, err) => {
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((e) => e.message),
    });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Duplicate entry',
      errors: err.errors.length
        ? err.errors.map((e) => e.message)
        : ['This record conflicts with an existing one (e.g. doctor already booked for that slot)'],
    });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'Invalid doctorId or patientId' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
};