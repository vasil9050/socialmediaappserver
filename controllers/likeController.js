import { db } from "../config/db.js";

export const createLike = async (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res.status(400).json({ message: "userId and postId are required." });
    }

    const query = `INSERT INTO likes (userId, postId) VALUES (?, ?)`;

    try {
        const [result] = await db.query(query, [userId, postId]);

        if (!result || result.length === 0) {
            return res.json([]);
        }
        console.log(result[0]);
        res.status(200).json(result[0]);

    } catch (err) {
        console.error("Error creating post:", err.message);
        return res.status(500).json({ error: "Failed to insert post." });
    }
};

export const findLikesForPost = async (req, res) => {
    const { postId, userId } = req.body;

    if (!postId) {
        return res.status(400).json({ message: "postId is required." });
    }

    const query = `SELECT * FROM likes WHERE userId = ? AND postId = ?`;

    try {
        const [result] = await db.query(query, [userId, postId]);

        if (!result || result.length === 0) {
            res.status(200).json([]);
        }
        console.log(result[0]);
        res.status(200).json(result[0]);

    } catch (err) {
        console.error("Error deleteing post:", err.message);
        return res.status(500).json({ error: "Failed to insert post." });
    }
};



export const deleteLike = async (req, res) => {
    const { id } = req.body;

    console.log(req.body);


    if (!id) {
        return res.status(400).json({ message: "id is required." });
    }

    const query = `DELETE FROM likes WHERE id = ?`;

    try {
        const [result] = await db.query(query, [id]);

        if (!result || result.length === 0) {
            return res.json([]);
        }
        console.log(result);
        res.status(200).json(result);

    } catch (err) {
        console.error("Error deleteing post:", err.message);
        return res.status(500).json({ error: "Failed to insert post." });
    }
};
