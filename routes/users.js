import express from 'express'
import { addUser, getAllUser, getUser, getUserByUsername, updateUser } from '../controllers/usersController.js'

const router = express.Router()

router.post("/adduser", addUser)
router.post("/updateuser", updateUser)

router.get("/getuser/:id", getUser)
router.get("/getalluser/:word", getAllUser)
router.get("/getuserbyusername/:username", getUserByUsername)

export default router