// const { onRequest } = require("firebase-functions/v2/https");

// exports.askGemini = onRequest(async (req, res) => {
//   res.set("Access-Control-Allow-Origin", "*");
//   res.set("Access-Control-Allow-Headers", "Content-Type");
//   res.set("Access-Control-Allow-Methods", "POST");

//   if (req.method === "OPTIONS") {
//     return res.status(204).send("");
//   }

//   if (req.method !== "POST") {
//     return res.status(400).json({ error: "Only POST allowed" });
//   }

//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: message }]
//             }
//           ]
//         })
//       }
//     );

//     const data = await response.json();

//     const reply =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No response from Gemini";

//     return res.json({ reply });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Gemini API failed" });
//   }
// });


const { onRequest } = require("firebase-functions/v2/https");

exports.askGemini = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(400).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    return res.json({
      reply,
      raw: data,
      errorDetails: data?.error || null
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Gemini API failed",
      details: err.message
    });
  }
});