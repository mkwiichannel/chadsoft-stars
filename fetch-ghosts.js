// fetch-ghosts.js
// Node 20+ (GitHub Actions compatible)

const fs = require("fs");

const PLAYER_URL =
  "https://chadsoft.co.uk/time-trials/players/3F/FF48F12DC77C5E.html"; // <-- your player page

async function run() {
  try {
    const response = await fetch(PLAYER_URL);
    const html = await response.text();

    // Find ALL ghost download links
    const ghostRegex = /href="(\/ghostdownload\/[^"]+)"/g;

    const ghosts = [];
    let match;

    while ((match = ghostRegex.exec(html)) !== null) {
      ghosts.push({
        download: "https://chadsoft.co.uk" + match[1]
      });
    }

    // Remove duplicates
    const uniqueGhosts = [...new Map(ghosts.map(g => [g.download, g])).values()];

    console.log("Found ghosts:", uniqueGhosts.length);

    fs.writeFileSync(
      "ghosts.json",
      JSON.stringify(uniqueGhosts, null, 2)
    );

    console.log("ghosts.json updated!");
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
