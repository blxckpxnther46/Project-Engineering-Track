
const request = require('supertest');
const app = require('../src/app');

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    note: {
      create: jest.fn(),
      findUnique: jest.fn()
    }
  }))
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeEach(() => {
  jest.clearAllMocks();
});

test('POST creates note', async () => {
  prisma.note.create.mockResolvedValue({ id: 1, title: 'Test' });
  const res = await request(app).post('/api/notes').send({ title: 'Test' });
  expect(res.status).toBe(201);
});

test('GET returns note', async () => {
  prisma.note.findUnique.mockResolvedValue({ id: 1, title: 'Test' });
  const res = await request(app).get('/api/notes/1');
  expect(res.status).toBe(200);
});

test('GET 404 if missing', async () => {
  prisma.note.findUnique.mockResolvedValue(null);
  const res = await request(app).get('/api/notes/1');
  expect(res.status).toBe(404);
});

test('POST 422 if invalid', async () => {
  const res = await request(app).post('/api/notes').send({});
  expect(res.status).toBe(422);
});

test('GET 404 invalid id', async () => {
  const res = await request(app).get('/api/notes/abc');
  expect(res.status).toBe(404);
});
