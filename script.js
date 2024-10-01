// Initialize Supabase client
const supabaseUrl = 'https://ymcuabrefvksznctfbgb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY3VhYnJlZnZrc3puY3RmYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3NDcwOTEsImV4cCI6MjA0MzMyMzA5MX0.HsrJPvI8mewVjz9KJUxCB9MxHoNTJsxfychhOznAImk';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Fetch content from Supabase
async function fetchContent() {
    const { data, error } = await supabase
        .from('content')
        .select('*')
        .single(); // Assuming there's only one row

    if (error) {
        console.error('Error fetching content:', error.message);
    } else {
        document.getElementById('title').innerText = data.title;
        document.getElementById('description').innerText = data.description;
        document.getElementById('image').src = data.image_url;
    }
}

// Function to log in a user
async function login(email, password) {
    const { user, error } = await supabase.auth.signIn({
        email: email,
        password: password
    });

    if (error) {
        console.error('Login failed:', error.message);
        alert('Login failed: ' + error.message);
    } else {
        console.log('User logged in:', user);
        alert('Logged in successfully!');
        // Fetch content after login
        fetchContent();
        enableEditing();
    }
}

// Function to enable editing
function enableEditing() {
    // Make title and description content editable
    document.getElementById('title').contentEditable = true;
    document.getElementById('description').contentEditable = true;
    
    // Enable the Save button
    document.getElementById('saveBtn').disabled = false;

    // Allow user to select an image
    document.getElementById('image').addEventListener('click', () => {
        const newImageUrl = prompt('Enter the new image URL:');
        if (newImageUrl) {
            document.getElementById('image').src = newImageUrl;
        }
    });
}

// Save the edited content back to Supabase
async function saveContent() {
    const updatedTitle = document.getElementById('title').innerText;
    const updatedDescription = document.getElementById('description').innerText;
    const updatedImageUrl = document.getElementById('image').src;

    const { data, error } = await supabase
        .from('content')
        .update({
            title: updatedTitle,
            description: updatedDescription,
            image_url: updatedImageUrl
        })
        .eq('id', 1); // Assuming the ID of the content row is 1

    if (error) {
        console.error('Error saving content:', error.message);
        alert('Failed to save content: ' + error.message);
    } else {
        alert('Content saved successfully!');
    }
}

// Event listeners for buttons
document.getElementById('editBtn').addEventListener('click', () => {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    login(email, password);
});

document.getElementById('saveBtn').addEventListener('click', () => {
    saveContent();
});
