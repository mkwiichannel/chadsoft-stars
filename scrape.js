const fs = require("fs");

const players = [
  {
    name: "dom",
    url: "https://chadsoft.co.uk/time-trials/players/3F/FF48F12DC77C5E.json"
  },
  {
    name: "tin",
    url: "https://chadsoft.co.uk/time-trials/players/34/8FDE9288B138C7.json"
  },
  {
    name: "soap",
    url: "https://chadsoft.co.uk/time-trials/players/0B/925BB435D54BC3.json"
  }
];

async function scrapePlayer(player) {
  console.log("Fetching JSON for:", player.name);

  const res = await fetch(player.url);

  if (!res.ok) {
    throw new Error("Failed to fetch JSON for " + player.name);
  }

  const data = await res.json();

  let bronze = 0;
  let silver = 0;
  let gold = 0;

  if (data.timeTrials) {
    data.timeTrials.forEach(trial => {
      if (trial.medal === "Bronze") bronze++;
      if (trial.medal === "Silver") silver++;
      if (trial.medal === "Gold") gold++;
    });
  }

  const result = { bronze, silver, gold };

  fs.writeFileSync(
    `${player.name}.json`,
    JSON.stringify(result, null, 2)
  );

  console.log(player.name, result);
}

async function run() {
  for (const player of players) {
    await scrapePlayer(player);
  }
}

run().catch(err => {
  console.error("SCRAPER ERROR:", err);
  process.exit(1);
});
