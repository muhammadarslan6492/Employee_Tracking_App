import AdminService from './service';

class Controller {
  constructor() {}
  // *** employee start ****
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
      let param = {};
      let { limit, skip, email, name, position } = req.query;
      if (!limit) {
        limit = process.env.LIMIT;
      }
      if (!skip) {
        skip = process.env.SKIP;
      }
      console.log(email, name, position);
      if (email) {
        param.email = email;
      }
      if (name) {
        param.name = name;
      }
      if (position) {
        param.position = position;
      }
      const pagination = { limit: parseInt(limit), skip: parseInt(skip) };
      const response = await AdminService.getEmployees(param, pagination);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  // **** employee end ****

  async createGeofance(req, res) {
    try {
      const { address, radius, lat, lng } = req.body;
      const paylod = { address, radius, lat, lng };
      const response = await AdminService.createGeofance(paylod);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async updateGeofacnce(req, res) {
    try {
      const { body } = req;
      const { geoId } = req.params;
      const response = await AdminService.updateGeofance(geoId, body);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async geofanceById(req, res) {
    try {
      const { geoId } = req.params;
      const response = await AdminService.geofanceById(geoId);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async allGeofance(req, res) {
    try {
      const response = await AdminService.allGeofance();
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  async deleteGeoface(req, res) {
    try {
      const { geoId } = req.params;
      const response = await AdminService.deleteGeofance(geoId);
      return res.status(response.statusCode).json(response);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new Controller();
