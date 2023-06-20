import amqp from 'amqplib';

import socketServer from './socket';
import mail from './utils/email';
import EmployeeRegisterationEmail from './utils/employeeSignup';

class RabbitConnection {
  constructor() {
    RabbitConnection.createConnection();
    this.connection = null;
    this.channel = null;
  }

  static getInstance() {
    if (!RabbitConnection.instance) {
      RabbitConnection.instance = new RabbitConnection();
    }
    return RabbitConnection.instance;
  }

  // create connection to rabbitmq

  static async createConnection() {
    try {
      this.connection = await amqp.connect('amqp://guest:guest@localhost:5672');
      console.log('notification rabbitmq connection establish');
      this.channel = await this.connection.createChannel();
      this.channel.assertQueue(process.env.NOTIFICATION_QUEUE);
      this.channel.assertQueue(process.env.EMAIL_QUEUE);
      this.channel.assertQueue(process.env.ADMIN_NOTIFICATION);
      this.channel.assertQueue(process.env.EMP_CREATION_QUEUE);

      // consumer functions for admin
      this.channel
        .consume(process.env.ADMIN_NOTIFICATION, (data) => {
          const recive = JSON.parse(data.content);
          console.log('this is for admin', recive);
          this.channel.ack(data);
        })
        .catch((err) => {
          console.log(err);
        });

      this.channel
        .consume(process.env.EMAIL_QUEUE, async (data) => {
          const recievedData = JSON.parse(data.content);
          console.log(recievedData);
          const mailData = {
            email: recievedData.email,
            id: recievedData.id,
          };
          await mail(mailData.email, mailData);
          this.channel.ack(data);
        })
        .catch((err) => {
          console.log(err);
        });

      //// this is employee creatiation emial
      this.channel
        .consume(process.env.EMP_CREATION_QUEUE, async (data) => {
          const recievedData = JSON.parse(data.content);
          console.log('recievedData', recievedData);
          const mailData = {
            email: recievedData.email,
            password: recievedData.password,
            message: recievedData.message,
          };
          await EmployeeRegisterationEmail(mailData);
          this.channel.ack(data);
        })
        .catch((err) => {
          console.log(err);
        });

      /////
    } catch (error) {
      console.log(error);
    }
  }
}

export default RabbitConnection;
