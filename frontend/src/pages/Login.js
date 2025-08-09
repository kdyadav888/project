import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { colors, shadows, spacing, typography, borderRadius, transitions } from '../styles/theme';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        <div style={styles.logo}>
          <img 
            src="/lost-found-logo.png" 
            alt="Lost & Found"
            style={styles.logoImage}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
        <h1 style={styles.title}>Lost & Found</h1>
        <p style={styles.subtitle}>Your Campus Lost & Found Solution</p>

        {error && <p style={styles.error}>{error}</p>}

        <button 
          onClick={handleLogin} 
          disabled={loading} 
          style={styles.button}
        >
          <div style={styles.googleButton}>
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              style={styles.googleIcon}
            />
            <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
          </div>
        </button>

        <p style={styles.privacyText}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  card: {
    background: colors.white,
    padding: spacing.xl,
    borderRadius: borderRadius.large,
    boxShadow: shadows.large,
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
    transition: transitions.default,
  },
  logo: {
    marginBottom: spacing.lg,
  },
  logoImage: {
    width: "80px",
    height: "80px",
  },
  title: {
    ...typography.h1,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body1,
    color: colors.gray[600],
    marginBottom: spacing.xl,
  },
  button: {
    width: "100%",
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: typography.button.fontSize,
    backgroundColor: colors.white,
    color: colors.gray[800],
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: borderRadius.medium,
    cursor: "pointer",
    transition: transitions.default,
    marginBottom: spacing.lg,
    "&:hover": {
      backgroundColor: colors.gray[50],
      borderColor: colors.gray[400],
    },
    "&:disabled": {
      opacity: 0.7,
      cursor: "not-allowed",
    },
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  googleIcon: {
    width: "24px",
    height: "24px",
  },
  error: {
    color: colors.error,
    marginBottom: spacing.lg,
    padding: spacing.sm,
    backgroundColor: `${colors.error}15`,
    borderRadius: borderRadius.small,
    fontSize: typography.body2.fontSize,
  },
  privacyText: {
    fontSize: typography.body2.fontSize,
    color: colors.gray[600],
    marginTop: spacing.lg,
  },
};
