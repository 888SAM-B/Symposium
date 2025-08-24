import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";


const Register = () => {
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Form data:", data);

    fetch("https://symposium-52l2.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const text = await response.text();
        try {
          const result = JSON.parse(text);
          console.log("Success:", result);
          setResponseData(result); // save serialNumber & uniqueId
        } catch (e) {
          console.log("Server response:", text);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Student Registration for Symposium</h2>
        <div>
          <label>
            Name:
            <input type="text" name="name" required />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <label>
            Mobile Number:
            <input type="tel" name="mobile" required />
          </label>
        </div>
        <div>
          <label>
            Graduation Level:
            <select name="level" required>
              <option value="">Select Level</option>
              <option value="1">Under Graduate</option>
              <option value="2">Post Graduate</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            College:
            <input type="text" name="college" required />
          </label>
        </div>
        <div>
          <label>
            Year of Study:
            <select name="year" required>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Department:
            <input type="text" name="department" required />
          </label>
        </div>
        <div>
          <label>
            Event Name:
            <select name="event" required>
              <option value="">Select Event</option>
              <option value="Event1">Event 1</option>
              <option value="Event2">Event 2</option>
              <option value="Event3">Event 3</option>
              <option value="Event4">Event 4</option>
              <option value="Event5">Event 5</option>
            </select>
          </label>
        </div>
        <button type="submit">Register</button>
      </form>

      {/* Display Serial Number, Unique ID, and QR Code */}
      {responseData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Registration Successful!</h3>
          <p>Serial Number: {responseData.serialNumber}</p>
          <p>Unique ID: {responseData.uniqueId}</p>
          <QRCodeCanvas value={responseData.uniqueId} size={128} />

        </div>
      )}
    </div>
  );
};

export default Register;
