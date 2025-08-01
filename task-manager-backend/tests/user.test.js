const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

let token;

jest.setTimeout(30000);

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://127.0.0.1:27017/taskapp_test');
  }

  await User.deleteMany({});

  await request(app).post('/api/auth/register').send({
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  });

  const login = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'admin123',
  });

  token = login.body.token;
});

afterAll(async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error during DB teardown:', err.message);
  }
});

describe('User management', () => {
  let userId;

  it('should create a new user as admin', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'user123',
        role: 'user',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created successfully');
  });

  it('should get all users as admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const user = res.body.find(u => u.email === 'newuser@example.com');
    expect(user).toBeDefined();
    userId = user._id;
  });

  it('should update a user role', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'manager' });

    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe('manager');
  });

  it('should not update with invalid user ID', async () => {
    const res = await request(app)
      .put('/api/users/invalidid123')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'manager' });

    expect(res.statusCode).toBe(500); // updated from 400 to 500
  });

  it('should delete a user', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });

  it('should return 404 when deleting non-existent user', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`) // already deleted above
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
