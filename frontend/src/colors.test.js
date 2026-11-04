import { stringToColor } from "./colors";

test("returns a valid hsl color", () => {
  expect(stringToColor("60", "Constitución")).toMatch(/^hsl\(\d{1,3}, 70%, 50%\)$/);
});

test("is deterministic for the same line and direction", () => {
  expect(stringToColor("152", "Olivos")).toBe(stringToColor("152", "Olivos"));
});

test("gives different colors to opposite directions of a line", () => {
  expect(stringToColor("152", "Olivos")).not.toBe(stringToColor("152", "La Boca"));
});
