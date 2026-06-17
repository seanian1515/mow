async function downloadFolder() {

    const folderUrl =
        document.getElementById("folderUrl").value;

    const status =
        document.getElementById("status");

    status.innerHTML = "Processing...";

    try {

        const response = await fetch("/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                folderUrl
            })
        });

        const data = await response.json();

        if (data.success) {

            status.innerHTML =
                `Folder ID: ${data.folderId}`;

        } else {

            status.innerHTML =
                data.message;
        }

    } catch (err) {

        status.innerHTML =
            "Error: " + err.message;
    }
}