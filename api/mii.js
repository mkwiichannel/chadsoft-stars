export default async function handler(req, res) {
  const fc = req.query.fc;

  if (!fc) {
    return res.status(400).json({ error: "Missing friend code" });
  }

  try {
    // Convert FC to PID
    const clean = fc.replace(/-/g, "");
    const big = BigInt(clean);
    const pid = Number(big & 0xffffffffn);

    // SOAP XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://gamespy.net/sake">
  <SOAP-ENV:Body>
    <ns1:SearchForRecords>
      <ns1:gameid>1687</ns1:gameid>
      <ns1:secretKey>9Rmy</ns1:secretKey>
      <ns1:loginTicket>23c715d620f986c22Pwwii</ns1:loginTicket>
      <ns1:tableid>FriendInfo</ns1:tableid>
      <ns1:filter>ownerid=${pid}</ns1:filter>
      <ns1:sort>recordid</ns1:sort>
      <ns1:offset>0</ns1:offset>
      <ns1:max>1</ns1:max>
      <ns1:surrounding>0</ns1:surrounding>
      <ns1:ownerids></ns1:ownerids>
      <ns1:cacheFlag>0</ns1:cacheFlag>
      <ns1:fields>
        <ns1:string>info</ns1:string>
      </ns1:fields>
    </ns1:SearchForRecords>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

    const response = await fetch(
      "http://mariokartwii.sake.gs.wiimmfi.de/SakeStorageServer/StorageServer.asmx",
      {
        method: "POST",
        headers: {
          "User-Agent": "GameSpyHTTP/1.0",
          "Content-Type": "text/xml",
          "SOAPAction": "http://gamespy.net/sake/SearchForRecords"
        },
        body: xml
      }
    );

    const text = await response.text();

    const match = text.match(/<value>(.*?)<\/value>/);

    if (!match) {
      return res.status(404).json({ error: "Mii not found" });
    }

    const base64 = match[1];

    const renderUrl =
      "https://mii-unsecure.ariankordi.net/miis/image.png?data=" +
      encodeURIComponent(base64) +
      "&type=all_body_sugar&width=512&shaderType=wiiu_blinn";

    res.status(200).json({
      friend_code: fc,
      pid,
      mii_base64: base64,
      mii_full_body: renderUrl
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
