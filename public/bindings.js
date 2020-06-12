const url = "http://localhost:5001/daince-b612d/us-central1/api";

// Helper function
async function sendRequest(method, path, body= null) {
    // Build request
    let options = { method: method, credentials: "include" }

    // Add options for POST/PUT requests
    if ((method === "POST" || method === "PUT") && body !== null) options.headers["Content-Type"] = "application/json";
    if (body !== null) options.body = JSON.stringify(body);

    // Send & parse requests
    let response = await fetch(`${url}${path}`, options);
    let json = await response.json();

    // Generate return data
    let base = { code: response.status, success: json.success }
    if (response.ok) base.data = json.data;
    else base.reason = json.reason;

    return base;
}

class Authentication {
    // Create a session cookie for a user after logging in
    // (this should only be used in `login.html`/`login.js`)
    static async session(token) {
        let response = await fetch(`${url}/authentication/session`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            credentials: "include"
        });
        let json = await response.json();

        // Generate return data
        return { code: response.status, success: json.success };
    }

    // Revoke a user's session
    static async logout() {
        return await sendRequest("GET", "/authentication/logout");
    }
}
