let isDatePickerOpen = false;
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = null;

const dateInput = document.querySelector(".date-input");
const datePicker = document.querySelector(".datepicker");
const daysContainer = document.querySelector(".days-container");
const datePickerTitle = document.querySelector(".datepicker-title");
const nextMonthButton = document.querySelector(".datepicker-next-month");
const nextYearButton = document.querySelector(".datepicker-next-year");
const prevMonthButton = document.querySelector(".datepicker-prev-month");
const prevYearButton = document.querySelector(".datepicker-prev-year");
const todayDateButton = document.querySelector(".datepicker-today-btn");
const clearDateButton = document.querySelector(".datepicker-clear-btn");

dateInput.addEventListener("click", function () {
  if (isDatePickerOpen) {
    isDatePickerOpen = false;
    datePicker.style.display = "none";
  } else {
    isDatePickerOpen = true;
    datePicker.style.display = "block";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  renderCalender();
});

nextMonthButton.addEventListener("click", function () {
  const nextState = goToNextMonth({
    month: currentMonth,
    year: currentYear,
  });

  currentMonth = nextState.month;
  currentYear = nextState.year;
  renderCalender();
});

nextYearButton.addEventListener("click", function () {
  currentYear += 1;
  renderCalender();
});

prevMonthButton.addEventListener("click", function () {
  const nextState = goToPrevMonth({
    month: currentMonth,
    year: currentYear,
  });
  currentMonth = nextState.month;
  currentYear = nextState.year;
  renderCalender();
});

prevYearButton.addEventListener("click", function () {
  currentYear -= 1;
  renderCalender();
});

todayDateButton.addEventListener('click', function (){
    const date = new Date()
    selectedDate= date
    currentMonth =date.getMonth()
    currentYear = date.getFullYear()
    dateInput.value = selectedDate.toLocaleDateString()
    renderCalender()
})

clearDateButton.addEventListener('click', function (){
    selectedDate= null
    dateInput.value = ''
    renderCalender()
})

// helper func
function getCalendarDays(year, month) {
  const dayOfTheWeek = new Date(year, month, 1).getDay();
  const dayOfThemOnth = new Date(year, month + 1, 0).getDate();

  const leadingDays = Array(dayOfTheWeek).fill(null);
  // O+1 means Feb , but date 0 means one day before Feb which is jan 31st
  const monthDays = Array.from(
    { length: dayOfThemOnth },
    (_, index) => index + 1
  );

  return [...leadingDays, ...monthDays];
}

function renderCalender() {
  daysContainer.textContent = "";

  const days = getCalendarDays(currentYear, currentMonth);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  datePickerTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  // initialize the canlender days
  days.forEach((day) => {
    const dayCell = document.createElement("div");
    dayCell.className = "day-cell";
    if (day) {
      dayCell.textContent = day;
    }
    if (isSelectedDay(day)) {
      dayCell.classList.add("selected");
    }
    //   here we are attching even listener to all the cells, this does not seem correct, use event delegation
    dayCell.addEventListener("click", function () {
      if (!day) return;
      selectedDate = new Date(currentYear, currentMonth, day);
      dateInput.value = selectedDate.toLocaleDateString();
      renderCalender();
    });

    daysContainer.appendChild(dayCell);
  });
}

function goToNextMonth(state) {
  if (state.month >11) {
    return {
      month: 0,
      year: state.year + 1,
    };
  }

  return {
    month: state.month + 1,
    year: state.year,
  };
}

function goToPrevMonth(state) {
  if (state.month <0) {
    return {
      month: 11,
      year: state.year - 1,
    };
  }
  return {
    month: state.month - 1,
    year: state.year,
  };
}

function isSelectedDay(day) {
  if (!selectedDate || !day) {
    return false;
  }

  return (
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getFullYear() === currentYear
  );
}
