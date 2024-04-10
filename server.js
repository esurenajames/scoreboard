// server.js

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed

// Set up multer for handling file uploads
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB (increase or decrease as needed)
    },
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});

// Serve HTML, CSS, and JS files
app.use(express.static('public'));

// API endpoint to handle updating scoreboard data
app.put('/volleyball_data', (req, res) => {
    const newData = req.body;
    
    // Read the existing JSON file
    const jsonData = JSON.parse(fs.readFileSync('public/volleyball_data.json', 'utf8'));

    // Update the JSON data with new data
    Object.assign(jsonData, newData);

    // Write the updated JSON data back to the file
    fs.writeFileSync('public/volleyball_data.json', JSON.stringify(jsonData, null, 2));

    res.status(200).send('Volleyball data updated successfully');
});

// API endpoint to handle updating scoreboard data
app.put('/scoreboard', (req, res) => {
    const newData = req.body;
    
    // Read the existing JSON file
    const jsonData = JSON.parse(fs.readFileSync('public/scoreboard_data.json', 'utf8'));

    // Update the JSON data with new data
    Object.assign(jsonData, newData);

    // Write the updated JSON data back to the file
    fs.writeFileSync('public/scoreboard_data.json', JSON.stringify(jsonData, null, 2));

    res.status(200).send('Scoreboard data updated successfully');
});

// API endpoint to save uploaded image to the uploads folder
app.post('/save_image', (req, res) => {
    const { imageData, team } = req.body;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, ''); // Remove header
    const imagePath = `uploads/${team}_logo.png`; // Define the image path

    // Save the image to file
    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving image:', err);
            res.status(500).send('Error saving image');
        } else {
            console.log('Image saved successfully');
            res.status(200).send('Image saved successfully');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
