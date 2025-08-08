import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

// const allowedDomain = "@xyzcollege.com"; // domain restriction removed

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard/lost');
    }
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Domain restriction removed: allow any email to log in

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      }));

      navigate("/dashboard/lost");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>CampusCrate Login</h1>
        <p>Please sign in using your college email</p>

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleLogin} disabled={loading} style={styles.button}>
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "300px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginTop: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "1rem",
  },
};
