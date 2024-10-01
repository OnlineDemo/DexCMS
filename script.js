// Initialize Supabase client
const supabaseUrl = 'https://ymcuabrefvksznctfbgb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY3VhYnJlZnZrc3puY3RmYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3NDcwOTEsImV4cCI6MjA0MzMyMzA5MX0.HsrJPvI8mewVjz9KJUxCB9MxHoNTJsxfychhOznAImk';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Function to log in a user (replace with actual input later)
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
    }
}

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

// Add event listener for the Edit button (to login and load content)
document.getElementById('editBtn').addEventListener('click', () => {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    login(email, password);
});
