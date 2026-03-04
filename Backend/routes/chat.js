import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import crypto from "crypto";
import auth from "../middleware/auth.js";

const router = express.Router();

//test
router.post("/test", async(req, res)=>{
    try{
        const thread = new Thread({
            threadID: "xyz",
            title: "Testing new Thread"
        })
        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
})

//Get all threads /thread
router.get("/thread", auth, async(req, res)=>{
    try{
        const threads = await Thread.find({ userID: req.user.userId }, { messages: 0 }).sort({updatedAt:-1});
        // desc order of UpdatedAt 
        res.json(threads);
    } catch(err) {
        console.log(err); 
        res.status(500).json({error: "Failed to fetch threads"});
    }
})

//Get a particular thread /thread/:threadID
router.get("/thread/:threadID", auth, async(req, res)=>{
    const {threadID} = req.params;
    try{
        const thread = await Thread.findOne({ threadID, userID: req.user.userId });
        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err); 
        res.status(500).json({error: "Failed to fetch thread"}); // Fixed spelling: "threads" to "thread"
    }
})

//Delete /thread/:threadID
router.delete("/thread/:threadID", auth, async(req, res)=>{
    const {threadID} = req.params;
    try{
        const deleteThread = await Thread.findOneAndDelete({ threadID, userID: req.user.userId });
        if(!deleteThread) {
            return res.status(404).json({error: "Thread could not be deleted"});
        }

        res.status(200).json({success : "Thread deleted successfully"});
    } catch(err) {
        console.log(err); 
        res.status(500).json({error: "Failed to delete thread"});
    }
})

//POST /chat — new chat in thread
router.post("/chat", auth, async(req, res)=>{
    const {threadID, message, language, parentId, messageId: providedMessageId} = req.body;

    if(!threadID || !message){
        return res.status(400).json({error: "missing required fields"});
    }

    try{
        let thread = await Thread.findOne({ threadID, userID: req.user.userId });
        let actualParentId = parentId || null;

        if(!thread){
            //create new thread
            thread = new Thread({
                threadID: threadID,
                userID: req.user.userId,
                title: message,
                messages: []
            });
        }
        else if (!actualParentId && thread.messages.length > 0) {
            actualParentId = thread.messages[thread.messages.length - 1].messageId;
        }

        const userMsgId = providedMessageId || crypto.randomUUID();

        thread.messages.push({
            messageId: userMsgId,
            parentId: actualParentId,
            role: "user", 
            content: message
        });

        // Determine if we need a language system prompt
        let systemPrompt = "";
        if (language === "hi") {
            systemPrompt = "CRITICAL: You MUST respond purely in Hindi. Do not use English even if the user asks in English.";
        }

        const assisstantReply = await getOpenAIAPIResponse(message, systemPrompt);
        
        const assistantMsgId = crypto.randomUUID();

        thread.messages.push({
            messageId: assistantMsgId,
            parentId: userMsgId,
            role: "assistant", 
            content: assisstantReply
        });
        
        thread.updatedAt = new Date();

        await thread.save();
        res.json({
            reply: assisstantReply, 
            userMessageId: userMsgId, 
            assistantMessageId: assistantMsgId
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
})


export default router;