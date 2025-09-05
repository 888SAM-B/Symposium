import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const TeamScanner = () => {
  const [scannedId, setScannedId] = useState("");
  const [team, setTeam] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

    qrCodeScanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setScannedId(decodedText);
          fetchTeamDetails(decodedText);
        },
        (errorMessage) => {
          console.warn("QR error:", errorMessage);
        }
      )
      .catch((err) => console.error("Unable to start scanner:", err));

    return () => {
      qrCodeScanner.stop().catch((err) => console.error("Stop failed:", err));
    };
  }, []);

  // ✅ Fetch team details
  const fetchTeamDetails = async (uniqueId) => {
    try {
      setMessage("");
      const res = await fetch(`${import.meta.env.VITE_URL}/api/scanner/${uniqueId}`);
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      console.error("Error fetching team:", err);
      setTeam(null);
    }
  };

  // ✅ Mark individual student attendance
  const markStudentAttendance = async (regNo) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL}/api/scanner/attendance/${regNo}`,
        { method: "PUT" }
      );
      const result = await res.json();
      setMessage(result.message);

      // Update local state (mark student as present)
      setTeam((prev) => ({
        ...prev,
        members: prev.members.map((m) =>
          m.regNo === regNo ? { ...m, attendance: true } : m
        ),
      }));
    } catch (err) {
      console.error("Error marking attendance:", err);
      setMessage("Failed to mark attendance");
    }
  };

  const resetScanner = () => {
    setScannedId("");
    setTeam(null);
    setMessage("");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scan QR Code</h2>

      {!scannedId && (
        <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
      )}

      {scannedId && <p>Scanned ID: {scannedId}</p>}

      {team ? (
        <div>
          <h3>Team Details:</h3>
          <p><b>Team Name:</b> {team.teamName}</p>
          <p><b>College:</b> {team.college}</p>
          <p><b>Department:</b> {team.department}</p>
          <p><b>Events:</b> {team.events?.join(", ")}</p>

          <h4>Members:</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {team.members.map((m, idx) => (
              <li key={idx} style={{ margin: "10px 0" }}>
                <b>{m.name}</b> ({m.regNo}) - {m.dept}
                <br />
                Events: {m.events.join(", ")}
                <br />
                {m.attendance ? (
                  <span style={{ color: "green" }}>✅ Present</span>
                ) : (
                  <button onClick={() => markStudentAttendance(m.regNo)}>
                    Mark Present
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : scannedId ? (
        <p>Loading...</p>
      ) : null}

      {message && <p>{message}</p>}

      {scannedId && <button onClick={resetScanner}>Fetch Again</button>}
      <button onClick={() => window.location.reload()}>Scan new QR</button>
    </div>
  );
};

export default TeamScanner;
