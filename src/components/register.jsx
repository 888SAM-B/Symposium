import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [dis, setDis] = useState(false); // Used for disabling the button temporarily
  const [photoStatus,setPhotostatus]=useState(false)
  const [uploadedImage,setUploadedImage]=useState("")
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    setDis(true); // Disable button
    setLoading(true); // Show loader

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(uploadedImage.url)
    // Combine event and event2 into a single array
    const selectedEvents = [];
    if (data.event && data.event !== "") {
      selectedEvents.push(data.event);
    }
    if (data.event2 && data.event2 !== "") {
      selectedEvents.push(data.event2);
    }
    console.log(selectedEvents)
    if(selectedEvents.length==0){
      alert("Select atleat one event to continue...")
      setLoading(false)
      return
    }
    // Prepare data for the backend, matching the Student schema
    const payload = {
      imgUrl:uploadedImage.url,
      name: data.name,
      regNo: data.email, // Using email as regNo as per your schema context
      mobile: data.mobile,
      college: data.college, // Assuming you want to store college and department
      department: data.department,
      events: selectedEvents, // This will be an array of selected events
      transactionId: data.transactionId,
    };
    console.log(payload)

    fetch(`${import.meta.env.VITE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const text = await response.text();
        try {
          const result = JSON.parse(text);
          if (response.ok) { // Check if the response status is 2xx
            setResponseData(result);
            alert('Registration successful! Please save your VIBE Number and Unique ID.');
          } else {
            alert(`Registration failed: ${result.message || text}`);
            setResponseData(null);
          }
        } catch (e) {
          alert(`Registration failed: ${text}`); // If JSON parsing fails, show raw text
          setResponseData(null);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Network error or server unreachable.");
        setResponseData(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let timer;
    if (dis) {
      timer = setTimeout(() => {
        setDis(false);
      }, 3000); // 3 seconds
    }
    return () => clearTimeout(timer); // cleanup on unmount or if dis changes
  }, [dis]);

  return (
    <div className="register-container1 solo-container" id="register-container">
      <form onSubmit={handleSubmit} className="register-form solo" id="register-form">
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
        <div className="form-group" id="form-group-college">
          <label htmlFor="college" className="form-label">College:</label>
          <input type="text" name="college" id="college" className="form-input" required />
        </div>
        <div className="form-group" id="form-group-department">
          <label htmlFor="department" className="form-label">Department:</label>
          <input type="text" name="department" id="department" className="form-input" required />
        </div>
        <div className="form-group" id="form-group-event">
          <label htmlFor="event" className="form-label">Stage Event:</label>
          <select name="event" id="event" className="form-select"> {/* Not required as it's optional */}
            <option value="">Select Stage Event (Optional)</option>
            <option value="Paper Presentation">Paper Presentation</option>
            <option value="Data Vision">Data Vision</option>
            <option value="Quiz">Quiz</option>
          </select>
        </div>
        <div className="form-group" id="form-group-event2"> {/* Changed id to be unique */}
          <label htmlFor="event2" className="form-label">Off Stage Event:</label>
          <select name="event2" id="event2" className="form-select"> {/* Not required as it's optional */}
            <option value="">Select Off Stage Event (Optional)</option>
            <option value="Social Engineering App">Social Engineering App</option>
            <option value="Prompt Builder">Prompt Builder</option> {/* Corrected Event2 value */}
            <option value="API Fusion">API Fusion</option>
            <option value="Poster Presentation">Poster Presentation</option>
          </select>
        </div>
          <div className="payment">
            <h3 style={{ color: "#00f0ff", marginTop: "20px" }}>Payment Details</h3>
            <p>Registration Fee: ₹150 per member</p>
            <h3>Total Amount : {150}</h3>
            <p>Kindly make the payment to the following UPI ID:</p>
            <img  className="upi" src="/payment-scanner.png" alt="" />
            <p>UPI ID : professorhodcomputerscience@cnrb</p>
            <div className="file">
              <br />
              <p>Attach the Transaction Screenshot</p>
              <input
                type="file"
                className="select-event"
                accept="image/jpeg,image/jpg"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const maxSizeKB = 200;
                  if (file.size / 1024 > maxSizeKB) {
                    alert(`File size should not exceed ${maxSizeKB} KB`);
                    e.target.value = ""; // clear file input
                    return;
                  }

                  setLoading(true)
                  // Upload to Cloudinary
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("upload_preset", "payment-images");

                  try {
                    const res = await fetch(
                      "https://api.cloudinary.com/v1_1/defwsymvj/image/upload",
                      {
                        method: "POST",
                        body: formData,
                      }
                    );
                    const data = await res.json();

                    if (data.secure_url) {
                      // Save both url + public_id in state
                      setUploadedImage({
                        url: data.secure_url,
                        public_id: data.public_id,
                      });
                      setPhotostatus(true)
                      
                    } else {
                      alert("Upload failed!");
                    }
                  } catch (err) {
                    alert("Error uploading file!");
                  }
                  finally {
                    setLoading(false)
                  }
                }}
              />
              {loading && <p>Uploading... Please wait ⏳</p>}
                <div className="transaction-id">
                  <label htmlFor="transactionId" className="form-label">Transaction ID:</label>
                  <input type="text" name="transactionId" id="transactionId" placeholder="Transaction Id" />
                </div>
            </div>
          </div>
         { uploadedImage && <img src={uploadedImage.url} className="upi" style={{border:"1px solid",padding:"5px" }} alt="" />}

        <button type="submit" disabled={loading || dis || !photoStatus} className="register-btn" id="register-btn">
          {loading  ? "Uploading..." : "Register"}
        </button>
      </form>

      {/* Loader */}
      {loading && (
        <div className="loader" id="loader" style={{ marginTop: "20px", textAlign: "center" }}>
          <span>Loading...</span>
        </div>
      )}

      {/* Display Serial Number, Unique ID (studentNo), and QR Code */}
      {responseData && (
        <div className="registration-success" id="registration-success" style={{ marginTop: "20px" }}>
          <h3 className="success-title" id="success-title">Registration Successful!</h3>
          <p className="success-serial" id="success-serial">VIBE Number: {responseData.studentNo}</p>
          <p className="success-name" id="success-name">Name: {responseData.name}</p>
          <p className="success-events" id="success-events">Events: {responseData.events.join(', ')}</p>

          <QRCodeCanvas
            value={responseData.studentNo} // Use studentNo for QR
            size={128}
            bgColor="#ffffff"
            style={{ padding: "16px", background: "#fff" }}
            className="qr-code-canvas"
            id="qr-code-canvas"
          />
          <button
            className="register-btn"
            onClick={() => {
              const W = 800;
              const H = 1200;
              const topGap = 40;
              const qrCardSize = 420;
              const qrPaddingInside = 36;
              const qrCardX = (W - qrCardSize) / 2;
              const qrCardY = 380;

              const canvas = document.createElement("canvas");
              canvas.width = W;
              canvas.height = H;
              const ctx = canvas.getContext("2d");

              const g = ctx.createLinearGradient(0, 0, 0, H);
              g.addColorStop(0, "#4b0082");
              g.addColorStop(0.45, "#6a39c6");
              g.addColorStop(1, "#2bd1c9");
              ctx.fillStyle = g;
              ctx.fillRect(0, 0, W, H);

              ctx.textAlign = "center";
              ctx.shadowColor = "rgba(0,0,0,0.25)";
              ctx.shadowBlur = 8;
              ctx.fillStyle = "#c8ffd6";
              ctx.font = "bold 86px Arial";
              ctx.fillText("VIBE 2K25", W / 2, topGap + 90);

              ctx.fillStyle = "#ffffff";
              ctx.font = "600 56px Arial";
              ctx.fillText("PERIYAR UNIVERSITY", W / 2, topGap + 170);

              ctx.shadowBlur = 6;
              ctx.fillStyle = "#ffffff";
              ctx.font = "600 34px Arial";
              ctx.fillText("ID CARD", W / 2, topGap + 230);
              ctx.shadowBlur = 0;

              ctx.save();
              ctx.shadowColor = "rgba(0,0,0,0.35)";
              ctx.shadowBlur = 20;
              ctx.shadowOffsetY = 50;
              ctx.shadowOffsetX = -50;
              const r = 6;
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

              ctx.save();
              ctx.globalAlpha = 0.08;
              ctx.fillStyle = "#000000";
              ctx.fillRect(qrCardX + qrCardSize + 20, qrCardY + 50, 160, 80);
              ctx.restore();

              const cornerColor = "#bff7c7";
              const markLen = 70;
              const markW = 14;
              ctx.strokeStyle = cornerColor;
              ctx.lineWidth = markW;
              ctx.lineCap = "round";

              ctx.beginPath();
              ctx.moveTo(qrCardX + qrPaddingInside + markLen, qrCardY + qrPaddingInside);
              ctx.lineTo(qrCardX + qrPaddingInside, qrCardY + qrPaddingInside);
              ctx.lineTo(qrCardX + qrPaddingInside, qrCardY + qrPaddingInside + markLen);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(qrCardX + qrCardSize - qrPaddingInside - markLen, qrCardY + qrPaddingInside);
              ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrPaddingInside);
              ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrPaddingInside + markLen);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(qrCardX + qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside - markLen);
              ctx.lineTo(qrCardX + qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside);
              ctx.lineTo(qrCardX + qrPaddingInside + markLen, qrCardY + qrCardSize - qrPaddingInside);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside - markLen);
              ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside);
              ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside - markLen, qrCardY + qrCardSize - qrPaddingInside);
              ctx.stroke();

              const qrCanvas = document.querySelector("canvas.qr-code-canvas"); // Select specifically by class
              if (qrCanvas) {
                const innerSize = qrCardSize - qrPaddingInside * 2;
                const innerX = qrCardX + qrPaddingInside;
                const innerY = qrCardY + qrPaddingInside;
                try {
                  ctx.drawImage(qrCanvas, innerX, innerY, innerSize, innerSize);
                } catch (e) {
                  ctx.fillStyle = "#f3f3f3";
                  ctx.fillRect(innerX, innerY, innerSize, innerSize);
                  ctx.fillStyle = "#444";
                  ctx.font = "22px Arial";
                  ctx.textAlign = "center";
                  ctx.fillText("QR CODE", innerX + innerSize / 2, innerY + innerSize / 2 + 8);
                }
              }

              const bottomStartY = qrCardY + qrCardSize + 90;
              ctx.textAlign = "center";
              ctx.fillStyle = "#ffffff";
              ctx.font = "700 34px Arial";
              ctx.shadowColor = "rgba(0,0,0,0.35)";
              ctx.shadowBlur = 8;
              ctx.fillText((responseData && responseData.name) ? responseData.name.toUpperCase() : "NAME", W / 2, bottomStartY);
              ctx.fillText((responseData && responseData.studentNo) ? String(responseData.studentNo).toUpperCase() : "VIBE NUMBER", W / 2, bottomStartY + 54);
              ctx.fillText((responseData && responseData.events) ? responseData.events.join(', ').toUpperCase() : "EVENTS", W / 2, bottomStartY + 108);
              ctx.shadowBlur = 0;

              ctx.fillStyle = "rgba(255,255,255,0.12)";
              ctx.font = "14px Arial";
              ctx.fillText("Powered by Periyar University - Event Registration", W / 2, H - 24);

              const url = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = url;
              link.download = `VIBE_ID_${(responseData && responseData.studentNo) || Date.now()}.png`;
              link.click();
            }}
            style={{ marginTop: "10px" }}
          >
            Download ID Card
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;