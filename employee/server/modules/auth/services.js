import Repo from '../repo/index';
import { Conflict, BadRequest, NotFound } from 'fejl';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/index';
import RabbitConnection from '../../config/rabbitmq';
class AuthService extends Repo {
  constructor() {
    super(User);
  }

  async createUser(obj) {
    let response = await this.findOne({ email: obj.email });
    if (response) {
      throw new Conflict('User already existed in the system');
    }
    const hash = await bcrypt.hash(obj.password, 10);
    obj.password = hash;
    response = await this.create(obj);
    const user = response.toJSON();
    delete user.password;
    delete user.__v;

    // ADD RABBIRMQ NOT NOTIFICATION
    const notificationdata = {
      email: user.email,
      id: user._id,
      message: 'this is test email message',
    };
    RabbitConnection.generateNotification(
      notificationdata,
      process.env.NOTIFICATION_QUEUE,
    );
    return {
      status: true,
      statusCode: 201,
      message: 'user created successfully',
      user,
    };
  }

  async verifyAccount(token) {
    const decoded = jwt.decode(token, process.env.JWT);
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new Conflict('Your link is expired');
    }
    let user = await this.findOne({ _id: decoded.id, verify: false });
    if (user && user.verify === true) {
      throw new Conflict('User already verified');
    }
    user = await this.updateRecode({ _id: decoded.id }, { verify: true });

    return {
      status: true,
      statusCode: 200,
      message: 'user verified................',
    };
  }

  async resendVerification(email) {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Conflict('User not exist with this email');
    }
    const notificationdata = {
      email: user.email,
      id: user._id,
      message: 'this is resend email',
    };

    RabbitConnection.generateNotification(
      notificationdata,
      process.env.NOTIFICATION_QUEUE,
    );

    return {
      status: true,
      statusCode: 200,
      message: 'Email verification link send to you email',
    };
  }

  async login(email, password) {
    let user = await this.findOne({ email });
    if (!user) {
      throw new NotFound('User not exist with this email or password');
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      throw new NotFound('User not exist with this email or password');
    }
    if (!user.verify) {
      throw new Conflict('Your account not verified yet');
    }
    if (user.role === 'Employee') {
      const notificationdata = {
        user: { id: user._id, email: user.email, time: Date.now() },
        message: 'User login to the system',
      };
      RabbitConnection.generateNotification(
        notificationdata,
        process.env.ADMIN_NOTIFICATION,
      );
    }
    await this.updateRecode(
      { _id: user._id },
      { online: true, lastLogin: Date.now() },
    );
    user = user.toJSON();
    delete user.password;
    delete user.lastLogin;

    const token = jwt.sign(user, process.env.JWT);

    return {
      status: true,
      statusCode: 200,
      user,
      token,
      message: 'User successfully login',
    };
  }

  async logout(token) {}
}

export default new AuthService();
