import request from 'supertest';
const Joi = require('joi');
import { app } from '../../../index';

describe('Authentication API', () => {
  test('should return an error if name is missing', async () => {
    const invalidUser = {
      name: '',
      email: 'test@gmail.com',
      password: 'sdasdasdassd',
    };

    const response = await request(app)
      .post('/api/v1/auth/web-signup')
      .send(invalidUser)
      .expect(400);

    console.log(response.body.error);
    expect(response.body.error).toEqual('Invalid name entered or empty');
  });
  test('should return an error if email is missing or invalid email', async () => {
    const invalidUser = {
      name: 'test',
      email: 'asdasdasdas',
      password: 'sdasdasdassd',
    };

    const response = await request(app)
      .post('/api/v1/auth/web-signup')
      .send(invalidUser)
      .expect(400);

    console.log(response.body.error);
    expect(response.body.error).toEqual('Invalid Email');
  });

  test('should return an error if password is missing or invalid', async () => {
    const invalidUser = {
      name: 'test',
      email: 'test@gmail.com',
      password: '',
    };

    const response = await request(app)
      .post('/api/v1/auth/web-signup')
      .send(invalidUser)
      .expect(400);

    console.log(response.body.error);
    expect(response.body.error).toEqual('Invalid password');
  });

  test('should create a new user and return a success message', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
    };

    await request(app)
      .post('/api/v1/auth/web-signup')
      .send(newUser)
      .expect(201);
  });
});
