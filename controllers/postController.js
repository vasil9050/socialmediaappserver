import { db } from "../config/db.js"

export const addPost = async (req, res) => {
    const { desc, img, userId } = req.body;
    console.log(req.body);

    // Validate input
    if (!desc || !userId) {
        return res.status(400).json({ error: "Description and userId are required." });
    }

    const query = `
      INSERT INTO post (\`desc\`, img, userId, createdAt, updatedAt)
      VALUES (?, ?, ?, NOW(), NOW())
    `;

    try {
        const [result] = await db.query(query, [desc, img || null, userId]);

        if (!result || result.length === 0) {
            return res.json([]);
        }
        console.log(result);
        res.status(201).json({
            message: "Post added successfully!",
            postId: result.insertId,
        });

    } catch (err) {
        console.error("Error adding post:", err.message);
        return res.status(500).json({ error: "Failed to insert post." });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    const query = `SELECT post.* FROM post JOIN user ON post.userId = user.id WHERE post.id = ?`;


    console.log('Executing query:', query, 'with id:', id);

    try {
        const [result] = await db.query(query, [id]);

        if (!result || result.length === 0) {
            return res.json([]);
        }
        console.log(result);
        res.status(200).json(result[0]);

    } catch (err) {
        console.error("Error getting post:", err.message);
        return res.status(500).json({ error: "Failed to insert post." });
    }

};

export const getPostsByUsername = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username is required." });
    }

    const query = `
        SELECT 
    p.id AS postId, 
    p.desc AS description, 
    p.img AS image, 
    p.createdAt AS postCreatedAt, 
    u.id AS userId, 
    u.username, 
    u.avatar, 
    (SELECT COUNT(*) FROM likes WHERE postId = p.id) AS likesCount,
    (SELECT COUNT(*) FROM comment WHERE postId = p.id) AS commentsCount,
 (SELECT GROUP_CONCAT(userId) FROM likes WHERE postId = p.id) AS likedUsers FROM post p
JOIN user u ON p.userId = u.id
WHERE u.username = ?
ORDER BY p.createdAt DESC;
    `;

    try {
        const [result] = await db.query(query, [username]);

        if (!result || result.length === 0) {
            return res.json([]);
        }


        const formattedPosts = result.map(post => ({
            ...post,
            likedUsers: post.likedUsers ? post.likedUsers.split(',') : [],
        }));

        console.log(formattedPosts);
        res.status(200).json(formattedPosts);

    } catch (err) {
        console.error("Error inserting post on home:", err.message);
        return res.status(500).json({ error: "Failed to insert post." });
    }
};


export const getHomePagePosts = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
SELECT 
    p.id AS postId, 
    p.desc AS description, 
    p.img AS image, 
    p.createdAt AS postCreatedAt, 
    u.id AS userId, 
    u.username, 
    u.avatar, 
    (SELECT COUNT(*) FROM likes WHERE postId = p.id) AS likesCount,
    (SELECT COUNT(*) FROM comment WHERE postId = p.id) AS commentsCount,
 (SELECT GROUP_CONCAT(userId) FROM likes WHERE postId = p.id) AS likedUsers FROM post p
JOIN user u ON p.userId = u.id
WHERE p.userId = ? OR p.userId IN (
    SELECT followingId 
    FROM follower 
    WHERE followerId = ?
)
ORDER BY p.createdAt DESC;
    `;
    try {
        const [result] = await db.query(query, [userId, userId]);

        if (!result || result.length === 0) {
            return res.json([]);
        }

        const formattedPosts = result.map(post => ({
            ...post,
            likedUsers: post.likedUsers ? post.likedUsers.split(',') : [],
        }));

        console.log(formattedPosts);
        res.status(200).json(formattedPosts);
    } catch (err) {
        console.error("Error inserting post on home:", err.message);
        return res.status(500).json({ error: "Failed to insert post." });
    }
};

export const deletePost = async (req, res) => {
    const { id, userId } = req.body;

    if (!id) {
        return res.status(400).json({ message: "ID is required." });
    }

    const query = `DELETE FROM post WHERE id = ? AND userId = ?`;

    try {
        const [result] = await db.query(query, [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Post not found." });
        }

        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};