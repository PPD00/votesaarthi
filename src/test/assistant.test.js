import flows from "../data/flows.json";

test("FAKE_VOTE_ISSUE flow has steps", () => {
  const flow = flows.find(f => f.intent === "FAKE_VOTE_ISSUE");
  expect(flow.steps.length).toBeGreaterThan(0);
});