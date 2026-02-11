const fs = require("fs");

const URL =
  "https://chadsoft.co.uk/time-trials/players/3F/FF48F12DC77C5E.html";

(async () => {
  try {
    const res = await fetch(URL);
    const html = await res.text();

    // Extract raw numbers directly from page text
    const bronzeMatch = html.match(/Bronze[^0-9]+(\d+)/i);
    const silverMatch = html.match(/Silver[^0-9]+(\d+)/i);
    const goldMatch = html.match(/Gold[^0-9]+(\d+)/i);

    const bronze = bronzeMatch ? parseInt(bronzeMatch[1]) : 0;
    const silver = silverMatch ? parseInt(silverMatch[1]) : 0;
    const gold = goldMatch ? parseInt(goldMatch[1]) : 0;

    const data = {
      bronze,
      silver,
      gold,
      updated: new Date().toISOString(),
    };

    fs.writeFileSync("stars.json", JSON.stringify(data, null, 2));

    console.log("✅ stars.json updated:", data);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
