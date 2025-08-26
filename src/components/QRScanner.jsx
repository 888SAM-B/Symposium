import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const QRScanner = () => {
  const [scannedId, setScannedId] = useState("");
  const [participant, setParticipant] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode("reader");

    qrCodeScanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setScannedId(decodedText);
          fetchParticipant(decodedText);
        },
        (errorMessage) => {
          setError("QR scanning error: " + errorMessage);
          console.warn("QR error:", errorMessage);
        }
      )
      .catch((err) => {
        setError("Unable to start scanner: " + err);
        console.error("Unable to start scanner:", err);
      });

    return () => {
      qrCodeScanner.stop().catch((err) => console.error("Stop failed:", err));
    };
  }, []);

  const fetchParticipant = async (uniqueId) => {
    setLoading(true);
    setError("");
    try {
      setMessage("");
      const res = await fetch(`${import.meta.env.VITE_URL}/participant/${uniqueId}`);
      if (!res.ok) {
        throw new Error("Participant not found");
      }
      const data = await res.json();
      setParticipant(data);
    } catch (err) {
      setParticipant(null);
      setError("Error fetching participant: " + err.message);
      setMessage("No participant found for this ID");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      if (!participant) return;
      const res = await fetch(`${import.meta.env.VITE_URL}/participant/mark/${scannedId}`, {
        method: "PUT",
      });
      if (!res.ok) {
        throw new Error("Failed to mark attendance");
      }
      const result = await res.text();
      setMessage(result);
      setParticipant({ ...participant, attendance: true });
      alert("Attendance marked successfully!");
    } catch (err) {
      setMessage("Failed to mark attendance");
      setError("Error marking attendance: " + err.message);
      alert("Error marking attendance!");
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedId("");
    setParticipant(null);
    setMessage("");
    setError("");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scan QR Code</h2>
      {loading && <div style={{ color: "blue" }}>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!scannedId && !loading && <div id="reader" style={{ width: "300px", margin: "auto" }}></div>}
      {scannedId && <p>Scanned ID: {scannedId}</p>}
      {participant ? (
        <div>
          <h3>Participant Details:</h3>
          <p>Serial Number: {participant.serialNumber}</p>
          <p>Name: {participant.name}</p>
          <p>Email: {participant.email}</p>
          <p>Mobile: {participant.mobile}</p>
          <p>College: {participant.college}</p>
          <p>Year: {participant.year}</p>
          <p>Department: {participant.department}</p>
          <p>Event: {participant.event}</p>
          {participant.attendance ? (
            <p style={{ color: "green" }}>Already marked present</p>
          ) : (
            <button onClick={markAttendance} disabled={loading}>Mark as Present</button>
          )}
        </div>
      ) : scannedId && !loading ? (
        <p>No participant found for this ID</p>
      ) : null}
      {message && <p>{message}</p>}
      {scannedId && <button onClick={resetScanner} disabled={loading}>Fetch Again</button>}
      <button onClick={() => window.location.reload()} disabled={loading}>Scan new QR </button>
    </div>
  );
};

export default QRScanner;
