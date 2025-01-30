import express from 'express'
import {
    createFollowRequest,
    acceptFollowRequest,
    declineFollowRequest,
    unfollow,
    getAllFollowReq,
    isUsersentFollowreq,
    isUserFollowed,
    getUserConnections
} from "../controllers/followcontroller.js";
const router = express.Router()

router.post('/followrequest', createFollowRequest);
router.post("/followreqaccepted", acceptFollowRequest);
router.post("/unfollow", unfollow);
router.post("/declinefollowreq", declineFollowRequest);
router.post("/allFollowReq", getAllFollowReq);
router.post("/isfollowing", isUserFollowed);
router.post("/isfollowreqsent", isUsersentFollowreq);
router.post("/getFriends", getUserConnections);




export default router