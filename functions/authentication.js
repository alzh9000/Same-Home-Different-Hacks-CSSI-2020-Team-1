const router = require("express").Router();
const httpContext = require("express-http-context");

const admin = require("firebase-admin");

// week long token lifetime
const expiresIn = 60 * 60 * 24 * 7 * 1000;
const options = { maxAge: expiresIn, httpOnly: true, secure: false, sameSite: "none" };

// Create a session token for a user
router.get("/session", (req, res) => {
    // Ensure authorization header is present
    if (!req.get("Authorization") || !req.get("Authorization").startsWith("Bearer ")) {
        res.status(401).json({ success: false, reason: "unauthorized" });
        return;
    }
    let token = req.get("Authorization").split("Bearer ")[1];

    // Attempt to create session cookie
    admin.auth().createSessionCookie(token, { expiresIn })
        .then(cookie => {
            res.cookie("__session", cookie, options);
            return res.status(200).json({ success: true });
        })
        .catch(_ => res.status(401).json({ success: false, reason: "unauthorized" }));
});

// Logout a user by clearing their cookie
router.get("/logout", async (req, res) => {
    // Clear the cookie`
    res.clearCookie("__session");

    // Revoke the session
    try {
        await admin.auth().revokeRefreshTokens(httpContext.get("sub"))
    } catch (e) {
        res.status(500).json({ success: false, reason: "failed to revoke session" });
        return;
    }

    res.status(200).json({ success: true });
})

module.exports = router;
