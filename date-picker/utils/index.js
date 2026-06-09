import { CALENDAR_GRID_SIZE, CELL_TYPE } from "./constants.js";

function generateDays(count) {
  return Array.from({ length: count }, (_, index) => index + 1);
}

function createCalendarCells(days, type) {
  return days.map((day) => {
    return {
      day,
      type,
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
  const lastMonthdays = createCalendarCells(data, CELL_TYPE.PREVIOUS);
  const currentMonthDays = createCalendarCells(
    generateDays(dayOfTheMonth),
    CELL_TYPE.CURRENT
  );

  const totalCells = lastMonthdays?.length + currentMonthDays?.length;
  const remainingCells = CALENDAR_GRID_SIZE - totalCells;

  const nextMonthDays = createCalendarCells(
    generateDays(remainingCells),
    CELL_TYPE.NEXT
  );

  return [...lastMonthdays, ...currentMonthDays, ...nextMonthDays];
}

