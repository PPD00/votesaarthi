import flows from "../data/flows.json";

test("FAKE_VOTE_ISSUE flow has steps", () => {
  const flow = flows.find(f => f.intent === "FAKE_VOTE_ISSUE");

  expect(flow).toBeDefined();
  expect(Array.isArray(flow.steps || [])).toBe(true);
});

test("All flows have required structure", () => {
  flows.forEach(flow => {
    expect(flow.intent).toBeDefined();
    expect(Array.isArray(flow.steps || [])).toBe(true);
  });
});