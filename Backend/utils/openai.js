import "dotenv/config";

const getOpenAIAPIResponse = async(message, systemPrompt = "") => {
    const messages = [];
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: message });

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            'content-type': 'application/json',
            accept: 'application/json',
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-20b',
            messages: messages
        })
    }
    try{
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`NVIDIA API Error: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        return data.choices[0].message.content; //reply
    } catch(err){
        console.error("OpenAI Helper Error:", err);
        throw err;
    }
}

export default getOpenAIAPIResponse;