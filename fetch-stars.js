const fs = require("fs");

async function updateStars() {
  const response = await fetch(
    "https://chadsoft.co.uk/time-trials/players/3F/FF48F12DC77C5E.html",
    {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    }
  );

  const html = await response.text();

  // Find all occurrences like: 16 / 250
  const matches = [...html.matchAll(/(\d+)\s*\/\s*250/g)];

  if (matches.length < 3) {
    console.log("Could not detect star values.");
    return;
  }

  const bronze = parseInt(matches[0][1]);
  const silver = parseInt(matches[1][1]);
  const gold = parseInt(matches[2][1]);

  const data = {
    bronze,
    silver,
    gold,
    updated: new Date().toISOString()
  };

  fs.writeFileSync("stars.json", JSON.stringify(data, null, 2));
  console.log("Stars updated:", data);
}

updateStars();
