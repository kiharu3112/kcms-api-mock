import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
const app = new Hono();

type Team = {
  id: string;
  teamName: string;
  members: string[];
  isMultiWalk: boolean;
  category: "Elementary" | "Primary";
  entry: boolean;
};
type Match = {
  id: string;
  teamId: string;
  score: number;
  rank: number;
};
type Data = {
  team: Team[];
  match: Match[];
};
const data: Data = {
  team: [
    {
      id: "39440930485098",
      teamName: "ニカ.reverse()",
      members: ["木下竹千代", "織田幸村"],
      isMultiWalk: false,
      category: "Elementary",
      entry: false,
    },
  ],
  match: [],
};

app.get("/", (c) => {
  return c.text("Hello Hono");
});

//   ~~~~~~~~~~~~~~~~~~ チーム ~~~~~~~~~~~~~~~~~~

// チーム一覧の取得
app.get("/team", (c) => {
  return c.json(data.team);
});

// チームの登録
const PostTeamSchema = z.object({
  teamName: z.string(),
  members: z.array(z.string()),
  isMultiWalk: z.boolean(),
  category: z.enum(["Elementary", "Primary"]),
});
app.post("/team", zValidator("json", PostTeamSchema), (c) => {
  const team = c.req.valid("json");
  const id = Math.random().toString(36).slice(-10);
  data.team.push({ id, ...team, entry: false });
  return c.json({ message: "Team created successfully" }, 201);
});

// チームの取得
app.get("/team/:id", async (c) => {
  const id = c.req.param("id");
  const team = data.team.find((team) => team.id === id);

  if (!team) {
    return c.json({ error: "Team not found" }, 500);
  }
  return c.json(team);
});

// チームの削除
app.delete("/team/:id", async (c) => {
  const id = c.req.param("id");
  const teamExists = data.team.some((team) => team.id === id);

  if (!teamExists) {
    return c.json({ error: "Team not found" }, 404);
  }
  data.team = data.team.filter((team) => team.id !== id);
  return c.json({ message: "Team deleted successfully" }, 200);
});

// エントリー登録
app.post("/team/:id/entry", async (c) => {
  const id = c.req.param("id");
  const team = data.team.find((team) => team.id === id);

  if (!team) {
    return c.json({ error: "Team not found" }, 404);
  }
  team.entry = true;
  return c.json({ message: "Entry registered successfully" });
});

// エントリー削除
app.delete("/team/:id/entry", async (c) => {
  const id = c.req.param("id");
  const team = data.team.find((team) => team.id === id);

  if (!team) {
    return c.json({ error: "Team not found" }, 404);
  }
  team.entry = false;
  return c.json({ message: "Entry deleted successfully" });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
