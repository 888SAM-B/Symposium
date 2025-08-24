import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = () => {
  const [scannedId, setScannedId] = useState("");
  const [participant, setParticipant] = useState(null);
  const [message, setMessage] = useState("");

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
          console.warn("QR error:", errorMessage);
        }
      )
      .catch((err) => console.error("Unable to start scanner:", err));

    return () => {
      qrCodeScanner.stop().catch((err) => console.error("Stop failed:", err));
    };
  }, []);

  const fetchParticipant = async (uniqueId) => {
    try {
      setMessage("");
      const res = await fetch(`https://symposium-52l2.onrender.com/participant/${uniqueId}`);
      const data = await res.json();
      setParticipant(data);
    } catch (err) {
      console.error("Error fetching participant:", err);
      setParticipant(null);
    }
  };
  const markAttendance = async () => {
    try {
      if (!participant) return;
      const res = await fetch(`https://symposium-52l2.onrender.com/participant/mark/${scannedId}`, {
        method: "PUT",
      });
      const result = await res.text();
      setMessage(result);
      // Update local state
      setParticipant({ ...participant, attendance: true });
    } catch (err) {
      console.error("Error marking attendance:", err);
      setMessage("Failed to mark attendance");
    }
  };
  const resetScanner = () => {
    setScannedId("");
    setParticipant(null);
    setMessage("");
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scan QR Code</h2>
      {!scannedId && <div id="reader" style={{ width: "300px", margin: "auto" }}></div>}
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
            <button onClick={markAttendance}>Mark as Present</button>
          )}
        </div>
      ) : scannedId ? (
        <p>No participant found for this ID</p>
      ) : null}
      {message && <p>{message}</p>}
      {scannedId && <button onClick={resetScanner}>Scan Again</button>}
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );
};

export default QRScanner;
