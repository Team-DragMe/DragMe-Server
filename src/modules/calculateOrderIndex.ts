import { ScheduleInfo } from '../interfaces/schedule/ScheduleInfo';

export const calculateOrderIndex = (
  originalSchedules: ScheduleInfo[]
): number => {
  let newIndex;
  if (originalSchedules.length === 0) {
    // 이미 존재하는 계획블록이 없을 경우, 해당 영역의 첫 번째 블록
    newIndex = 1024;
  } else {
    // 계획블록이 이미 존재하는 경우, 기존 존재하는 계획블록의 마지막 index + 1024로 설정
    newIndex = originalSchedules[originalSchedules.length - 1].orderIndex;
    newIndex += 1024;
  }
  return newIndex;
};
