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
      .query({ date: '2022-07-22' })
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
      .query({ scheduleId: '62daa5d4373d240fcb76d3db' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .patch('/schedule/day-reschedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3dc' })
      .expect(404);
  });
});

describe('미룬 계획블록 계획표로 옮기기 [PATCH] /schedule/reschedule-day?scheduleId=', () => {
  it('200 - 미룬 계획블록 계획표로 옮기기 성공', async () => {
    await request(app)
      .patch('/schedule/reschedule-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3db' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .patch('/schedule/reschedule-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3dc' })
      .expect(404);
  });
});

describe('계획블록 완료하기 [PATCH] /schedule/complete?scheduleId=&isCompleted=', () => {
  it('200 - 계획블록 완료 성공', async () => {
    await request(app)
      .patch('/schedule/complete')
      .set('Content-Type', 'application/json')
      .query(
        { scheduleId: '62da993c6626ef5e848f702e' },
        { isCompleted: 'true' }
      )
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .patch('/schedule/complete')
      .set('Content-Type', 'application/json')
      .expect(404);
  });
});

describe('계획블록 생성 [POST] /schedule', () => {
  it('201 - 계획블록 생성 성공', async () => {
    await request(app)
      .post('/schedule')
      .set('Content-Type', 'application/json')
      .send({
        date: '2025-07-21',
        title: 'API 테스트',
        categoryColorCode: '#apitest',
      })
      .expect(201)
      .expect('Content-Type', /json/);
  });

  it('400 - 필요한 값이 없습니다', async () => {
    await request(app)
      .post('/schedule')
      .set('Content-Type', 'application/json')
      .send({
        title: 'API 테스트',
        categoryColorCode: '#apitest',
      })
      .expect(400);
  });
});

describe('계획블록 삭제 [DELETE] /schedule?scheduleId=', () => {
  it('200 - 계획블록 삭제 성공', async () => {
    await request(app)
      .delete('/schedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62da99556626ef5e848f7034' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .delete('/schedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa62e373d240fcb76d416' })
      .expect(404);
  });
});

describe('계획블록 수정 [PATCH] /schedule?scheduleId=', () => {
  it('200 - 계획블록 수정 성공', async () => {
    await request(app)
      .patch('/schedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3db' })
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
      .patch('/schedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3dc' })
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
      .query({ scheduleId: '62daa5d4373d240fcb76d3db' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .get('/schedule/subschedule')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3dc' })
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
      .query({ scheduleId: '62daa5d4373d240fcb76d3db' })
      .expect(201)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .post('/schedule/day-routine')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3dc' })
      .expect(404);
  });
});

describe('자주 사용하는 계획블록 계획표로 옮기기 [POST] /schedule/routine-day?scheduleId=', () => {
  it('200 - 자주 사용하는 계획블록 계획표로 옮기기 성공', async () => {
    await request(app)
      .post('/schedule/routine-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3db' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .post('/schedule/routine-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3dc' })
      .expect(404);
  });
});

describe('계획블록 이름 수정 [PATCH] /schedule/title?scheduleId=', () => {
  it('200 - 계획블록 이름 수정 성공', async () => {
    await request(app)
      .patch('/schedule/title')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3db' })
      .send({ title: '코드 테스트' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .patch('/schedule/title')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daa5d4373d240fcb76d3dc' })
      .send({ title: '코드 테스트' })
      .expect(404);
  });
});

describe('날짜별 계획블록 존재 여부 조회 [GET] /schedule/calendar?month=', () => {
  it('200 - 날짜별 계획블록 존재 여부 조회 성공', async () => {
    await request(app)
      .get('/schedule/calendar')
      .set('Content-Type', 'application/json')
      .query({ month: '2025-07' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('400 - 필요한 값이 없습니다', async () => {
    await request(app)
      .get('/schedule/calendar')
      .set('Content-Type', 'application/json')
      .expect(400);
  });
});

describe('계획블록 순서 변경 [PATCH] /schedule/order?scheduleId=', () => {
  it('200 - 계획블록 순서 변경 성공', async () => {
    await request(app)
      .patch('/schedule/order')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62dab0ac373d240fcb76e0c5' })
      .send({
        objectIds: [
          '62dab056373d240fcb76e062',
          '62dab0ac373d240fcb76e0c5',
          '62dab057373d240fcb76e066',
        ],
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });
});

describe('계획블록 시간 설정 [POST] /schedule/time?scheduleId=', () => {
  it('201 - 계획블록 시간 생성 성공', async () => {
    await request(app)
      .post('/schedule/time')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daabd1373d240fcb76dd0a' })
      .send({
        isUsed: false,
        timeBlockNumbers: [11, 12, 13, 14],
      })
      .expect(201)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .post('/schedule/routine-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62cd27ae39f42cfbf520009b' })
      .send({
        isUsed: false,
        timeBlockNumbers: [11, 12, 13, 14],
      })
      .expect(404);
  });
});

describe('계획블록 시간 삭제 [PATCH] /schedule/time?scheduleId=', () => {
  it('200 - 계획블록 시간 삭제 성공', async () => {
    await request(app)
      .patch('/schedule/time')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daabd1373d240fcb76dd0a' })
      .send({
        timeBlockNumbers: [11, 12],
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .patch('/schedule/routine-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daabd1373d240fcb76dd0b' })
      .send({
        timeBlockNumbers: [7, 8],
      })
      .expect(404);
  });
});

describe('계획블록 카테고리 변경 [PATCH] /schedule/category?scheduleId=', () => {
  it('200 - 계획블록 카테고리 변경 성공', async () => {
    await request(app)
      .patch('/schedule/time')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62daabd1373d240fcb76dd0a' })
      .send({
        categoryColorCode: '날 죽여줘',
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다', async () => {
    await request(app)
      .patch('/schedule/routine-day')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62cd27ae39f42cfbf520009b' })
      .send({
        categoryColorCode: '날 죽여줘',
      })
      .expect(404);
  });
});

describe('주간 계획 계획블록 리스트 조회 [GET] /schedule/weeks?startDate=&endDate=', () => {
  it('200 - 주간 계획블록 리스트 조회 성공', async () => {
    await request(app)
      .get('/schedule/weeks')
      .set('Content-Type', 'application/json')
      .query({
        startDate: '2025-07-21',
        endDate: '2025-07-27',
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('400 - 필요한 값이 없습니다.', async () => {
    await request(app)
      .get('/schedule/weeks')
      .set('Content-Type', 'application/json')
      .query({
        startDate: '2025-07-21',
      })
      .expect(400);
  });
});

describe('계획블록 요일 이동 [PATCH] /schedule/days?schedulId=', () => {
  it('200 - 계획블록 요일 이동', async () => {
    await request(app)
      .patch('/schedule/days')
      .set('Content-Type', 'application/json')
      .query({ scheduleId: '62cd27ae39f42cfbf520009a' })
      .send({
        date: '2022-07-23',
      })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('404 - 존재하지 않는 데이터입니다.', async () => {
    await request(app)
      .patch('/schedule/weeks')
      .set('Content-Type', 'application/json')
      .query({
        scheduleId: '62cd27ae39f42cfbf520009b',
      })
      .expect(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log('Mongoose Disconnected!');
  console.log('DRAG.ME API TEST COMPLETE - Route Schedule');
});
