import express from 'express';

import auth from '../middleware/auth';
import { Admin } from '../middleware/role';
import AdminController from './controller';

const router = express.Router();

router.post('/employee', auth, Admin, AdminController.createEmploye);
router.get('/employee', auth, Admin, AdminController.employees);
router.get('/employee/:empId', auth, Admin, AdminController.employeeById);
router.get('/employee/:empId/block', auth, Admin, AdminController.blockUser);
router.get(
  '/employee/:empId/unblock',
  auth,
  Admin,
  AdminController.unBlockUser,
);
router.put('/employee/:empId', auth, Admin, AdminController.updateEmployee);
router.delete('/employee/:empId', auth, Admin, AdminController.deleteEmployee);

export default router;
