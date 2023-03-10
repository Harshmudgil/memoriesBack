import mongoose from 'mongoose';
import PostMessages from '../models/postMessage.js'
import express from 'express';



const router = express.Router();



export const getPost = async (req,res) =>{
    const {id} = req.params;
    try {
        const post = await PostMessages.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({message : error.message});
    }
}

export const getPosts = async (req, res) => {
    const {page} = req.query;
    try {
        const Limit = 8;
        const startIndex = (Number(page)-1) * Limit; 
        const total  = await PostMessages.countDocuments({});
        const posts = await PostMessages.find().sort({_id : -1}).limit(Limit).skip(startIndex);
        const PageNo =  Math.ceil(total/Limit);
        res.status(200).json({data : posts , currentPage : Number(page) , numberOfPages : Number(PageNo)});
    } catch (error) {
        console.log("error controllerrrrrr")
        res.status(404).json(error);
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');

        const posts = await PostMessages.find({$or : [{title},{tags : {$in: tags.split(',')}}]});
        res.json({ data: posts})
    } catch (error) {
        res.status(404).json({message : error.message})
    }
}

export const createPost = async (req, res) => {

    const post = req.body

    const newPost = new PostMessages({ ...post, creator: req.NT, createdAt: new Date().toISOString() });
    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json(error);
    }
}

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const data = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post Post with that id`)
    const updatedPost = await PostMessages.findByIdAndUpdate(_id, { ...data, _id }, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id`);

    await PostMessages.findByIdAndRemove(id);
    res.json({ message: "Deleted the post" });

}


export const likePost = async (req, res) => {
    const { id } = req.params;
    
    if (!req.UserId) return res.json({ message: "unauthenticated" });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessages.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.UserId));

    if (index === -1) {
        post.likes.push(req.UserId);
    } else {
        post.likes = post.likes.filter((id) => id !== req.UserId);
    }
    const updatedPost = await PostMessages.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost)
}

export const commentPost = async (req,res) =>{
    const {id} = req.params;
    const {value} = req.body;
   
    const post = await PostMessages.findById(id);
    post.comments.push(value);
    const updatedPost  = await PostMessages.findByIdAndUpdate(id, post,{ new : true });
    res.json(updatedPost);
}


export default router;