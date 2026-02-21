import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js"

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
router.get("/thread", async(req, res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt:-1});
        // desc order of UpdatedAt 
        res.json(threads);
    } catch(err) {
        console.log(err); 
        res.status(500).json({error: "Failed to fetch threads"});
    }
})

//Get a particular thread /thread/:threadID
router.get("/thread/:threadID", async(req, res)=>{
    const {threadID} = req.params;
    try{
        const thread = await Thread.findOne({threadID});
        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err); 
        res.status(500).json({error: "Failed to fetch threads"});
    }
})

//Delete /thread/:threadID
router.delete("/thread/:threadID", async(req, res)=>{
    const {threadID} = req.params;
    try{
        const deleteThread = await Thread.findOneAndDelete({threadID});
        if(!deleteThread) {
            res.status(404).json({error: "Thread could not be deleted"});
        }

        res.status(200).json({success : "Thread deleted successfully"});
    } catch(err) {
        console.log(err); 
        res.status(500).json({error: "Failed to delete thread"});
    }
})

//POST /chat — new chat in thread
router.post("/chat", async(req, res)=>{
    const {threadID, message} = req.body;

    if(!threadID || !message){
        res.status(400).json({error: "missing required fields"});
    }

    try{
        let thread = await Thread.findOne({threadID});

        if(!thread){
            //create new thread
            thread = new Thread({
                threadID: threadID,
                title: message,
                messages: [{role: "user", content: message}]
            });
        }
        else {
            thread.messages.push({role: "user", content: message});
        }

        const assisstantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({role: "assisstant", content: assisstantReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: assisstantReply});
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
})


export default router;