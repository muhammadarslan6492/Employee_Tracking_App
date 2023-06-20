import AdminService from './service';

class Controller {
  constructor() {}

  async createEmploye(req, res) {
    try {
      const { body } = req;
      body.role = 'EMPLOYEE';
      const response = await AdminService.createEmployee(body);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async updateEmployee(req, res) {
    try {
      const { empId } = req.params;
      const { body } = req;
      const response = await AdminService.updateEmployee(empId, body);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async deleteEmployee(req, res) {
    try {
      const response = await AdminService.deleteEmployee(req.param.id);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async blockUser(req, res) {
    try {
      const response = await AdminService.blockEmployee(req.params.empId);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async unBlockUser(req, res) {
    try {
      const response = await AdminService.unBlockEmployee(req.params.empId);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async employeeById(req, res) {
    try {
      const response = await AdminService.employeeById(req.params.empId);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async employees(req, res) {
    try {
      const response = await AdminService.createEmployee(body);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new Controller();
