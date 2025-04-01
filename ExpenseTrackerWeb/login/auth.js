// auth.js

// Handle Sign Up
document.querySelector('.signup form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.querySelector('input[name="txt"]').value;
    const password = e.target.querySelector('input[name="pswd"]').value;

    try {
        const res = await fetch('http://127.0.0.1:8000/auth/register', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
            const errorData = await res.json();
            alert(`Registration error: ${errorData.detail}`);
            return;
        }
        // Optionally, auto-login after registration
        await loginUser(username, password);
    } catch (error) {
        console.error("Error during registration:", error);
    }
});

// Handle Login
document.querySelector('.login form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.querySelector('input[name="email"]').value;
    const password = e.target.querySelector('input[name="pswd"]').value;
    await loginUser(username, password);
});

async function loginUser(username, password) {
    try {
        // FastAPI's OAuth2PasswordRequestForm expects form data,
        // so we send URL-encoded data
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const res = await fetch('http://127.0.0.1:8000/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        });
        if (!res.ok) {
            const errorData = await res.json();
            alert(`Login error: ${errorData.detail}`);
            return;
        }
        const data = await res.json();
        // Store token in localStorage for later use
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('username', username);
        // Redirect to main application (e.g., index.html)
        window.location.href = "../index.html";
    } catch (error) {index
        console.error("Error during login:", error);
    }
}
