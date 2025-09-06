import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import './team.css'

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

  // ✅ Fetch team details by uniqueId
  const fetchTeamDetails = async (uniqueId) => {
    try {
      setMessage("");
      const res = await fetch(`${import.meta.env.VITE_URL}/team-scanner/${uniqueId}`);
      if (!res.ok) throw new Error("Team not found");
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      console.error("Error fetching team:", err);
      setTeam(null);
      setMessage("Team not found");
    }
  };

  // ✅ Mark student attendance (Present/Absent)
  const markStudentAttendance = async (regNo, newStatus) => {
    try {
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
  };

  return (
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
            </div>

            <h4>Members:</h4>
            <ul className="members-list">
              {team.members.map((m, idx) => (
                <li key={idx} className="member-item">
                  <div className="member-left">
                    <div className="avatar">{m.name.split(" ").map(n => n[0]).join("")}</div>
                    <div className="member-info">
                      <div className="name">{m.name} ({m.regNo})</div>
                      <div className="meta">{m.events.join(", ")}</div>
                    </div>
                  </div>

                  <div className="member-right">
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
                </li>
              ))}
            </ul>
          </div>
        ) : scannedId ? (
          <p>Loading team...</p>
        ) : null}

        {message && <p className="message">{message}</p>}

        <div className="controls">
          {scannedId && <button className="btn secondary" onClick={resetScanner}>Fetch Again</button>}
          <button className="btn secondary" onClick={() => window.location.reload()}>Scan new QR</button>
        </div>
      </div>
    </div>
  );
};

export default TeamScanner;
