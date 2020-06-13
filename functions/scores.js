const router = require("express").Router();
const httpContext = require("express-http-context");

const admin = require("firebase-admin");
const firestore = admin.firestore();

router.get("/", async (req, res) => {
    let from = new Date();
    if (!isNaN(parseInt(req.query.days))) from.setDate(from.getDate() - parseInt(req.query.days));
    else from.setDate(from.getDate() - 7);

    let snapshot = await firestore.collection("scores")
        .orderBy("timestamp", "desc")
        .where("user", "==", httpContext.get("uid"))
        .where("timestamp", ">", new admin.firestore.Timestamp(Math.floor(from.getTime() / 1000), 0))
        .get();

    let documents = snapshot.docs.map(doc => Object.assign(doc.data(), { timestamp: doc.data().timestamp._seconds }));

    res.status(200).json({ success: true, data: documents });
});

router.post("/:video", async (req, res) => {
    // Ensure video exists
    let video = await firestore.collection("videos").doc(req.params.video).get();
    if (!video.exists) return res.status(404).json({ success: false, reason: "video does not exist" });

    // Ensure requester has permissions to access video
    let videoData = video.data();
    if (videoData.owner !== httpContext.get("uid") && !videoData.public) return res.status(403).json({ success: false, reason: "user lacks permission to submit scores" });

    // Validate request
    if (typeof req.body.score !== "number") return res.status(400).json({ success: false, reason: "field 'score' must be a number" });

    // Submit scores
    await firestore.collection("scores").add({
        user: httpContext.get("uid"),
        video_id: video.id,
        video_name: videoData.name,
        score: req.body.score,
        timestamp: new admin.firestore.Timestamp(Math.floor((new Date()).getTime() / 1000), 0)
    });

    return res.status(200).json({ success: true });
});

router.get("/:video", async (req, res) => {
    // Ensure video exists
    let video = await firestore.collection("videos").doc(req.params.video).get();
    if (!video.exists) return res.status(404).json({ success: false, reason: "video does not exist" });

    // Ensure requester has permissions to access video
    let videoData = video.data();
    if (videoData.owner !== httpContext.get("uid") && !videoData.public) return res.status(403).json({ success: false, reason: "user lacks permission to submit scores" });

    let from = new Date();
    if (!isNaN(parseInt(req.query.days))) from.setDate(from.getDate() - parseInt(req.query.days));
    else from.setDate(from.getDate() - 7);

    let snapshot = await firestore.collection("scores")
        .orderBy("timestamp", "desc")
        .where("user", "==", httpContext.get("uid"))
        .where("timestamp", ">", new admin.firestore.Timestamp(Math.floor(from.getTime() / 1000), 0))
        .where("video_id", "==", video.id)
        .get();

    let documents = snapshot.docs.map(doc => Object.assign(doc.data(), { timestamp: doc.data().timestamp._seconds }));

    return res.status(200).json({ success: true, data: documents });
});

module.exports = router;
