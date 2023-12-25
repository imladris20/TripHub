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
