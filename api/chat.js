export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    
    // This line automatically grabs the hidden key from Vercel!
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ reply: "Backend Error: Missing API Key on Vercel." });
    }

    const systemInstruction = "You are the personal AI assistant for Mohit Fullel's portfolio website. Mohit is a creative student who loves drawing and video editing. Keep responses short (1-2 sentences), casual, friendly, and use casual slang like 'yo' or 'bro'.";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] }
            })
        });

        const data = await response.json();
        const aiReply = data.candidates[0].content.parts[0].text;

        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        return res.status(500).json({ reply: "Damn, my brain short-circuited. Try asking again!" });
    }
}