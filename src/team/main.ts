import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { data } from "../index";

export const teamHandler = new Hono();

// チーム一覧の取得
teamHandler.get("/", (c) => {
  return c.json(data.team);
});

// チームの登録
const PostTeamSchema = z.object({
  teamName: z.string(),
  members: z.array(z.string()),
  isMultiWalk: z.boolean(),
  category: z.enum(["Elementary", "Primary"]),
});
teamHandler.post("/", zValidator("json", PostTeamSchema), (c) => {
  const team = c.req.valid("json");
  const id = Math.random().toString(36).slice(-10);
  data.team.push({ id, ...team, entry: false });
  return c.json({ message: "Team created successfully" }, 201);
});

// チームの取得
teamHandler.get("/:id", async (c) => {
  const id = c.req.param("id");
  const team = data.team.find((team) => team.id === id);

  if (!team) {
    return c.json({ error: "Team not found" }, 500);
  }
  return c.json(team);
});

// チームの削除
teamHandler.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const teamExists = data.team.some((team) => team.id === id);

  if (!teamExists) {
    return c.json({ error: "Team not found" }, 404);
  }
  data.team = data.team.filter((team) => team.id !== id);
  return c.json({ message: "Team deleted successfully" }, 200);
});

// エントリー登録
teamHandler.post("/:id/entry", async (c) => {
  const id = c.req.param("id");
  const team = data.team.find((team) => team.id === id);

  if (!team) {
    return c.json({ error: "Team not found" }, 404);
  }
  team.entry = true;
  return c.json({ message: "Entry registered successfully" });
});

// エントリー削除
teamHandler.delete("/:id/entry", async (c) => {
  const id = c.req.param("id");
  const team = data.team.find((team) => team.id === id);

  if (!team) {
    return c.json({ error: "Team not found" }, 404);
  }
  team.entry = false;
  return c.json({ message: "Entry deleted successfully" });
});
