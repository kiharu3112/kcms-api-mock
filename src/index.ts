import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { teamHandler } from "./team/main";
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
export const data: Data = {
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

app.route("/team", teamHandler);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
