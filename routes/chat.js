import express from 'express'
import { messageSend, chatHistory } from '../controllers/chatController.js';

const router = express.Router()

router.post('/sendmessage', messageSend);
router.post('/chatHistory', chatHistory);

export default router