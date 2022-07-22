const request = require('supertest');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = require('../src/index');

beforeAll(async () => {
  console.log('DRAG.ME API TEST START - Route Information');
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Mongoose Connected ...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});

describe('일간 계획 정보 조회 [GET] /information/days?date=', () => {
    it('200 - 일간 계획 정보 조회 성공', async () => {
      await request(app)
        .get('/information/days')
        .set('Content-Type', 'application/json')
        .query({ date: '2022-07-22' })
        .expect(200)
        .expect('Content-Type', /json/);
    });
  
    it('400 - 필요한 값이 없습니다', async () => {
      await request(app)
        .get('/information/days')
        .set('Content-Type', 'application/json')
        .expect(400);
    });
  });

  describe('정보 작성 [POST] /information', () => {
    it('201 - 정보 작성 성공', async () => {
      await request(app)
        .post('/information')
        .set('Content-Type', 'application/json')
        .send({
            date : "2022-07-13",
            type: "memo",
            value : "이렇게 하면 한방에 되지롱"
        })
        .expect(201)
        .expect('Content-Type', /json/);
    });
  });


afterAll(async () => {
    await mongoose.connection.close();
    console.log('Mongoose Disconnected!');
    console.log('DRAG.ME API TEST COMPLETE - Route Information');
  });
