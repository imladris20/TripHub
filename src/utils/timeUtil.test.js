import { expect, test } from "vitest";
import { addDurationToTime } from "./timeUtil";

test("90 minutes after 10:00 is 11:30", () => {
  expect(addDurationToTime("10:00", 90)).toBe("11:30");
  expect(addDurationToTime("22:10", 50)).toBe("23:00");
  expect(addDurationToTime("23:30", 40)).toBe("00:10");
});
