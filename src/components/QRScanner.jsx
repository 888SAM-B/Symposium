const QRScanner = () => {
  const [scannedId, setScannedId] = useState("");
  const [participant, setParticipant] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ new state
  const navigate = useNavigate();

  // Auth check
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
      setLoading(true); // start loader
      setMessage("");
      setParticipant(null); // reset previous
      const res = await fetch(`${import.meta.env.VITE_URL}/participant/${uniqueId}`);
      const data = await res.json();
      setParticipant(data || null);
      setLoading(false); // stop loader
    } catch (err) {
      console.error("Error fetching participant:", err);
      setParticipant(null);
      setLoading(false); // stop loader
    }
  };

  const markAttendance = async () => {
    if (!participant) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/participant/mark/${scannedId}`, {
        method: "PUT",
      });
      const result = await res.text();
      setMessage(result);
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
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scan QR Code</h2>
      {!scannedId && <div id="reader" style={{ width: "300px", margin: "auto" }}></div>}
      {scannedId && <p>Scanned ID: {scannedId}</p>}

      {loading && <p>Loading participant details...</p>} {/* ✅ loader */}

      {!loading && participant ? (
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
      ) : !loading && scannedId && !participant ? (
        <p>No record found for this ID</p> // ✅ updated message
      ) : null}

      {message && <p>{message}</p>}
      {scannedId && <button onClick={resetScanner}>Fetch Again</button>}
      <button onClick={() => window.location.reload()}>Scan new QR </button>
    </div>
  );
};
export default QRScanner;