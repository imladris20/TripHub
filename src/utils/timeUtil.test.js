import { expect, test } from "vitest";
import { addDurationToTime, calculateEndTime } from "./timeUtil";

test("90 minutes after 10:00 is 11:30", () => {
  expect(addDurationToTime("10:00", 90)).toBe("11:30");
});

test("50 minutes after 22:10 is 23:00", () => {
  expect(addDurationToTime("22:10", 50)).toBe("23:00");
});

test("40 minutes after 23:30 is 00:10", () => {
  expect(addDurationToTime("23:30", 40)).toBe("00:10");
});

test("Stay 2 hours 0 minute from 09:30", () => {
  expect(calculateEndTime("09:30", 2, 0)).toBe("11:30");
});

test("Stay 0 hours 32 minute from 09:30", () => {
  expect(calculateEndTime("09:30", 0, 32)).toBe("10:02");
});

test("Stay 1 hours 40 minute from 22:30", () => {
  expect(calculateEndTime("22:30", 1, 40)).toBe("00:10");
});
