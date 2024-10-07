const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (e.g., images, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON body
app.use(express.json());

// Example route to fetch content
app.get('/api/content', (req, res) => {
    // Add code here to fetch data from your Supabase database
    res.send('Content fetched successfully');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

