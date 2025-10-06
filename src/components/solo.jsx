import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Solo = () => {
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

     
     
    </div>
  );
};

export default Solo;