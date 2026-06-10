import { CALENDAR_GRID_SIZE, CELL_TYPE, MONTH_INDEX } from "./constants.js";

function generateDays(count) {
  return Array.from({ length: count }, (_, index) => index + 1);
}

function createCalendarCells(days, type, month, year) {
  return days.map((day) => {
    return {
      day,
      type,
      month,
      year,
    };
  });
}

export function getCalendarDays(year, month) {
  const dayOfTheWeek = new Date(year, month, 1).getDay();
  // O+1 means Feb , but date 0 means one day before Feb which is jan 31st
  const dayOfTheMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const prevs = generateDays(prevMonthDays);

  const data = dayOfTheWeek === 0 ? [] : prevs.slice(-dayOfTheWeek);
  const prevState = getPreviousMonthInfo({month,year})
  const lastMonthdays = createCalendarCells(
    data,
    CELL_TYPE.PREVIOUS,
    prevState.month,
    prevState.year
  );
  const currentMonthDays = createCalendarCells(
    generateDays(dayOfTheMonth),
    CELL_TYPE.CURRENT,
    month,
    year
  );

  const totalCells = lastMonthdays?.length + currentMonthDays?.length;
  const remainingCells = CALENDAR_GRID_SIZE - totalCells;
 const nextState =  getNextMonthInfo({month,year})
  const nextMonthDays = createCalendarCells(
    generateDays(remainingCells),
    CELL_TYPE.NEXT,
    nextState.month,
    nextState.year
  );

  return [...lastMonthdays, ...currentMonthDays, ...nextMonthDays];
}

export function getNextMonthInfo(state) {
  if (state.month === MONTH_INDEX.DECEMBER) {
    return {
      month: MONTH_INDEX.JANUARY,
      year: state.year + 1,
    };
  }

  return {
    month: state.month + 1,
    year: state.year,
  };
}

export function getPreviousMonthInfo(state) {
  if (state.month === MONTH_INDEX.JANUARY) {
    return {
      month: MONTH_INDEX.DECEMBER,
      year: state.year - 1,
    };
  }
  return {
    month: state.month - 1,
    year: state.year,
  };
}
