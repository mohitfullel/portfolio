export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    
    // Grabs the hidden environment variable from Vercel
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        return res.status(500).json({ reply: "Backend Error: Missing API Key on Vercel." });
    }

    const systemInstructionText = "You are the personal AI assistant for Mohit Fullel's portfolio website. Mohit is a creative student who loves drawing and video editing. Keep responses short (1-2 sentences), casual, friendly, and use casual slang like 'yo' or 'bro'.";

    try {
        // Updated to the standard stable model endpoint structure
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ text: prompt }] 
                }],
                // Fixed the exact structural naming layout Google's REST endpoint expects
                systemInstruction: { 
                    parts: [{ text: systemInstructionText }] 
                }
            })
        });

        const data = await response.json();

        // Safety catch: If Google sends an error message instead of an AI candidate
        if (data.error) {
            return res.status(500).json({ reply: `Google API Error: ${data.error.message}` });
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ reply: aiReply });

    } catch (error) {
        return res.status(500).json({ reply: "Damn, my brain short-circuited. Try asking again!" });
    }
}