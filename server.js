const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();

app.use(cors());
app.use(express.json());

function extractFolderId(url) {
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

// ⚠️ You MUST enable Google Drive API + API key
const API_KEY = "YOUR_GOOGLE_API_KEY";

const drive = google.drive({ version: "v3", auth: API_KEY });

app.post("/list", async (req, res) => {
    try {

        const { folderUrl } = req.body;

        const folderId = extractFolderId(folderUrl);

        if (!folderId) {
            return res.status(400).json({
                success: false,
                message: "Invalid folder URL"
            });
        }

        const response = await drive.files.list({
            q: `'${folderId}' in parents and trashed=false`,
            fields: "files(id, name, mimeType)"
        });

        const files = response.data.files;

        const result = files.map(file => ({
            name: file.name,
            id: file.id,
            url: `https://drive.google.com/uc?id=${file.id}&export=download`
        }));

        res.json({
            success: true,
            files: result
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
