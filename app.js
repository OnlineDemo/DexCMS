const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer"); // Multer for handling file uploads
const { createClient } = require("@supabase/supabase-js"); // Import Supabase client

const app = express();
const port = process.env.PORT || 3000;

// Supabase setup
const supabaseUrl = "https://ymcuabrefvksznctfbgb.supabase.co"; // Replace with your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY3VhYnJlZnZrc3puY3RmYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3NDcwOTEsImV4cCI6MjA0MzMyMzA5MX0.HsrJPvI8mewVjz9KJUxCB9MxHoNTJsxfychhOznAImk"; // Replace with your Supabase public anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to parse JSON body
// app.use(express.json());
// Increase payload size limit to handle large requests (e.g., 10MB)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static files (e.g., images, CSS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Save files to 'public/uploads'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + file.originalname;
    cb(null, uniqueSuffix); // Append timestamp to make filename unique
  },
});
const upload = multer({ storage: storage });

// API route for handling file uploads
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded." });
  }
  // Send the uploaded file's URL back to the client
  res.json({ fileUrl: `/uploads/${req.file.filename}` });
});

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

// // Function to replace placeholders and generate static HTML (old code where the html is written directly without the template file)
// async function generateStaticPage() {
//   try {
//     // Read the current content from the local JSON file
//     const content = await fs.readJson("./data/content.json");

//     // Read the mypage.html template
//     const htmlFilePath = path.join(__dirname, "public", "mypage.html");
//     let htmlContent = await fs.readFile(htmlFilePath, "utf8");

//     // Replace placeholders with actual content
//     htmlContent = htmlContent
//       .replace(/<!-- TITLE_PLACEHOLDER -->/g, content.title)
//       .replace(/<!-- DESCRIPTION_PLACEHOLDER -->/g, content.description)
//       .replace(/<!-- IMAGE_PLACEHOLDER -->/g, content.image_url);

//     // Write the updated HTML back to the file
//     await fs.writeFile(htmlFilePath, htmlContent, "utf8");

//     console.log("Static HTML page generated successfully!");
//   } catch (error) {
//     console.error("Error generating static HTML:", error);
//   }
// }

// // Function to replace placeholders and generate static HTML (old code where the html is written directly with/through the template file every time the page is updated.)
async function generateStaticPage() {
  try {
    // Read the current content from the local JSON file
    const content = await fs.readJson("./data/content.json");

    // Read the mypage-template.html file (which contains the placeholders)
    const templateFilePath = path.join(
      __dirname,
      "public",
      "mypage-template.html"
    );
    let htmlContent = await fs.readFile(templateFilePath, "utf8");

    // Replace placeholders with actual content
    htmlContent = htmlContent
      .replace(/<!-- TITLE_PLACEHOLDER -->/g, content.title)
      .replace(/<!-- DESCRIPTION_PLACEHOLDER -->/g, content.description)
      .replace(/<!-- IMAGE_PLACEHOLDER -->/g, content.image_url);

    // Write the updated content to mypage.html
    const outputFilePath = path.join(__dirname, "public", "mypage.html");
    await fs.writeFile(outputFilePath, htmlContent, "utf8");

    console.log("Static HTML page generated successfully!");
  } catch (error) {
    console.error("Error generating static HTML:", error);
  }
}

// // API route for saving content (old code)
// app.put("/api/content", async (req, res) => {
//   try {
//     const { title, description, image_url } = req.body;

//     if (!title || !description || !image_url) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Invalid input data" });
//     }

//     // Log the incoming data for debugging
//     console.log("Received data:", { title, description, image_url });

//     // Define the path for saving the content
//     const contentFilePath = "./data/content.json";

//     // Ensure the `data` directory exists
//     await fs.ensureDir("./data");

//     // Save the content to a JSON file
//     const newContent = { title, description, image_url };
//     await fs.writeJson(contentFilePath, newContent);

//     // Send success response
//     res.json({ success: true, message: "Content updated successfully" });
//   } catch (error) {
//     console.error("Error saving content:", error);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// // API route for saving content (new version for ssg geneartion)
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

    // Call the function to generate the static HTML page
    await generateStaticPage();

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
