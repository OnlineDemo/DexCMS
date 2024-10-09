const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const { createClient } = require("@supabase/supabase-js"); // Import Supabase client

const app = express();
const port = process.env.PORT || 3000;

// Supabase setup
const supabaseUrl = "https://ymcuabrefvksznctfbgb.supabase.co"; // Replace with your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY3VhYnJlZnZrc3puY3RmYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3NDcwOTEsImV4cCI6MjA0MzMyMzA5MX0.HsrJPvI8mewVjz9KJUxCB9MxHoNTJsxfychhOznAImk"; // Replace with your Supabase public anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse JSON body
app.use(express.json());

// Serve static files (e.g., images, CSS, etc.)
app.use(express.static(path.join(__dirname, "public")));

//const fs = require("fs-extra");

// API endpoint to fetch content from local JSON
app.get("/api/content", async (req, res) => {
  try {
    // Read from the local JSON file
    const content = await fs.readJson("./data/content.json");

    // Send the content back to the frontend
    res.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API route for saving content
app.put("/api/content", async (req, res) => {
  try {
    const { title, description, image_url } = req.body;

    if (!title || !description || !image_url) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid input data" });
    }

    // Log the incoming data for debugging
    console.log("Received data:", { title, description, image_url });

    // Define the path for saving the content
    const contentFilePath = "./data/content.json";

    // Ensure the `data` directory exists
    await fs.ensureDir("./data");

    // Save the content to a JSON file
    const newContent = { title, description, image_url };
    await fs.writeJson(contentFilePath, newContent);

    // Send success response
    res.json({ success: true, message: "Content updated successfully" });
  } catch (error) {
    console.error("Error saving content:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
