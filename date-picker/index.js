import { CELL_TYPE, MONTH_INDEX, monthNames } from "./utils/constants.js";
import { getCalendarDays } from "./utils/index.js";

const state = {
  isDatePickerOpen: false,
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  selectedDate: null,
};

const elements = {
  dateInput: document.querySelector(".date-input"),
  datePicker: document.querySelector(".datepicker"),
  daysContainer: document.querySelector(".days-container"),
  datePickerTitle: document.querySelector(".datepicker-title"),
  nextMonthButton: document.querySelector(".datepicker-next-month"),
  nextYearButton: document.querySelector(".datepicker-next-year"),
  prevMonthButton: document.querySelector(".datepicker-prev-month"),
  prevYearButton: document.querySelector(".datepicker-prev-year"),
  todayDateButton: document.querySelector(".datepicker-today-btn"),
  clearDateButton: document.querySelector(".datepicker-clear-btn"),
};

elements.dateInput.addEventListener("click", function () {
  state.isDatePickerOpen = !state.isDatePickerOpen;
  render();
});

document.addEventListener("DOMContentLoaded", function () {
  renderCalender();
});

elements.nextMonthButton.addEventListener("click", function () {
  const nextState = goToNextMonth({
    month: state.currentMonth,
    year: state.currentYear,
  });

  state.currentMonth = nextState.month;
  state.currentYear = nextState.year;
  renderCalender();
});

elements.nextYearButton.addEventListener("click", function () {
  state.currentYear += 1;
  renderCalender();
});

elements.prevMonthButton.addEventListener("click", function () {
  const nextState = goToPrevMonth({
    month: state.currentMonth,
    year: state.currentYear,
  });

  state.currentMonth = nextState.month;
  state.currentYear = nextState.year;
  renderCalender();
});

elements.prevYearButton.addEventListener("click", function () {
  state.currentYear -= 1;
  renderCalender();
});

elements.todayDateButton.addEventListener("click", function () {
  const date = new Date();
  state.selectedDate = date;
  state.currentMonth = date.getMonth();
  state.currentYear = date.getFullYear();
  elements.dateInput.value = state.selectedDate.toLocaleDateString();
  renderCalender();
});

elements.clearDateButton.addEventListener("click", function () {
  state.selectedDate = null;
  elements.dateInput.value = "";
  renderCalender();
});

function calenderCleanUp() {
  elements.daysContainer.textContent = "";
}

function renderHeader() {
  elements.datePickerTitle.textContent = `${monthNames[state.currentMonth]} ${
    state.currentYear
  }`;
}

function renderCells() {
  const days = getCalendarDays(state.currentYear, state.currentMonth);

  // initialize the canlender days
  days.forEach(({ day, type }) => {
    const dayCell = document.createElement("div");
    dayCell.className = "day-cell";
    if (type === CELL_TYPE.CURRENT) {
      dayCell.classList.add("current-month-cell");
    }
    if (day) {
      dayCell.textContent = day;
    }
    if (type === CELL_TYPE.PREVIOUS || type === CELL_TYPE.NEXT) {
      dayCell.classList.add("other-month");
    }
    if (isSelectedDay(day) && type === CELL_TYPE.CURRENT) {
      dayCell.classList.add("selected");
    }
    dayCell.setAttribute("data-day", day);
    dayCell.setAttribute("data-type", type);
    elements.daysContainer.appendChild(dayCell);
  });
}

elements.daysContainer.addEventListener("click", (event) => {
  const dayCell = event.target.closest(".day-cell");
  if (!dayCell) return;
  const day = Number(dayCell.dataset.day);
  const type = dayCell.dataset.type;

  if (!day || type === CELL_TYPE.PREVIOUS || type === CELL_TYPE.NEXT) return;
  state.selectedDate = new Date(state.currentYear, state.currentMonth, day);
  elements.dateInput.value = state.selectedDate.toLocaleDateString();
  renderCalender();
});

function renderVisibility() {
  elements.datePicker.style.display = state.isDatePickerOpen ? "block" : "none";
}

function render() {
  renderVisibility();
  renderCalender();
}

function renderCalender() {
  calenderCleanUp();

  renderHeader();
  renderCells();
}

function goToNextMonth(state) {
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

function goToPrevMonth(state) {
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

function isSelectedDay(day) {
  if (!state.selectedDate || !day) {
    return false;
  }

  return (
    state.selectedDate.getDate() === day &&
    state.selectedDate.getMonth() === state.currentMonth &&
    state.selectedDate.getFullYear() === state.currentYear
  );
}

// 1. Event Delegation
// 2. Rich CalendarCell Model
// 3. render() orchestrator

// function updateState(updater) {
//   updater(state);
//   renderCalender();
// }

// Usage:

// updateState((state) => {
//   state.currentYear += 1;
// });
