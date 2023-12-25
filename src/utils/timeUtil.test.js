import { expect, test } from "vitest";
import { addDurationToTime } from "./timeUtil";

test("90 minutes after 10:00 is 11:30", () => {
  expect(addDurationToTime("10:00", 90)).toBe("11:30");
});
