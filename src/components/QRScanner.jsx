import React, { useState } from "react";
import { QrReader } from "@blackbox-vision/react-qr-reader";

const QRScanner = () => {
  const [scannedId, setScannedId] = useState("");
  const [participant, setParticipant] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setScannedId(data);
      fetchParticipant(data);
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  const fetchParticipant = async (uniqueId) => {
    try {
      const res = await fetch(`http://localhost:8001/participant/${uniqueId}`);
      const data = await res.json();
      setParticipant(data);
    } catch (err) {
      console.error("Error fetching participant:", err);
      setParticipant(null);
    }
  };

  return (
    <div>
      <h2>Scan QR Code</h2>
      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={(result, error) => {
          if (!!result) handleScan(result?.text);
          if (!!error) handleError(error);
        }}
        containerStyle={{ width: "300px" }}
      />

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
        </div>
      ) : scannedId ? (
        <p>No participant found for this ID</p>
      ) : null}
    </div>
  );
};

export default QRScanner;
