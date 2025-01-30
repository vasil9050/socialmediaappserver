import express from 'express'
import { createLike, deleteLike, findLikesForPost } from '../controllers/likeController.js'

const router = express.Router()

router.post("/createlike", createLike)
router.post("/deletelike", deleteLike)
router.post("/getLike", findLikesForPost)

export default router