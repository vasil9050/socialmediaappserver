import { db } from "../config/db.js"

export const createFollowRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ error: "Sender ID and Receiver ID are required." });
    }

    // SQL query to insert a new follow request
    const query = `
        INSERT INTO followrequest (senderId, receiverId, createdAt)
        VALUES (?, ?, NOW())
    `;

    try {
        const [result] = await db.query(query, [senderId, receiverId]);

        res.status(201).json({
            message: "Follow request created successfully.",
            followRequestId: result.insertId
        });
    } catch (err) {
        console.error("Error creating follow request:", err.message);
        return res.status(500).json({ error: "Database error occurred." });
    }
};

export const acceptFollowRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ message: "Sender and receiver IDs are required." });
    }

    console.log(req.body);


    const deleteQuery = `
        DELETE FROM followrequest WHERE senderId = ? AND receiverId = ?
    `;

    const insertQuery = `
        INSERT INTO follower (followerId, followingId, createdAt)
        VALUES (?, ?, NOW())
    `;

    try {
        // Delete the follow request
        const [deleteResult] = await db.query(deleteQuery, [senderId, receiverId]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: "Follow request not found." });
        }

        // Insert the new follower
        const [insertResult] = await db.query(insertQuery, [senderId, receiverId]);

        // Respond with success
        return res.status(200).json({
            message: "Follow request accepted.",
            followerId: insertResult.insertId
        });
    } catch (err) {
        console.error("Error processing follow request:", err.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const declineFollowRequest = async (req, res) => {
    const { id } = req.body;
    console.log(req.body);

    if (!id) {
        return res.status(400).json({ error: "Follow request ID is required." });
    }

    const query = `
        DELETE FROM followrequest
        WHERE id = ?
    `;

    try {
        const [result] = await db.query(query, [id]);

        if (!result || result.length === 0) {
            return res.json([]);
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Follow request not found." });
        }

        res.status(200).json({ message: "Follow request deleted successfully." });
    } catch (err) {
        console.error("Error deleting follow request:", err.message);
        return res.status(500).json({ error: "Database error occurred." });
    }
};


export const unfollow = async (req, res) => {
    const { id } = req.body;
    console.log(req.body);

    if (!id) {
        return res.status(400).json({ error: "Follower ID is required." });
    }

    const query = `
        DELETE FROM follower
        WHERE id = ?
    `;

    try {
        const [result] = await db.query(query, [id]);

        if (!result || result.length === 0) {
            return res.json([]);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Follower not found." });
        }

        res.status(200).json({ message: "Follower deleted successfully." });
    } catch (err) {
        console.error("Error deleting follower:", err.message);
        return res.status(500).json({ error: "Database error occurred." });
    }

};

// // Get Follow Requests
// export const getFollowRequests = async (req, res) => {
//     const { userId } = req.params;

//     if (!userId) {
//         return res.status(400).json({ message: "User ID is required." });
//     }

//     const query = `
//         SELECT followrequest.senderId, user.username, user.avatar
//         FROM followrequest
//         JOIN user ON followrequest.senderId = user.id
//         WHERE followrequest.receiverId = ?
//     `;

//     try {
//         const [rows] = await db.execute(query, [userId]);
//         res.status(200).json(rows);
//     } catch (error) {
//         console.error("Error fetching follow requests:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

export const isUserFollowed = async (req, res) => {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
        return res.status(400).json({ message: "Both followerId and followingId are required." });
    }

    const query = `
        SELECT 
            *, 
            1 AS isFollowing
        FROM 
            follower
        WHERE 
            followerId = ? AND followingId = ?
        LIMIT 1
    `;

    try {
        const [result] = await db.query(query, [followerId, followingId]);

        if (!result || result.length === 0) {
            return res.json([]);
        }

        if (result.length > 0) {
            // User is being followed
            return res.status(200).json(result[0]);
        }

        // User is not being followed
        return res.status(200).json([{ isFollowing: 0 }]);
    } catch (err) {
        console.error("Error checking follow status:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const isUsersentFollowreq = async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ message: "senderId and receiverId are required." });
    }

    const query = `
        SELECT 
            *, 
            1 AS isFollowreq 
        FROM 
            followrequest 
        WHERE 
            senderId = ? AND receiverId = ?
        LIMIT 1

    `;

    try {
        const [result] = await db.query(query, [senderId, receiverId]);

        if (!result || result.length === 0) {
            return res.json([]);
        }

        if (result.length > 0) {
            // Follow request found
            return res.status(200).json(result[0]);
        }

        // No follow request found
        return res.status(200).json([{ followReqRes: 0 }]);
    } catch (err) {
        console.error("Error updating user profile:", err.message);
        return res.status(500).json({ error: "Database error occurred." });
    }
};

export const getAllFollowReq = async (req, res) => {
    const { receiverId } = req.body;
    console.log(req.body);

    if (!receiverId) {
        return res.status(400).json({ message: "receiverId is required." });
    }

    const query = `
        SELECT 
            fr.*,
            sender.username AS senderUsername,
            sender.avatar AS senderAvatar,
            sender.name AS senderName,
            sender.surname AS senderSurname,
            receiver.username AS receiverUsername,
            receiver.avatar AS receiverAvatar,
            receiver.name AS receiverName,
            receiver.surname AS receiverSurname
        FROM 
            followrequest fr
        INNER JOIN 
            User sender ON fr.senderId = sender.id
        INNER JOIN 
            User receiver ON fr.receiverId = receiver.id
        WHERE 
            fr.receiverId = ?
    `;

    try {
        const [result] = await db.query(query, [receiverId]);

        console.log("result>>>", result);


        if (!result || result.length === 0) {
            return res.status(200).json([]);
        }


        if (result.length > 0) {
            console.log(result);
            return res.status(200).json(result);
        }

    } catch (err) {
        console.error("Error updating user profile:", err.message);
        return res.status(500).json({ error: "Database error occurred." });
    }

};

export const getUserConnections = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    // Query to fetch followers
    const followersQuery = `
        SELECT 
            u.id, u.username, u.avatar, u.name, u.surname, 'follower' AS type
        FROM 
            user u
        INNER JOIN 
            follower f 
        ON 
            u.id = f.followerId
        WHERE 
            f.followingId = ?;
    `;

    // Query to fetch following
    const followingQuery = `
        SELECT 
            u.id, u.username, u.avatar, u.name, u.surname, 'following' AS type
        FROM 
            user u
        INNER JOIN 
            follower f 
        ON 
            u.id = f.followingId
        WHERE 
            f.followerId = ?;
    `;

    try {
        const [result1] = await db.query(followersQuery, [userId]);
        const [result2] = await db.query(followingQuery, [userId]);


        if (!result1 || !result2 || result1.length === 0 || result2.length === 0) {
            return res.status(200).json([]);
        }

        console.log("result1 and result2", result1, result2);
        

        res.status(200).json([...result1, ...result2]);

    } catch (err) {
        console.error("Error fetching followers or follwings:", followersErr.message);
        return res.status(500).json({ message: "Error fetching followers." });
    }
};
