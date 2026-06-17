const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function extractFolderId(url) {
    const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

app.post("/download", async (req, res) => {

    try {

        const { folderUrl } = req.body;

        const folderId = extractFolderId(folderUrl);

        if (!folderId) {
            return res.status(400).json({
                success: false,
                message: "Invalid Google Drive folder URL"
            });
        }

        const downloadDir = path.join(__dirname, "downloads");

        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
        }

        return res.json({
            success: true,
            message: "Folder accepted",
            folderId
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});