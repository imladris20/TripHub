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
