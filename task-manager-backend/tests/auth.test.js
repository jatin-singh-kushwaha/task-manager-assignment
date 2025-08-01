const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

beforeEach(async () => {
  await User.deleteMany();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe('User registered successfully'); // ✅ fix
  });

  it('should fail to register duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    expect(res.statusCode).toBe(400);
  });

  it('should login and return a token', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fail login with wrong password', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    expect(res.statusCode).toBe(400);
  });

  it('should fail login for non-existing user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexist@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toBe(400);
  });
});
