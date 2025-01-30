import express from 'express'
import { addPost, deletePost, getHomePagePosts, getPost, getPostsByUsername } from '../controllers/postController.js'

const router = express.Router()

router.post("/addpost", addPost)
router.get("/getpost/:id", getPost)

router.post("/getpostbyusername", getPostsByUsername)
router.post("/gethomepageposts", getHomePagePosts)

router.post("/deletepost", deletePost)

export default router