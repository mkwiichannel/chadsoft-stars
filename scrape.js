const fs = require("fs");
const fetch = require("node-fetch");
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
    url: "https://chadsoft.co.uk/time-trials/rkgd/4E/86/99E727A2266B627FB33184AE121C49FC531E.html"
  }
];

async function scrapePlayer(player) {
  try {
    console.log("Scraping:", player.name);

    const res = await fetch(player.url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    let bronze = 0;
    let silver = 0;
    let gold = 0;

    $("img").each((i, el) => {
      const alt = $(el).attr("alt") || "";
      const src = $(el).attr("src") || "";

      if (alt.includes("Bronze") || src.includes("bronze")) bronze++;
      if (alt.includes("Silver") || src.includes("silver")) silver++;
      if (alt.includes("Gold") || src.includes("gold")) gold++;
    });

    const data = { bronze, silver, gold };

    fs.writeFileSync(
      `${player.name}-stars.json`,
      JSON.stringify(data, null, 2)
    );

    console.log(`${player.name} updated`, data);

  } catch (err) {
    console.error("Error scraping", player.name, err);
  }
}

async function run() {
  for (const player of players) {
    await scrapePlayer(player);
  }
}

run();
