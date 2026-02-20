import "dotenv/config";

const getOpenAIAPIResponse = async(message) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            'content-type': 'application/json',
            accept: 'application/json',
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-20b',
            messages: [{
                content: message, 
                role: 'user'
            }]
        })
    }
    try{
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", options);
        const data = await response.json();
        return res.send(data.choices[0].message.content); //reply
    } catch(err){
        console.log(err);
    }
}

export default getOpenAIAPIResponse;