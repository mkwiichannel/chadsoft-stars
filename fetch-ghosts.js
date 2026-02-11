const fs = require("fs");
const https = require("https");

const PLAYER_ID = "FF48F12DC77C5E";

const API_URL = `https://tt.chadsoft.co.uk/players/${PLAYER_ID}.json`;

function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });
}

async function scrape() {

  const data = await getJSON(API_URL);

  const ghosts = data.ghosts.map(g => ({
    track: g.trackName,
    time: g.finishTimeSimple,
    date: g.dateSet.split("T")[0],
    download: "https://chadsoft.co.uk" + g.ghostHref
  }));

  fs.writeFileSync("ghosts.json", JSON.stringify(ghosts, null, 2));
  console.log("Updated ghosts:", ghosts.length);
}

scrape().catch(err => {
  console.error(err);
  process.exit(1);
});
