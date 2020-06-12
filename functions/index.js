const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const httpContext = require("express-http-context");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://daince-b612d.firebaseio.com"
    });
} else admin.initializeApp();

const app = express();
app.use(cors({ origin: "*" }))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(httpContext.middleware)
    .use((req, res, next) => {
        // Defer to header verification for session generation
        if (req.path === "/authentication/session") {
            next();
            return;
        }

        // Ensure cookie exists
        if (!req.cookies || req.cookies.hasOwnProperty("session")) {
            res.status(401).json({ success: false, reason: "unauthorized" });
            return;
        }

        // Verify cookie value
        admin.auth().verifySessionCookie(req.cookies.session, true)
            .then(claims => {
                httpContext.set("uid", claims.uid);
                return next();
            })
            .catch(_ => res.status(401).json({ success: false, reason: "unauthorized" }));
    })
    .all("*", (_, res) => res.status(404).json({ success: false, reason: "not found" }));

// Export API app as function
exports.api = functions.https.onRequest(app);

// Setup user data on registration
exports.userSetup = functions.auth.user().onCreate(user => admin.firestore().collection("users").doc(user.uid).set({
    name: user.displayName,
    profile: user.photoURL,
    email: user.email
}));

