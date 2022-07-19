const message = {
  // Error
  NULL_VALUE: '필요한 값이 없습니다.',
  NOT_FOUND: '존재하지 않는 자원',
  BAD_REQUEST: '잘못된 요청',
  INTERNAL_SERVER_ERROR: '서버 내부 오류',

  // Information
  CREATE_INFORMATION_SUCCESS: '정보 작성 성공',
  GET_DAILY_INFORMATION_SUCCESS: '일간계획 정보 조회 성공',
  GET_MONTHLY_GOAL_SUCCESS: '월간 목표 조회 성공',
  GET_WEEKLY_EMOJIS_SUCCESS: '주간 이모지 리스트 조회 성공',
  GET_WEEKLY_GOAL_SUCCESS: '주간 목표 조회 성공',

  // Schedule
  CREATE_SCHEDULE_SUCCESS: '계획블록 생성 성공',
  CREATE_SCHEDULE_TIME_SUCCESS: '계획블록 시간 생성 성공',
  DELETE_SCHEDULE_TIME_SUCCESS: '계획블록 시간 삭제 성공',
  COMPLETE_SCHEDULE_SUCCESS: '계획블록 완료 성공',
  DELAY_SCHEDULE_SUCCESS: '계획블록 미루기 성공',
  GET_DAILY_SCHEDULES_SUCCESS: '일간 계획블록 리스트 조회 성공',
  GET_SUBSCHEDULES_SUCCESS: '하위 계획 조회 성공',
  GET_RESCHEDULES_SUCCESS: '미룬 계획블록 리스트 조회 성공',
  UPDATE_SCHEDULE_TITLE_SUCCESS: '계획블록 이름 수정 성공',
  CREATE_ROUTINE_SUCCESS: '자주 사용하는 계획 등록 성공',
  GET_ROUTINES_SUCCESS: '자주 사용하는 계획 조회 성공',
  MOVE_BACK_SCHEDULE_SUCCESS: '미룬 계획블록 계획표로 옮기기 성공',
  MOVE_ROUTINE_TO_SCHEDULE_SUCCESS:
    '자주 사용하는 계획블록 계획표로 옮기기 성공',
  UPDATE_SCHEDULE_ORDER_SUCCESS: '계획블록 순서 변경 성공',
  UPDATE_SCHEDULE_CATEGORY_SUCCESS: '계획블록 카테고리 변경 성공',
  GET_CALENDAR_WITH_SCHEDULES_SUCCESS: '날짜별 일정 존재 여부 조회 성공',
  UPDATE_SCHEDULE_SUCCESS: '계획블록 수정 성공',
  UPDATE_SCHEDULE_DATE_SUCCESS: '계획블록 요일 이동 성공',
  GET_WEEKLY_SCHEDULES_SUCCESS: '주간 계획블록 리스트 조회 성공',
};

export default message;
