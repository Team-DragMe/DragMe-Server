const request = require('supertest');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = require('../src/index');

beforeAll(async () => {
  console.log('DRAG.ME API TEST - Route Schedule');
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Mongoose Connected ...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});

describe('일간 계획블록 리스트 조회 [GET] /schedule/days?date=', () => {
  it('200 - 일간 계획블록 리스트 조회 성공', async () => {
    await request(app)
      .get('/schedule/days')
      .set('Content-Type', 'application/json')
      .query({ date: '2022-05-30' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('400 - 필요한 값이 없습니다', async () => {
    await request(app)
      .get('/schedule/days')
      .set('Content-Type', 'application/json')
      .expect(400);
  });
});

describe('미뤄진 계획블록 목록 조회 [GET] /schedule/delay', () => {
  it('200 - 미룬 계획블록 리스트 조회 성공', async () => {
    await request(app)
      .get('/schedule/delay')
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log('Mongoose Disconnected!');
});
