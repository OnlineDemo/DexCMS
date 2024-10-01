import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://ymcuabrefvksznctfbgb.supabase.co'
   const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY3VhYnJlZnZrc3puY3RmYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3NDcwOTEsImV4cCI6MjA0MzMyMzA5MX0.HsrJPvI8mewVjz9KJUxCB9MxHoNTJsxfychhOznAImk'
export const supabase = createClient(supabaseUrl, supabaseKey)
export const user = await supabase.auth.getUser()

// verifies loggedin user with session
export function checkUser() {
    if (user.error != null ) {
        window.location.href = 'login.html'
    } else {
      // console.log('User is xsigned signed in:', data);
     // alert('Logged in successfully!');
      fetchContent(); // Fetch content after successful login
      enableEditing(); // Call to enable editing
    }
}

// Function to sign up a new user with email and password
export async function signUpWithEmail(email, password) {
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      console.error('Error signing up:', error.message);
    } else {
      console.log('User signed up:', user);
    }
  }
  
// Function to sign in an existing user with email and password
export async function signInWithEmail(email, password) {
    const { data, error }  = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      console.error('Error signing in:', error.message);
    } else {
      console.log('User signed in:', data);
      window.location.href = 'home.html'
    }
}
  
// Function to sign out the current user
export async function signOut() {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      alert('Error signing out:', error.message);
    } else {
      window.location.href = 'login.html'
    }
}
