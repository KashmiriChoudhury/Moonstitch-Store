
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error("Supabase credentials are missing. Check your .env file.");
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    }
);
const express = require("express");
const cors= require("cors");

const app = express();

app.use(cors());

// Allows the backend to read JSON data
app.use(express.json());

// Our registration API
// Customer registration API
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name?.trim() || !email?.trim() || !password) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    // Check password length
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters."
        });
    }

    try {
        // Register customer using Supabase Auth
        const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
        data: {
            full_name: name.trim()
        }
    }
    });
    console.log("Session received:", !!data.session);
    console.log("User ID:", data.user?.id);
    console.log("Email confirmed:", data.user?.email_confirmed_at);
    console.log("Signup error:", error);

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(201).json({
            message: "Registration successful!",
            session: data.session
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
});
// Login part



// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
