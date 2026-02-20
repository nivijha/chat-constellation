import express from "express";
import Thread from "../models/Thread.js";

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

//Get all threads
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

//Get a particular thread
router.get("/thread/:threadID", async(req, res)=>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.find({threadId});
        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.json(threads.messages);
    } catch(err) {
        console.log(err); 
        res.status(500).json({error: "Failed to fetch threads"});
    }
})

//Delete thread
router.delete("/thread/:threadID", async(req, res)=>{
    const {threadId} = req.params;
    try{
        const deleteThread = await Thread.findByIdAndDelete({threadId});
        if(!deleteThread) {
            res.status(404).json({error: "Thread could not be deleted"});
        }

        res.status(200).json({success : "Thread deleted successfully"});
    } catch(err) {
        console.log(err); 
        res.status(500).json({error: "Failed to delete thread"});
    }
})

export default router;