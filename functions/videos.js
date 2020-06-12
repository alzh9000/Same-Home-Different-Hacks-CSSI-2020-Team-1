const router = require("express").Router();
const httpContext = require("express-http-context");
const common = require("./common");

const admin = require("firebase-admin");
const firestore = admin.firestore();

router.get("/", (req, res) =>
    firestore.collection("videos")
        .where("owner", "==", httpContext.get("uid"))
        .where("public", "==", true).get()
        .then(snapshot => snapshot.docs.map(doc => Object.assign(doc.data(), { id: doc.id })))
        .then(documents => res.status(200).json({ success: true, data: documents }))
        .catch(common.internalError(res, "list-videos")));

router.post("/", (req, res) => {
    if (typeof req.body.name !== "string") {
        res.status(400).json({ success: false, reason: "field 'name' must be a string" });
        return;
    } else if (typeof req.body.path !== "string") {
        res.status(400).json({ success: false, reason: "field 'path' must be a string" });
        return;
    } else if (typeof req.body.url !== "string") {
        res.status(400).json({ success: false, reason: "field 'url' must be a string" });
        return;
    } else if (typeof req.body.public !== "boolean") {
        res.status(400).json({ success: false, reason: "field 'public' must be a boolean" });
        return;
    } else if (!Array.isArray(req.body.timestamps)) {
        res.status(400).json({ success: false, reason: "field 'timestamps' must be an array" });
        return;
    }

    // Add data to firestore
    firestore.collection("videos").add({
        owner: httpContext.get("uid"),
        name: req.body.name,
        path: req.body.path,
        url: req.body.url,
        public: req.body.public,
        timestamps: req.body.timestamps
    })
        .then(_ => res.status(200).json({ success: true }))
        .catch(common.internalError(res, "submit-video"));
});

router.get("/:video", async (req, res) => {
    // Ensure video exists
    let video = await firestore.collection("videos").doc(req.params.video).get();
    if (!video.exists) return res.status(404).json({ success: false, reason: "video does not exist" });

    // Ensure owner has permissions to access video
    let videoData = video.data();
    if (videoData.owner !== httpContext.get("uid")) return res.status(403).json({ success: false, reason: "video does not exist" });

    return res.status(200).json({ success: true, data: Object.assign(videoData, { id: video.id }) });
});

router.delete("/:video", async (req, res) => {
    // Ensure video exists
    let video = await firestore.collection("videos").doc(req.params.video).get();
    if (!video.exists) return res.status(404).json({ success: false, reason: "video does not exist" });

    // Ensure owner has permissions to access video
    let videoData = video.data();
    if (videoData.owner !== httpContext.get("uid")) return res.status(403).json({ success: false, reason: "user lacks permissions to delete video" });

    // Delete the document
    await firestore.collection("videos").doc(req.params.video).delete();
    return res.status(200).json({ success: true });
});

module.exports = router;
