import Repo from '../repo/index';
import { Conflict } from 'fejl';
import * as bcrypt from 'bcrypt';

import { User } from '../models/index';
import RabbitConnection from '../../config/rabbitmq';
class AuthService extends Repo {
  constructor() {
    super(User);
  }

  async createUser(obj) {
    let response = await this.findOne({ email: obj.email });
    console.log(response);
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
}

export default new AuthService();
