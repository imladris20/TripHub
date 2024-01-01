import { addDays, format, getDay } from "date-fns";

export function addDurationToTime(startTime, duration) {
  const startTimeParts = startTime.split(":");
  const startHours = parseInt(startTimeParts[0], 10);
  const startMinutes = parseInt(startTimeParts[1], 10);
  const startDate = new Date(0, 0, 0, startHours, startMinutes);

  startDate.setMinutes(startDate.getMinutes() + duration);

  const newHours = startDate.getHours();
  const newMinutes = startDate.getMinutes();

  const result = `${String(newHours).padStart(2, "0")}:${String(
    newMinutes,
  ).padStart(2, "0")}`;

  return result;
}

export function calculateEndTime(start, hours, minutes) {
  const startHours = parseInt(start.split(":")[0], 10);
  const startMinutes = parseInt(start.split(":")[1], 10);
  const stayHoursNum = parseInt(hours, 10);
  const stayMinutesNum = parseInt(minutes, 10);

  const endHours = startHours + stayHoursNum;
  const endMinutes = startMinutes + stayMinutesNum;

  const endTime = new Date(0, 0, 0, endHours, endMinutes);

  const stringifyEndTime =
    endTime.getHours().toString().padStart(2, "0") +
    ":" +
    endTime.getMinutes().toString().padStart(2, "0");
  return stringifyEndTime;
}

export const numberToChinese = (num) => {
  const chineseNumbers = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
  ];
  const chineseTenMultiples = [
    "",
    "十",
    "二十",
    "三十",
    "四十",
    "五十",
    "六十",
    "七十",
    "八十",
    "九十",
  ];

  if (num < 10) {
    return chineseNumbers[num];
  } else if (num < 20) {
    return `十${chineseNumbers[num % 10]}`;
  } else {
    return `${chineseTenMultiples[Math.floor(num / 10)]}${
      chineseNumbers[num % 10]
    }`;
  }
};

export const formatToTaiwanDate = (dateString) => {
  let newDateString = format(dateString, "yyyy/MM/dd");

  const dayOfWeekIndex = getDay(newDateString);
  const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
  const day = daysOfWeek[dayOfWeekIndex];

  newDateString = newDateString + ` (${day})`;

  return newDateString;
};

export const addDaysToDate = (dateString, days) => {
  let newDateString = addDays(dateString, days);
  newDateString = formatToTaiwanDate(newDateString);
  return newDateString;
};
