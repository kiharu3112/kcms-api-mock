import { Hono } from "hono";
import { data, Match } from "../index";

export const matchHandler = new Hono();

const matchTypeCheck = (matchType: string, c: any) => {};

matchHandler.get("/", (c) => {
  console.log("type is ", typeof c);
  return c.json(data.match);
});

matchHandler.get("/:matchType", (c) => {
  if (c.req.param("matchType") !== "pre" && c.req.param("matchType") !== "main")
    return c.json({ error: "Match type not found" }, 404);
  return c.json(data.match.filter((match) => match.matchType === c.req.param("matchType")));
});

matchHandler.get("/:matchType/:id", (c) => {
  if (c.req.param("matchType") !== "pre" && c.req.param("matchType") !== "main")
    return c.json({ error: "Match type not found" }, 404);

  
  const match = data.match.find((match) => match.id === c.req.param("id"));
  if (match?.matchType !== c.req.param("matchType") || !match)
    return c.json({ error: "Match not found" }, 404);

  return c.json(data.match.find((match) => match.id === c.req.param("id")));
});

matchHandler.post("/:matchType/:departmentType/generate", (c) => {
  const matchType = c.req.param("matchType");
  if (matchType !== "pre" && matchType !== "main")
    return c.json({ error: "Match type not found" }, 404);
  
  if (c.req.param("departmentType") !== "elementary" && c.req.param("departmentType") !== "primary")
    return c.json({ error: "Department type not found" }, 404);

  const teams = data.team.filter((team) => team.category === c.req.param("departmentType") && team.entry);
  // teamsが奇数の場合、最後の要素を削除
  // 本来の試合はこんなことはないけど簡単のため(こう言っとけば何やっても許される)
  if (teams.length % 2 !== 0) teams.slice(0, -1);
  
  const matches = [] as Match[];
  for (let i = 0; i < teams.length; i += 2) {
    matches.push({
      id: Math.random().toString(36).slice(-10),
      matchType,
      departmentType: c.req.param("departmentType"),
      result: null,
    });
  }
  data.match = matches;
  return c.json({ message: "Matches generated successfully" }, 201);
});
