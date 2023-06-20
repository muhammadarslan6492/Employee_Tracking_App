const Admin = (req, res, next) => {
  if (req.user.role === 'ADMIN') {
    return next();
  }
  return res.status(401).json({ msg: 'Unauthorized' });
};

const Employee = (req, res, next) => {
  if (req.user.role === 'EMPLOYEE') {
    return next();
  }
  return res.status(401).json({ msg: 'Unauthorized' });
};

export { Admin, Employee };
