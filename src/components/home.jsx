import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const staticUsername = "puvibescanner";
    const staticPassword = "@ScAnNeR#";

    if (username === staticUsername && password === staticPassword) {
      // Set session storage with expiry (1 hour)
      const expiryTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour
      sessionStorage.setItem("scanner-auth", JSON.stringify({ loggedIn: true, expiry: expiryTime }));

      navigate("/qr-scanner"); // redirect to dashboard or wherever
    } else {
      setError("Invalid username or password");
    }
  };

  // Check if session expired
  React.useEffect(() => {
    const authData = sessionStorage.getItem("scanner- auth");
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.expiry < new Date().getTime()) {
        sessionStorage.removeItem("auth");
      }
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h1>LOGIN</h1>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", width: "250px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>Login</button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default Home;
