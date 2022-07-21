const request = require('supertest');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const app = require('../src/index');

beforeAll(async () => {
  console.log('DRAG.ME API TEST START - Route Schedule');
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

describe('미룬 계획블록 리스트 조회 [GET] /schedule/delay', () => {
  it('200 - 미룬 계획블록 리스트 조회 성공', async () => {
    await request(app)
      .get('/schedule/delay')
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});

describe('계획블록 미루기 [PATCH] /schedule/day-reschedule?scheduleId=', () => {
  it('200 - 계획블록 미루기 성공', async () => {
    await request(app)
      .patch('/schedule/day-reschedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d7cf0a5fb95366f7329552' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .get('/schedule/day-reschedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d303f1a9ca1ad55fee2742' })
      .expect(404);
  });
});

describe('미뤄진 계획블록 계획표로 옮기기 [PATCH] /schedule/reschedule-day?scheduleId=', () => {
  it('200 - 미뤄진 계획블록 계획표로 옮기기 성공', async () => {
    await request(app)
      .patch('/schedule/reschedule-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d7cf0a5fb95366f7329552' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .get('/schedule/reschedule-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d7cf0a5fb95366f7329552' })
      .expect(404);
  });
});

describe('계획블록 완료하기 [PATCH] /schedule/complete?scheduleId=', () => {
  it('200 - 계획블록 완료 성공', async () => {
    await request(app)
      .patch('/schedule/complete')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d7cf0a5fb95366f7329552' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .get('/schedule/complete')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d7cf0a5fb95366f732955x' })
      .expect(404);
  });
});

// describe('계획블록 생성 [POST] /schedule', () => {
//   it('201 - 계획블록 생성 성공', async () => {
//     await request(app)
//       .post('/schedule')
//       .set('Content-Type', 'application/json')
//       .send({
//         date: '2022-07-21',
//         title: 'API 테스트',
//         categoryColorCode: '#apitest',
//       })
//       .expect(201)
//       .expect('Content-Type', /json/);
//   });

//   it('400 - 필요한 값이 없습니다', async () => {
//     await request(app)
//       .post('/schedule')
//       .set('Content-Type', 'application/json')
//       .send({
//         title: 'API 테스트',
//         categoryColorCode: '#apitest',
//       })
//       .expect(400);
//   });
// });

// describe('계획블록 삭제 [DELETE] /schedule?scheduleId=', () => {
//   it('200 - 계획블록 삭제 성공', async () => {
//     await request(app)
//       .delete('/schedule')
//       .set('Content-Type', 'application/json')
//       .query({ scheduleId: '62d905bb6aba4018b96a935b' })
//       .expect(200)
//       .expect('Content-Type', /json/);
//   });

//   it('404 - 존재하지 않는 데이터입니다', async () => {
//     await request(app)
//       .delete('/schedule')
//       .set('Content-Type', 'application/json')
//       .query({ scheduleId: '62d905bb6aba4018b96a9350' })
//       .expect(404);
//   });
// });

describe('계획블록 수정 [PATCH] /schedule?scheduleId=', () => {
  it('200 - 계획블록 수정 성공', async () => {
    await request(app)
      .patch('/schedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d8fd7f6e6f967cd9010f8a' })
      .send({
        title: '수정 API 테스트',
        categoryColorCode: '#success',
        subSchedules: [
          {
            scheduleId: '',
            title: '모달짬뽕 테스트코드',
          },
        ],
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .delete('/schedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d8fd7f6e6f967cd9010f80' })
      .send({
        title: '수정 API 테스트',
        categoryColorCode: '#success',
        subSchedules: [
          {
            scheduleId: '',
            title: '모달짬뽕 테스트코드',
          },
        ],
      })
      .expect(404);
  });
});

describe('하위 계획블록 리스트 조회 [GET] /schedule/subschedule?scheduleId=', () => {
  it('200 - 하위 계획블록 리스트 조회 성공', async () => {
    await request(app)
      .get('/schedule/subschedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d596a7daa86965b4ca050b' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .get('/schedule/subschedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d596a7daa86965b4ca050c' })
      .expect(404);
  });
});

describe('자주 사용하는 계획블록 리스트 조회 [GET] /schedule/routine', () => {
  it('200 - 자주 사용하는 계획블록 리스트 조회 성공', async () => {
    await request(app)
      .get('/schedule/routine')
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
  });
});

describe('자주 사용하는 계획블록 등록 [POST] /schedule/day-routine?scheduleId=', () => {
  it('201 - 자주 사용하는 계획블록 등록 성공', async () => {
    await request(app)
      .post('/schedule/day-routine')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d6619fdaa86965b4ca053e' })
      .expect(201)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .post('/schedule/day-routine')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d90dfa68059eb4c4979f32' })
      .expect(404);
  });
});

describe('자주 사용하는 계획블록 계획표로 옮기기 [POST] /schedule/routine-day?scheduleId=', () => {
  it('200 - 자주 사용하는 계획블록 계획표로 옮기기 성공', async () => {
    await request(app)
      .post('/schedule/routine-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d7cf0a5fb95366f7329552' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .post('/schedule/routine-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62d7cf0a5fb95366f732955d' })
      .expect(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log('Mongoose Disconnected!');
  console.log('DRAG.ME API TEST COMPLETE - Route Schedule');
});
