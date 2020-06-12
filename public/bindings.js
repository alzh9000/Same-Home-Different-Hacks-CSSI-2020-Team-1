const url = "http://localhost:5001/daince-b612d/us-central1/api";

// Helper function
async function sendRequest(method, path, body= null) {
    // Build request
    let options = { method: method, headers: {}, credentials: "include" }

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

// Generate a uuid
function uuid() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
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

class Videos {
    // List all a user's files and the public files
    static async list() {
        return await sendRequest("GET", "/videos");
    }

    // Upload a file
    static async upload(file, name, pub, timestamps, status_callback=(snap) => console.log(snap.bytesTransferred / snap.totalBytes) * 100, error_callback=console.error) {
        let uid = localStorage.getItem("uid");
        let path = `${uid}/${uuid()}.mp4`;
        let ref = firebase.storage().ref().child(path);

        // Upload the file
        let upload = ref.put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED, status_callback, error_callback);
        await upload;

        // Get URL
        let download_url = await upload.snapshot.ref.getDownloadURL();

        // Send request to add to database
        return await sendRequest("POST", "/videos", {
            name: name,
            path: path,
            url: download_url,
            public: pub,
            timestamps: timestamps
        });
    }

    // Get the data for a video
    static async read(id) {
        return await sendRequest("GET", `/videos/${id}`);
    }

    // Delete a video
    static async delete(id) {
        return await sendRequest("DELETE", `/videos/${id}`);
    }
}
