res.on("end", () => {
  try {
    // 🔥 remove BOM if it exists
    const cleaned = data.replace(/^\uFEFF/, "");
    const json = JSON.parse(cleaned);

    console.log("Ghost count:", json.ghostCount);

    const bestPerTrack = {};

    json.ghosts.forEach(g => {
      const track = g.trackName;

      if (!bestPerTrack[track] ||
          g.finishTimeSimple < bestPerTrack[track].finishTimeSimple) {
        bestPerTrack[track] = {
          track: g.trackName,
          time: g.finishTimeSimple,
          date: g.dateSet.split("T")[0],
          download: "https://chadsoft.co.uk" + g.href
        };
      }
    });

    const result = Object.values(bestPerTrack);

    require("fs").writeFileSync(
      "ghosts.json",
      JSON.stringify(result, null, 2)
    );

    console.log("✅ ghosts.json created!");
  } catch (err) {
    console.error("JSON parse failed:", err);
  }
});
