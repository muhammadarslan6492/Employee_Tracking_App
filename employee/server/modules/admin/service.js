import Repo from '../repo/index';
import { Conflict, BadRequest, NotFound } from 'fejl';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { generatePassword } from '../helper/utils';
import RabbitConnection from '../../config/rabbitmq';

import {
  User,
  Task,
  Employee,
  Locations,
  Geofance,
  Aduit,
  Notification,
} from '../models/index';

class AdminService {
  constructor() {
    this.User = new Repo(User);
    this.Tash = new Repo(Task);
    this.Employee = new Repo(Employee);
    this.Locations = new Repo(Locations);
    this.Geofance = new Repo(Geofance);
    this.Aduit = new Repo(Aduit);
    this.Notification = new Repo(Notification);
  }

  async createEmployee(payload) {
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
      reportsTo: '648f60d3239065cf76c74d6a',
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

  async blockEmployee(empId, payload) {
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
}

export default new AdminService();
