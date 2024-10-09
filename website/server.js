const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Path to the folder where JSON files are stored
const jsonFolder = path.join(__dirname, 'raw_reports');

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to list JSON files dynamically
app.get('/list-json-files', (req, res) => {
    fs.readdir(jsonFolder, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read files' });
        }
        // Filter only .json files
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        res.json(jsonFiles);
    });
});

// Serve the selected JSON file
app.get('/raw_reports/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(jsonFolder, filename);
    
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
