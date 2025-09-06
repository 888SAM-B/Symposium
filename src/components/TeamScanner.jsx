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

  // ✅ Fetch team details by uniqueId
  const fetchTeamDetails = async (uniqueId) => {
    try {
      setMessage("");
      const res = await fetch(`${import.meta.env.VITE_URL}/team-scanner/${uniqueId}`);
      if (!res.ok) {
        throw new Error("Team not found");
      }
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

      // Update local state (reflect in UI immediately)
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
          <p><b>College:</b> {team.collegeName}</p>
          <p><b>Department:</b> {team.dept}</p>

          <h4>Members:</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {team.members.map((m, idx) => (
              <li key={idx} style={{ margin: "10px 0", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                <b>{m.name}</b> ({m.regNo}) - {m.events.join(", ")}
                <br />
                Status:{" "}
                {m.status === "Present" ? (
                  <span style={{ color: "green" }}>✅ Present</span>
                ) : (
                  <span style={{ color: "red" }}>❌ Absent</span>
                )}
                <br />
                {m.status === "Present" ? (
                  <button onClick={() => markStudentAttendance(m.regNo, "Absent")}>
                    Mark Absent
                  </button>
                ) : (
                  <button onClick={() => markStudentAttendance(m.regNo, "Present")}>
                    Mark Present
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : scannedId ? (
        <p>Loading team...</p>
      ) : null}

      {message && <p><b>{message}</b></p>}

      {scannedId && <button onClick={resetScanner}>Fetch Again</button>}
      <button onClick={() => window.location.reload()}>Scan new QR</button>
    </div>
  );
};

export default TeamScanner;
