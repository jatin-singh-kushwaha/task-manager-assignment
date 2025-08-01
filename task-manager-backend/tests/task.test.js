const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

let token;
let createdTaskId;

jest.setTimeout(20000);

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/taskapp_test');

  await User.deleteMany();
  await Task.deleteMany();

  await request(app).post('/api/auth/register').send({
    email: 'testtaskuser@example.com',
    password: 'taskpass123',
    role: 'admin'
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'testtaskuser@example.com',
    password: 'taskpass123'
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

describe('Task Management', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
    expect(res.body.status).toBe('pending');
    createdTaskId = res.body._id;
  });

  it('should fetch all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });

  it('should update the created task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Task Title',
        status: 'completed'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Task Title');
    expect(res.body.status).toBe('completed');
  });

  it('should get a single task by ID', async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(createdTaskId);
  });

  it('should delete the created task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe('Task deleted successfully');
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(app)
      .get(`/api/tasks/64e1f7f8b2cd2d06c1f74abc`) // dummy ID
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
