export const calculateDaysOfWeek = (
  startDate: string,
  endDate: string
): string[] => {
  let daysOfWeek: string[] = [];
  if (startDate.substring(0, 7) === endDate.substring(0, 7)) {
    // 한 주 내에서 월이 바뀌지 않는 경우 (같은 달인 경우)
    const yearAndMonth: string = startDate.substring(0, 8);
    const day = parseInt(startDate.substring(8, 10));
    for (let counter = 0; counter < 7; counter++) {
      daysOfWeek.push(`${yearAndMonth}${('00' + (day + counter)).slice(-2)}`);
    }
  } else {
    // 한 주 내에서 월이 바뀌는 경우
    const startYearAndMonth: string = startDate.substring(0, 8);
    const startDay = parseInt(startDate.substring(8, 10));
    const endYearAndMonth: string = endDate.substring(0, 8);
    let endDay = parseInt(endDate.substring(8, 10));
    let counter = 7;
    while (endDay > 0) {
      daysOfWeek.push(`${endYearAndMonth}${('00' + endDay).slice(-2)}`);
      endDay--;
      counter--;
    }
    for (
      let oldMonthCounter = 0;
      oldMonthCounter < counter;
      oldMonthCounter++
    ) {
      daysOfWeek.push(
        `${startYearAndMonth}${('00' + (startDay + oldMonthCounter)).slice(-2)}`
      );
    }
    daysOfWeek.sort();
  }
  return daysOfWeek;
};
