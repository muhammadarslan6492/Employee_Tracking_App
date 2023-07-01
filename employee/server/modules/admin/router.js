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
router.post(
  '/add-test-employees',
  auth,
  Admin,
  AdminController.addTestEmployee,
);

router.post('/geoface', auth, Admin, AdminController.createGeofance);
router.get('/geofance', auth, Admin, AdminController.allGeofance);
router.get('/geofance/:geoId', auth, Admin, AdminController.geofanceById);
router.put('/geofance/:geoId', auth, Admin, AdminController.updateGeofacnce);
router.delete('/geofance/:geoId', auth, Admin, AdminController.deleteGeoface);
router.put(
  '/geofance/:geoId/validate-geofance-radius',
  auth,
  Admin,
  AdminController.validateGeofance,
);

router.get('/task/stats', auth, Admin, AdminController.taskStats);
router.post('/task', auth, Admin, AdminController.createTask);
router.get('/task', auth, Admin, AdminController.allTask);
router.put('/task/:taskId', auth, Admin, AdminController.updateTask);
router.get('/task/:taskId', auth, Admin, AdminController.taskById);
router.delete('/task/:taskId', auth, Admin, AdminController.deleteTask);

export default router;
