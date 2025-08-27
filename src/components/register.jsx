import React, { useState,useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    fetch(`${import.meta.env.VITE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const text = await response.text();
        try {
          const result = JSON.parse(text);
          setResponseData(result);
          alert('Registration successful! Please save your VIBE Number and Unique ID.');

        } catch (e) {
          alert(`Registration failed: ${text}`);
          setResponseData(null);
        }
      })
      .catch((error) => {
        // handle error
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="register-container" id="register-container">
      <form onSubmit={handleSubmit} className="register-form" id="register-form">
        <h2 className="register-title" id="register-title">STEP INTO THE VIBE</h2>
        <div className="form-group" id="form-group-name">
          <label htmlFor="name" className="form-label">Name:</label>
          <input type="text" name="name" id="name" className="form-input" required />
        </div>
        <div className="form-group" id="form-group-email">
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" name="email" id="email" className="form-input" required />
        </div>
        <div className="form-group" id="form-group-mobile">
          <label htmlFor="mobile" className="form-label">Mobile Number:</label>
          <input type="tel" name="mobile" id="mobile" className="form-input" required />
        </div>
        <div className="form-group" id="form-group-level">
          <label htmlFor="level" className="form-label">Graduation Level:</label>
          <select name="level" id="level" className="form-select" required>
            <option value="">Select Level</option>
            <option value="1">Under Graduate</option>
            <option value="2">Post Graduate</option>
          </select>
        </div>
        <div className="form-group" id="form-group-college">
          <label htmlFor="college" className="form-label">College:</label>
          <input type="text" name="college" id="college" className="form-input" required />
        </div>
        <div className="form-group" id="form-group-year">
          <label htmlFor="year" className="form-label">Year of Study:</label>
          <select name="year" id="year" className="form-select" required>
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div className="form-group" id="form-group-department">
          <label htmlFor="department" className="form-label">Department:</label>
          <input type="text" name="department" id="department" className="form-input" required />
        </div>
        <div className="form-group" id="form-group-event">
          <label htmlFor="event" className="form-label">Event Name:</label>
          <select name="event" id="event" className="form-select" required>
            <option value="">Select Event</option>
            <option value="Event1">Event 1</option>
            <option value="Event2">Event 2</option>
            <option value="Event3">Event 3</option>
            <option value="Event4">Event 4</option>
            <option value="Event5">Event 5</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="register-btn" id="register-btn">Register</button>
      </form>

      {/* Loader */}
      {loading && (
        <div className="loader" id="loader" style={{ marginTop: "20px", textAlign: "center" }}>
          <span>Loading...</span>
        </div>
      )}

      {/* Display Serial Number, Unique ID, and QR Code */}
      {responseData && (
        <div className="registration-success" id="registration-success" style={{ marginTop: "20px" }}>
          <h3 className="success-title" id="success-title">Registration Successful!</h3>
          <p className="success-serial" id="success-serial">VIBE Number: {responseData.serialNumber}</p>
          
          <QRCodeCanvas
            value={responseData.uniqueId}
            size={128}
            bgColor="#ffffff"
            style={{ padding: "16px", background: "#fff" }}
            className="qr-code-canvas"
            id="qr-code-canvas"
          />
          <button
          className="register-btn"
            onClick={() => {
              // Poster size (you can scale this up/down)
              const W = 800;
              const H = 1200;

              // Layout metrics
              const topGap = 40;
              const qrCardSize = 420;
              const qrPaddingInside = 36; // padding inside the white QR card for the qrCanvas
              const qrCardX = (W - qrCardSize) / 2;
              const qrCardY =380;

              // Create canvas
              const canvas = document.createElement("canvas");
              canvas.width = W;
              canvas.height = H;
              const ctx = canvas.getContext("2d");

              // --- Background gradient (purple -> teal) ---
              const g = ctx.createLinearGradient(0, 0, 0, H);
              g.addColorStop(0, "#4b0082"); // deep purple
              g.addColorStop(0.45, "#6a39c6");
              g.addColorStop(1, "#2bd1c9"); // teal-ish
              ctx.fillStyle = g;
              ctx.fillRect(0, 0, W, H);

              // --- Big top text: PERIYAR / UNIVERSITY ---
              ctx.textAlign = "center";
              ctx.shadowColor = "rgba(0,0,0,0.25)";
              ctx.shadowBlur = 8;
              ctx.fillStyle = "#c8ffd6"; // mint green for PERIYAR
              ctx.font = "bold 86px Arial";
              ctx.fillText("PERIYAR", W / 2, topGap + 90);

              ctx.fillStyle = "#ffffff"; // white for UNIVERSITY
              ctx.font = "600 56px Arial";
              ctx.fillText("UNIVERSITY", W / 2, topGap + 170);

              // --- Registration Successful (subheading) ---
              ctx.shadowBlur = 6;
              ctx.fillStyle = "#ffffff";
              ctx.font = "600 34px Arial";
              ctx.fillText("REGISTRATION SUCCESSFUL", W / 2, topGap + 230);
              ctx.shadowBlur = 0; // reset

              // --- QR Card with shadow (white rectangle with subtle drop shadow) ---
              ctx.save();
              ctx.shadowColor = "rgba(0,0,0,0.35)";
              ctx.shadowBlur = 20;
              ctx.shadowOffsetY = 50;
              ctx.shadowOffsetX = -50;
              // Draw white rounded rectangle (manual rounded rect)
              const r = 6; // corner radius
              ctx.fillStyle = "#ffffff";
              ctx.beginPath();
              ctx.moveTo(qrCardX + r, qrCardY);
              ctx.lineTo(qrCardX + qrCardSize - r, qrCardY);
              ctx.quadraticCurveTo(qrCardX + qrCardSize, qrCardY, qrCardX + qrCardSize, qrCardY + r);
              ctx.lineTo(qrCardX + qrCardSize, qrCardY + qrCardSize - r);
              ctx.quadraticCurveTo(qrCardX + qrCardSize, qrCardY + qrCardSize, qrCardX + qrCardSize - r, qrCardY + qrCardSize);
              ctx.lineTo(qrCardX + r, qrCardY + qrCardSize);
              ctx.quadraticCurveTo(qrCardX, qrCardY + qrCardSize, qrCardX, qrCardY + qrCardSize - r);
              ctx.lineTo(qrCardX, qrCardY + r);
              ctx.quadraticCurveTo(qrCardX, qrCardY, qrCardX + r, qrCardY);
              ctx.closePath();
              ctx.fill();
              ctx.restore();

              // --- Optional angled soft shadow on right (like the example) ---
              // a subtle long shadow block to the right-bottom
              ctx.save();
              ctx.globalAlpha = 0.08;
              ctx.fillStyle = "#000000";
              ctx.fillRect(qrCardX + qrCardSize + 20, qrCardY + 50, 160, 80);
              ctx.restore();

              // --- Draw green corner markers inside the QR card (like the poster) ---
              const cornerColor = "#bff7c7";
              const markLen = 70;
              const markW = 14;
              ctx.strokeStyle = cornerColor;
              ctx.lineWidth = markW;
              ctx.lineCap = "round";

              // Top-left
              ctx.beginPath();
              ctx.moveTo(qrCardX + qrPaddingInside + markLen, qrCardY + qrPaddingInside);
              ctx.lineTo(qrCardX + qrPaddingInside, qrCardY + qrPaddingInside);
              ctx.lineTo(qrCardX + qrPaddingInside, qrCardY + qrPaddingInside + markLen);
              ctx.stroke();

              // Top-right
              ctx.beginPath();
              ctx.moveTo(qrCardX + qrCardSize - qrPaddingInside - markLen, qrCardY + qrPaddingInside);
              ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrPaddingInside);
              ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrPaddingInside + markLen);
                ctx.stroke();

              // Bottom-left
              ctx.beginPath();
              ctx.moveTo(qrCardX + qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside - markLen);
              ctx.lineTo(qrCardX + qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside);
              ctx.lineTo(qrCardX + qrPaddingInside + markLen, qrCardY + qrCardSize - qrPaddingInside);
              ctx.stroke();

              // Bottom-right
              ctx.beginPath();
              ctx.moveTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside - markLen);
              ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside);
              ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside - markLen, qrCardY + qrCardSize - qrPaddingInside);
              ctx.stroke();

              // --- Draw the actual QR (from existing canvas on page) ---
              const qrCanvas = document.querySelector("canvas"); // assumes the QR canvas exists on page
              if (qrCanvas) {
                // Compute area inside the white card for the QR (centered)
                const innerSize = qrCardSize - qrPaddingInside * 2;
                const innerX = qrCardX + qrPaddingInside;
                const innerY = qrCardY + qrPaddingInside;
                try {
                  ctx.drawImage(qrCanvas, innerX, innerY, innerSize, innerSize);
                } catch (e) {
                  // fallback: draw text placeholder if QR not available
                  ctx.fillStyle = "#f3f3f3";
                  ctx.fillRect(innerX, innerY, innerSize, innerSize);
                  ctx.fillStyle = "#444";
                  ctx.font = "22px Arial";
                  ctx.textAlign = "center";
                  ctx.fillText("QR CODE", innerX + innerSize / 2, innerY + innerSize / 2 + 8);
                }
              }

              // --- Bottom details (NAME, SERIAL NUMBER, EVENT) ---
              const bottomStartY = qrCardY + qrCardSize + 90;
              ctx.textAlign = "center";
              ctx.fillStyle = "#ffffff";
              ctx.font = "700 34px Arial";
              // slight shadow for emboss effect
              ctx.shadowColor = "rgba(0,0,0,0.35)";
              ctx.shadowBlur = 8;
              if (responseData && responseData.name) {
                ctx.fillText((responseData.name || "NAME").toUpperCase(), W / 2, bottomStartY);
              } else {
                ctx.fillText("NAME", W / 2, bottomStartY);
              }
              ctx.fillText((responseData && responseData.serialNumber) ? String(responseData.serialNumber).toUpperCase() : "SERIAL NUMBER", W / 2, bottomStartY + 54);
              ctx.fillText((responseData && responseData.event) ? String(responseData.event).toUpperCase() : "EVENT", W / 2, bottomStartY + 108);
              ctx.shadowBlur = 0;

              // --- Small footer / stamp (optional) ---
              ctx.fillStyle = "rgba(255,255,255,0.12)";
              ctx.font = "14px Arial";
              ctx.fillText("Powered by Periyar University - Event Registration", W / 2, H - 24);

              // --- Download image ---
              const url = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = url;
              link.download = `qr_${(responseData && responseData.serialNumber) || Date.now()}.png`;
              link.click();
            }}
            style={{ marginTop: "10px" }}
            
          >
            Download QR Code
            
          </button> 
          </div>
      )}
    </div>
  );
};

export default Register;
