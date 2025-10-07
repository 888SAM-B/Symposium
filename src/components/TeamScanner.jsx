import React, { useEffect, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import './team.css' // Assuming team.css has styles for .img-pop, .img-pop-up etc.

const TeamScanner = () => {
  const [scannedId, setScannedId] = useState("");
  const [team, setTeam] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // State for image popup
  const [imageUrlPopup, setImageUrlPopup] = useState("");
  const [displayPopup, setDisplayPopup] = useState("none");

  // Function to open image popup
  const openImagePopup = useCallback((imgUrl) => {
    setImageUrlPopup(imgUrl);
    setDisplayPopup("flex");
  }, []);

  // Function to close image popup
  const closeImagePopup = useCallback((e) => {
    // Only close if clicking on the overlay, not the image itself
    if (e.target.classList.contains("img-pop")) {
      setDisplayPopup("none");
      setImageUrlPopup("");
    }
  }, []);

  // ✅ Auth check
  useEffect(() => {
    const authData = sessionStorage.getItem("scanner-auth");
    if (!authData) {
      alert("Please login to continue");
      navigate("/");
      return;
    }

    const parsed = JSON.parse(authData);
    if (parsed.expiry < new Date().getTime()) {
      sessionStorage.removeItem("scanner-auth");
      alert("Session expired. Please login again");
      navigate("/");
      return;
    }
  }, [navigate]);

  // ✅ Start QR Scanner
  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode("reader");
    let isScanning = false; // Flag to prevent multiple starts

    const startScanner = () => {
      if (isScanning) return; // Prevent starting if already scanning
      isScanning = true;

      qrCodeScanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            // Only process if an ID hasn't been set yet (to avoid double processing after a scan)
            if (!scannedId) {
              qrCodeScanner.stop().catch((err) => console.error("Stop failed on scan:", err));
              setScannedId(decodedText);
              fetchTeamDetails(decodedText);
              isScanning = false; // Reset flag after successful scan
            }
          },
          (errorMessage) => {
            // console.warn("QR error:", errorMessage); // Keep for debugging if needed
          }
        )
        .catch((err) => {
          console.error("Unable to start scanner:", err);
          isScanning = false; // Reset flag on error
        });
    };

    // Start scanner only if no ID is scanned
    if (!scannedId) {
      startScanner();
    }

    // Cleanup function
    return () => {
      if (qrCodeScanner.isScanning) { // Check if scanner is active before stopping
        qrCodeScanner.stop().catch((err) => console.error("Stop failed on unmount:", err));
      }
    };
  }, [scannedId]); // Restart effect if scannedId changes (e.g., reset)

  // ✅ Fetch team details by uniqueId
  const fetchTeamDetails = async (uniqueId) => {
    try {
      setMessage("Fetching team details...");
      setTeam(null); // Clear previous team details
      const res = await fetch(`${import.meta.env.VITE_URL}/team-scanner/${uniqueId}`);
      if (!res.ok) throw new Error("Team not found or server error");
      const data = await res.json();
      
      // Find the first member with an imgUrl to use as the team's proof
      const teamProofImg = data.members.find(m => m.imgUrl)?.imgUrl;
      
      setTeam({ ...data, teamProofImg }); // Add teamProofImg to the team state
      setMessage(""); // Clear message on success
    } catch (err) {
      console.error("Error fetching team:", err);
      setTeam(null);
      setMessage("Team not found or a network error occurred. Please try again.");
    }
  };

  // ✅ Mark student attendance (Present/Absent)
  const markStudentAttendance = async (regNo, newStatus) => {
    try {
      setMessage("Updating attendance...");
      const res = await fetch(
        `${import.meta.env.VITE_URL}/scanner/attendance/${regNo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const result = await res.json();
      setMessage(result.message);

      setTeam((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.regNo === regNo ? { ...m, status: newStatus } : m
        ),
      }));
    } catch (err) {
      console.error("Error marking attendance:", err);
      setMessage("Failed to update attendance");
    }
  };

  const resetScanner = () => {
    setScannedId("");
    setTeam(null);
    setMessage("");
    // The useEffect will handle restarting the scanner because scannedId changes
  };

  return (
    <>
      {/* Image Popup */}
      <div className="img-pop" style={{ display: displayPopup }} onClick={closeImagePopup}>
        <div className="img-pop-up">
          <img src={imageUrlPopup} alt="Payment Proof" />
        </div>
      </div>

      <div className="team-scanner-root">
        <div className="scanner-card">
          <h2>Scan QR Code</h2>
          {!scannedId && <div id="reader" className="reader-wrap"></div>}
          {scannedId && <p className="scanned-id">Scanned ID: {scannedId}</p>}

          {team ? (
            <div className="team-details">
              <h3>Team Details:</h3>
              <div className="team-meta">
                <span className="meta-item"><b>Team Name:</b> {team.teamName}</span>
                <span className="meta-item"><b>College:</b> {team.collegeName}</span>
                <span className="meta-item"><b>Department:</b> {team.dept}</span>
                
                {/* Display Team Payment Proof Image */}
                {team.teamProofImg && (
                  <div className="meta-item payment-proof-link">
                    <b>Payment Proof: </b>
                    <p 
                      style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
                      onClick={() => openImagePopup(team.teamProofImg)}
                    >
                      View Proof
                    </p>
                  </div>
                )}
                {!team.teamProofImg && (
                  <span className="meta-item"><b>Payment Proof:</b> N/A</span>
                )}
              </div>

              <h4>Members:</h4>
              <ul className="members-list">
                {team.members.map((m, idx) => (
                  <li key={idx} className="member-item">
                    <div className="memcontainer">
                      <div className="member-left"> {/* Added a div for left side content */}
                        <div className="avatar">{m.name.split(" ").map(n => n[0]).join("")}</div>
                        <div className="member-info">
                          <div className="name">{m.name} ({m.regNo})</div>
                          <div className="meta">{m.events.join(", ")}</div>
                        </div>
                      </div>

                      <div className="member-right"> {/* Added a div for right side content */}
                        <span className={`status-badge ${m.status === "Present" ? "status-present" : "status-absent"}`}>
                          {m.status === "Present" ? "✅ Present" : "❌ Absent"}
                        </span>
                        {m.status === "Present" ? (
                          <button className="btn absent" onClick={() => markStudentAttendance(m.regNo, "Absent")}>
                            Mark Absent
                          </button>
                        ) : (
                          <button className="btn present" onClick={() => markStudentAttendance(m.regNo, "Present")}>
                            Mark Present
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : scannedId ? (
            <p>Loading team...</p>
          ) : null}

          {message && <p className="message">{message}</p>}

          <div className="controls">
            {scannedId && <button className="btn secondary" onClick={resetScanner}>Scan New QR</button>}
            {/* Kept this button for clarity in case 'Scan new QR' (previous reset)
                should trigger a refresh or something different, but 'resetScanner'
                is usually sufficient to clear and restart scan. */}
            {/* <button className="btn secondary" onClick={() => window.location.reload()}>Scan new QR</button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamScanner;