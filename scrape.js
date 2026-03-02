const fs = require("fs");
const cheerio = require("cheerio");

const players = [
  {
    name: "dom",
    url: "https://chadsoft.co.uk/time-trials/players/3F/FF48F12DC77C5E.html"
  },
  {
    name: "tin",
    url: "https://chadsoft.co.uk/time-trials/players/34/8FDE9288B138C7.html"
  },
  {
    name: "soap",
    url: "https://chadsoft.co.uk/time-trials/players/0B/925BB435D54BC3.html"
  }
];

async function scrapePlayer(player) {
  console.log("Scraping:", player.name);

  const res = await fetch(player.url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${player.name}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  let bronze = 0;
  let silver = 0;
  let gold = 0;

  $("img").each((i, el) => {
    const src = ($(el).attr("src") || "").toLowerCase();

    if (src.includes("bronze")) bronze++;
    if (src.includes("silver")) silver++;
    if (src.includes("gold")) gold++;
  });

  const data = { bronze, silver, gold };

  fs.writeFileSync(
    `${player.name}.json`,
    JSON.stringify(data, null, 2)
  );

  console.log(`${player.name} updated`, data);
}

async function run() {
  for (const player of players) {
    await scrapePlayer(player);
  }
}

run();
