const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const { createClient } = require('@supabase/supabase-js'); // Import Supabase client

const app = express();
const port = process.env.PORT || 3000;

// Supabase setup
const supabaseUrl = 'https://ymcuabrefvksznctfbgb.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY3VhYnJlZnZrc3puY3RmYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3NDcwOTEsImV4cCI6MjA0MzMyMzA5MX0.HsrJPvI8mewVjz9KJUxCB9MxHoNTJsxfychhOznAImk'; // Replace with your Supabase public anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse JSON body
app.use(express.json());

// Serve static files (e.g., images, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// API route to fetch content
app.get('/api/content', async (req, res) => {
    const { data, error } = await supabase
        .from('content')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching content:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

// API route to update content
app.put('/api/content', async (req, res) => {
    const { title, description, image_url } = req.body;

    const { data, error } = await supabase
        .from('content')
        .update({ title, description, image_url })
        .eq('id', 1); // Adjust the ID as needed

    if (error) {
        console.error('Error updating content:', error);
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
