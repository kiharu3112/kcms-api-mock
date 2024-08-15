import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { teamHandler } from "./team/main";
import { matchHandler } from "./match/main";
const app = new Hono();

type Team = {
  id: string;
  teamName: string;
  members: string[];
  isMultiWalk: boolean;
  category: "Elementary" | "Primary";
  entry: boolean;
};
export type Match = {
  id: string;
  matchCode: string;
  team1Id: string;
  team2Id: string;
  runResults: {
    id: string;
    teamId: string;
    points: number;
    goalTimeSeconds: number;
    finishState: "finished" | "retired";
  }[]
  matchType: "pre" | "main";
  courseIndex: number;
};
type Data = {
  team: Team[];
  matches: {
    pre: Match[];
    main: Match[];
  };
};
export const data: Data = {
  team: [
    {
      id: "39440930485098",
      teamName: "ニカ.reverse()",
      members: ["木下竹千代", "織田幸村"],
      isMultiWalk: false,
      category: "Elementary",
      entry: true,
    },
    {
      id: "z7pji1obh5",
      teamName: "obsidian",
      members: ["aa"],
      isMultiWalk: true,
      category: "Elementary",
      entry: true,
    },
  ],
  match: [],
};

app.get("/", (c) => {
  return c.text("Hello Hono");
});

app.route("/team", teamHandler);
app.route("/match", matchHandler);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
