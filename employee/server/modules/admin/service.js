import Repo from '../repo/index';
import { Conflict, BadRequest, NotFound } from 'fejl';
import * as bcrypt from 'bcrypt';

import { generatePassword } from '../helper/utils';
import RabbitConnection from '../../config/rabbitmq';

import {
  User,
  Task,
  Employee,
  Location,
  Geofance,
  Aduit,
  Notification,
} from '../models/index';

class AdminService {
  constructor() {
    this.User = new Repo(User);
    this.Task = new Repo(Task);
    this.Employee = new Repo(Employee);
    this.Locations = new Repo(Location);
    this.Geofance = new Repo(Geofance);
    this.Aduit = new Repo(Aduit);
    this.Notification = new Repo(Notification);
  }

  generateRandomCoordinates(centerLat, centerLng, radius) {
    // Convert radius from meters to degrees
    const radiusInDegrees = radius / 111300;

    const u = Math.random();
    const v = Math.random();
    const w = radiusInDegrees * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    // Adjust the x-coordinate for the desired center point
    const newX = x / Math.cos(centerLat);

    const foundLongitude = newX + centerLng;
    const foundLatitude = y + centerLat;

    return { latitude: foundLatitude, longitude: foundLongitude };
  }

  async createEmployee(payload, reportsTo) {
    const checkExisted = await this.User.findOne({ email: payload.email });
    if (checkExisted) {
      throw new Conflict('User alredy existed');
    }
    payload.password = generatePassword();
    const hash = await bcrypt.hash(payload.password, 10);
    const emailDate = {
      email: payload.email,
      password: payload.password,
      message:
        'Your are register in XXYYZZ company, Please signin with these credentials',
    };
    payload.password = hash;
    payload.verify = true;

    const user = await this.User.create(payload);
    if (!user) {
      throw new Conflict('User not created something went wrong');
    }
    const empData = {
      userId: user._id,
      contact: payload.contact,
      position: payload.position,
      reportsTo: reportsTo,
    };
    const employee = await this.Employee.create(empData);
    //EMP_CREATION_QUEUE
    RabbitConnection.generateNotification(
      emailDate,
      process.env.EMP_CREATION_QUEUE,
    );

    return {
      success: true,
      statusCode: 201,
      message: 'Employee created Successfully',
    };
  }

  async updateEmployee(empId, payload) {
    const employee = await this.Employee.findOne({ _id: empId });
    if (!employee) {
      throw new Conflict('Employee not exist with this emp_id');
    }
    await this.Employee.updateRecode({ _id: empId }, payload);
    return {
      success: true,
      statusCode: 200,
      message: 'Employee updated Successfully',
    };
  }

  async deleteEmployee(id) {
    const employee = await this.Employee.findOne({ _id: id });
    if (!employee) {
      throw new Conflict('Employee not exist with this emp_id');
    }
    await this.Employee.deleteRecord({ _id: id });
    return {
      success: true,
      statusCode: 200,
      message: 'Employee deleted Successfully',
    };
  }

  async employeeById(id) {
    let employee = await this.Employee.findOne({ _id: id });
    if (!employee) {
      throw new Conflict('Employee not exist with this emp_id');
    }
    const populate = {
      path: 'userId reportsTo',
      select: 'name email',
    };
    employee = await this.Employee.findOne({ _id: id }, populate);
    console.log(employee);
    return {
      success: true,
      statusCode: 200,
      message: 'Employee fetch Successfully',
      employee,
    };
  }

  async blockEmployee(empId) {
    const employee = await this.Employee.findOne({ _id: empId });
    if (!employee) {
      throw new Conflict('Employee not exist with this emp_id');
    }
    await this.User.updateRecode({ _id: employee.userId }, { block: true });
    return {
      success: true,
      statusCode: 200,
      message: 'Employee Block Successfully',
    };
  }

  async unBlockEmployee(empId) {
    const employee = await this.Employee.findOne({ _id: empId });
    if (!employee) {
      throw new Conflict('Employee not exist with this emp_id');
    }
    await this.User.updateRecode({ _id: employee.userId }, { block: false });
    return {
      success: true,
      statusCode: 200,
      message: 'Employee unblock Successfully',
    };
  }

  async getEmployees(param, pagination) {
    const matchFilter = param;
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ['$user', 0] }, '$$ROOT'],
          },
        },
      },
      {
        $match: matchFilter,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          position: 1,
          verify: 1,
          block: 1,
          contact: 1,
          reportsTo: 1,
        },
      },
      {
        $facet: {
          metadata: [
            { $count: 'totalRecords' },
            {
              $addFields: {
                TotalPages: {
                  $ceil: { $divide: ['$totalRecords', pagination.limit] },
                },
              },
            },
          ],
          data: [{ $skip: pagination.skip }, { $limit: pagination.limit }],
        },
      },
    ];

    const employee = await this.Employee.aggr(pipeline);

    return {
      success: true,
      statusCode: 200,
      message: 'Employee unblock Successfully',
      employee,
    };
  }

  async addTestEmployee(arrData, reportsTo) {
    const empArr = arrData.map((item) => {
      item.password = generatePassword(item.password);
      return item;
    });
    const users = await this.User.create(arrData);

    const employeeDate = users.map((user, index) => {
      const data = {
        userId: user._id,
        contact: empArr[index].contact,
        position: empArr[index].position,
        reportsTo: reportsTo,
      };
      return data;
    });

    const { response } = await this.Employee.insertMany(employeeDate);

    return {
      success: true,
      statusCode: 200,
      message: 'Employee created Successfully',
      employees: response,
    };
  }

  async createGeofance(data) {
    const response = await this.Geofance.create(data);
    return {
      success: true,
      statusCode: 201,
      message: 'Geofance Created successfully',
      geoFanceId: response,
    };
  }
  async updateGeofance(id, data) {
    const geofance = await this.Geofance.findOne({ _id: id });
    if (!geofance) {
      throw new Conflict('Geofance dose not exist with this id');
    }
    await this.Geofance.updateRecode({ _id: id }, data);
    return {
      success: true,
      statusCode: 201,
      message: 'Geofance updated successfully',
    };
  }
  async deleteGeofance(id) {
    const geofance = await this.Geofance.findOne({ _id: id });
    if (!geofance) {
      throw new Conflict('Geofance dose not exist with this id');
    }
    await this.Geofance.deleteRecord({ _id: id });
    return {
      success: true,
      statusCode: 201,
      message: 'Geofance deleted successfully',
    };
  }
  async geofanceById(id) {
    const geofance = await this.Geofance.findOne({ _id: id });
    if (!geofance) {
      throw new Conflict('Geofance dose not exist with this id');
    }
    return {
      success: true,
      statusCode: 201,
      message: 'Geofance fetch successfully',
      geofance,
    };
  }
  async allGeofance(param) {
    const geofance = await this.Geofance.findAll(param);
    return {
      success: true,
      statusCode: 201,
      message: 'Geofance data fetched successfully',
      geofance: geofance.response,
    };
  }
  async checkLocationInRadius(geoId, lat, lng) {
    const geofance = await this.Geofance.findOne({ _id: geoId });
    if (!geofance) {
      throw new NotFound('Geofance not found with this Id');
    }

    const randomCoordinates = this.generateRandomCoordinates(
      geofance.location.coordinates[0],
      geofance.location.coordinates[1],
      1000,
    );

    console.log(randomCoordinates);

    const checkGeofance = await this.Geofance.findOne({
      _id: geoId,
      location: {
        $geoWithin: {
          $centerSphere: [[lat, lng], 0.001], // Radius in radians (adjust as needed)
        },
      },
    });

    if (!checkGeofance) {
      throw new NotFound('Geofance not found with this Id');
    }

    return {
      success: true,
      statusCode: 201,
      message: 'Geofance data fetched successfully',
      checkGeofance,
    };
  }
  async createTask(data) {
    const task = this.Task.create(data);
    return {
      success: true,
      statusCode: 201,
      message: 'Task created successfully',
      task,
    };
  }
  async taskById(id) {
    const task = this.Task.findOne({ _id: id });
    if (!task) {
      throw new Conflict('Task not found with this id');
    }
    return {
      success: true,
      statusCode: 201,
      message: 'Task fetched successfully',
      task,
    };
  }
  async deleteTask(id) {
    const task = this.Task.deleteRecord({ _id: id });
    if (!task) {
      throw new Conflict('Task not found with this id');
    }
    return {
      success: true,
      statusCode: 201,
      message: 'Task task delete successfully',
    };
  }
  async updateTask(id, data) {
    const task = this.Task.updateRecode({ _id: id }, updateTask);
    if (!task) {
      throw new Conflict('Task not found with this id');
    }
    return {
      success: true,
      statusCode: 201,
      message: 'Task task delete successfully',
    };
  }
}
export default new AdminService();
