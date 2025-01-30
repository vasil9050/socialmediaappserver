import { db } from "../config/db.js"

export const messageSend = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    console.log(req.body);

    if (!senderId || !receiverId || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if sender and receiver are connected
    const connectionQuery = `
        SELECT * FROM follower
        WHERE (followerId = ? AND followingId = ?)
           OR (followerId = ? AND followingId = ?)
    `;
    const [connection] = await db.query(connectionQuery, [senderId, receiverId, receiverId, senderId]);

    if (!connection.length) {
        return res.status(403).json({ error: 'Users are not connected' });
    }

    // Insert message
    const query = 'INSERT INTO chat (senderId, receiverId, message) VALUES (?, ?, ?)';
    await db.query(query, [senderId, receiverId, message]);

    res.status(201).json({ success: true, message: 'Message sent' });
}

export const chatHistory = async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'Both senderId and receiverId are required' });
    }

    const query = `
        SELECT senderId, receiverId, message, createdAt 
        FROM chat 
        WHERE (senderId = ? AND receiverId = ?)
           OR (senderId = ? AND receiverId = ?)
        ORDER BY createdAt ASC
    `;
    const [history] = await db.query(query, [senderId, receiverId, receiverId, senderId]);

    console.log("history", history);
    

    res.status(200).json({ success: true, history });
}
