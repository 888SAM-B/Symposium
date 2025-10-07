import React, { useState } from "react";
import "./reg.css";
import { QRCodeCanvas } from "qrcode.react";

const RegisterSymposium = () => {
  const [step, setStep] = useState(1);
  const [college, setCollege] = useState("");
  const [memberCount, setMemberCount] = useState();
  const [members, setMembers] = useState([
    { name: "", regNo: "", mobile: "" },
  ]);
  const [collegeName, setCollegeName] = useState("");
  const [dept, setDept] = useState("");
  const [close, setClose] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [photostatus, setPhotostatus] = useState(false)
  const [events, setEvents] = useState({
    "Paper Presentation": [],
    "Poster Presentation": [],
    "Data Vision": [],
    "Quiz": [],
    "Prompt Builder": [],
    "Social Engineering App": [],
    "API Fusion": [],

  });
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [registeredTeamData, setRegisteredTeamData] = useState(null);

  // New states for categorized selected events
  const [selectedMorningEvents, setSelectedMorningEvents] = useState([]);
  const [selectedAfternoonEvents, setSelectedAfternoonEvents] = useState([]);

  // New states for categorized event selection dropdowns
  const [eventToAddMorning, setEventToAddMorning] = useState("");
  const [eventToAddAfternoon, setEventToAddAfternoon] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const morningEvents = ["Paper Presentation", "Data Vision", "Quiz"];
  const afternoonEvents = ["Prompt Builder", "Social Engineering App", "API Fusion", "Poster Presentation"];
  // Note: allEventNames is not strictly needed for rendering but useful for initial setup/filtering
 const [transactionId,setTransactionId]=useState("") 
  const handleMemberInput = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);

    // 🔑 If already in step 3, clear only participants inside events
    if (step > 2) {
      const clearedEvents = {};
      Object.keys(events).forEach((ev) => {
        clearedEvents[ev] = []; // box visible, but empty list
      });
      setEvents(clearedEvents);

      setSelectedMorningEvents([]);
      setSelectedAfternoonEvents([]);
    }
  };
  const isSubmitDisabled =
    selectedMorningEvents.length === 0 &&
    selectedAfternoonEvents.length === 0 &&
    Object.values(events).every((list) => list.length === 0);

  const hasDuplicateRegNo = () => {
    const regNos = members.map((m) => m.regNo.trim());
    return new Set(regNos).size !== regNos.length;
  };

  const handleSubmit = async () => {
    console.log(uploadedImage)
   

    // Ensure all members are assigned to at least one event if any events are selected
    if (selectedMorningEvents.length > 0 || selectedAfternoonEvents.length > 0) {
      const allAssigned = members.every((member) =>
        Object.values(events).some((ev) =>
          ev.includes(`${member.name} (${member.regNo})`)
        )
      );

      if (!allAssigned) {
        alert("Every student must be assigned to at least one event!");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/team-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: college,
          event: events,
          members,
          collegeName,
          dept,
          imgUrl:uploadedImage.url,
          transactionId:transactionId
        }),
      });

      const result = await res.json();
      if (res.ok) {
        console.log("Response:", result);
        setRegisteredTeamData({
          teamId: result.team.teamNo,
          teamUid: result.team.uniqueId,
          teamName: college,
          collegeName: collegeName,
          dept: dept,
          members: members,
          events: events,
        });
        setShowSuccessPopup(true);
      } else if (res.status === 400) {
        alert(result.error || "Duplicate E-mails numbers found!");
      } else {
        alert(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const verifyTeamName = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college }),
      });
      const data = await response.json();
      if (data.exists) {
        alert("Team name already exists!");
      } else {
        setStep(2);
      }
    } catch (error) {
      console.error("Error checking team name:", error);
      alert("Error checking team name. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const closePopupAndReset = () => {
    setShowSuccessPopup(false);
    setRegisteredTeamData(null);
    setStep(1);
    setCollege("");
    setMemberCount(0);
    setMembers([]);
    setCollegeName("");
    setDept("");
    setEvents({
      "Paper Presentation": [], "Data Vision": [], "Quiz": [],
      "Prompt Builder": [], "Social Engineering App": [], "Poster Presentation": [], "API Fusion": [],
    });
    setSelectedMorningEvents([]);
    setSelectedAfternoonEvents([]);
    setEventToAddMorning("");
    setEventToAddAfternoon("");
  };

  // Function to add an event to the selectedMorningEvents list
  const handleAddMorningEvent = () => {
    if (eventToAddMorning && !selectedMorningEvents.includes(eventToAddMorning)) {
      setSelectedMorningEvents([...selectedMorningEvents, eventToAddMorning]);
      setEventToAddMorning(""); // Clear selection
    }
  };

  // Function to add an event to the selectedAfternoonEvents list
  const handleAddAfternoonEvent = () => {
    if (eventToAddAfternoon && !selectedAfternoonEvents.includes(eventToAddAfternoon)) {
      setSelectedAfternoonEvents([...selectedAfternoonEvents, eventToAddAfternoon]);
      setEventToAddAfternoon(""); // Clear selection
    }
  };

  // Function to remove an event from either morning or afternoon selectedEvents list
  const handleRemoveEvent = (eventName, isMorning) => {
    if (isMorning) {
      const newSelectedEvents = selectedMorningEvents.filter((e) => e !== eventName);
      setSelectedMorningEvents(newSelectedEvents);
    } else {
      const newSelectedEvents = selectedAfternoonEvents.filter((e) => e !== eventName);
      setSelectedAfternoonEvents(newSelectedEvents);
    }

    // Also clear participants for the removed event
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[eventName] = [];
      return updatedEvents;
    });
  };

  const getAvailableMembers = (eventName, currentSlotMember = null) => {
    const isMorningEvent = morningEvents.includes(eventName);
    const sessionEvents = isMorningEvent ? morningEvents : afternoonEvents;
    const currentSelectedSessionEvents = isMorningEvent ? selectedMorningEvents : selectedAfternoonEvents;


    const chosenMembersInSession = new Set();
    sessionEvents.forEach((ev) => {
      // Only consider events that are actually selected for display in the current session
      if (currentSelectedSessionEvents.includes(ev)) {
        events[ev].forEach((m) => {
          // Exclude the member currently being edited in the same slot
          if (m && m !== currentSlotMember) {
            chosenMembersInSession.add(m);
          }
        });
      }
    });

    return members.filter(
      (m) => !chosenMembersInSession.has(`${m.name} (${m.regNo})`)
    );
  };

  // Common function to handle event participant changes
  const handleEventParticipantChange = (eventName, slot, newMemberValue) => {
    const newEvents = { ...events };
    const isMorningEvent = morningEvents.includes(eventName);
    const sessionEvents = isMorningEvent ? morningEvents : afternoonEvents;

    // Get the previously selected member for this slot, if any
    const prevMember = newEvents[eventName] ? newEvents[eventName][slot] : null;

    // If a member was previously selected for this slot, remove them from all events in the same session
    if (prevMember) {
      sessionEvents.forEach(ev => {
        if (newEvents[ev]) {
          newEvents[ev] = newEvents[ev].filter(p => p !== prevMember);
        }
      });
    }

    // Now, assign the new member if one is selected
    if (newMemberValue) {
      // Remove the new member from any other events in the same session, if they were previously there
      sessionEvents.forEach(ev => {
        if (newEvents[ev] && newEvents[ev].includes(newMemberValue)) {
          newEvents[ev] = newEvents[ev].filter(p => p !== newMemberValue);
        }
      });

      // Update the current event's slot
      if (!newEvents[eventName]) {
        newEvents[eventName] = [];
      }
      const updatedParticipants = [...newEvents[eventName]];
      updatedParticipants[slot] = newMemberValue;
      newEvents[eventName] = updatedParticipants;
    } else {
      // If the new value is empty, clear the slot
      if (newEvents[eventName]) {
        const updatedParticipants = [...newEvents[eventName]];
        updatedParticipants[slot] = "";
        newEvents[eventName] = updatedParticipants;
      }
    }

    // Filter out any empty strings from the event's participant list
    Object.keys(newEvents).forEach(key => {
      if (newEvents[key]) {
        newEvents[key] = newEvents[key].filter(Boolean);
      }
    });

    setEvents(newEvents);
  };


  return (
    <div className="register-container1">
      <h1>VIBE Registration</h1>

      {/* Step 1 */}
      {step >= 1 && (
        <div className="step-1">
          <h2>Step 1: Team Details</h2>
          <input
            type="text"
            placeholder="Team Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter College Name"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Department"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          />
          <input
            type="number"
            placeholder="Number of Members"
            value={memberCount}
            min={1}
            onChange={(e) => {
              const count = parseInt(e.target.value) || 0;
              setMemberCount(count);
              setMembers(
                Array.from({ length: count }, () => ({ name: "", regNo: "" }))
              );
            }}
          />
          <br />
          {step === 1 && (
            <button
              className="next"
              onClick={verifyTeamName}
              disabled={!college || !collegeName || !dept || !memberCount}
            >
              Next
            </button>
          )}
        </div>
      )}

      {/* Step 2 */}
      {step >= 2 && (
        <div className="step-2">
          <h2>Step 2: Member Details</h2>
          {members.map((m, idx) => (
            <div key={idx} className="member-input">
              <input
                type="text"
                placeholder="Member Name"
                value={m.name}
                onChange={(e) => handleMemberInput(idx, "name", e.target.value)}
              />
              <input
                type="email"
                placeholder="Mail ID"
                value={m.regNo}
                onChange={(e) => {
                  handleMemberInput(idx, "regNo", e.target.value)

                }
                }
              />
              <input
                type="tel"
                placeholder="Whatsapp Number"
                value={m.mobile}
                onChange={(e) =>
                  handleMemberInput(idx, "mobile", e.target.value)
                }
              />
            </div>
          ))}

          {step === 2 && (
            <div>

              <button
                onClick={async () => {
                  setLoading(true)
                  const regNos = members.map((m) => m.regNo.trim());
                  const uniqueRegNos = new Set(regNos);
                  

                  try {
                    const response = await fetch(
                      `${import.meta.env.VITE_URL}/api/check-regnos`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ regNos }),
                      }
                    );

                    const data = await response.json();

                    

                    setStep(3);
                  } catch (error) {
                    console.error("Error checking regNos:", error);
                    alert(
                      "Something went wrong while checking E-mails numbers!"
                    );
                  }
                  finally {
                    setLoading(false)
                  }
                }}
                disabled={members.some((m) => !m.name || !m.regNo || !m.mobile) || loading}
              >
                Next
              </button>
              <button onClick={() => setStep(1)} className="back" disabled={loading}>
                Back
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step >= 3 && (
        <div className="step-3">
          <h2>Step 3: Event Selection</h2>

          {/* Morning Events Section */}
          <h3 style={{ color: "#00f0ff", marginTop: "20px" }}>Stage Events</h3>


          <div className="event-list">
            {selectedMorningEvents.sort((a, b) => morningEvents.indexOf(a) - morningEvents.indexOf(b)).map((eventName) => (
              <div key={eventName} className="event-box">
                <h4 className="evt-box-header">
                  {eventName}
                  <p
                    className="remove-event-button"
                    onClick={() => handleRemoveEvent(eventName, true)} // Pass true for morning event
                  >
                    X
                  </p>
                </h4>
                <div className="participants">
                  {[0, 1].map((slot) => (
                    <select
                      className="pl"
                      key={slot}
                      value={events[eventName][slot] || ""}
                      onChange={(e) =>
                        handleEventParticipantChange(
                          eventName,
                          slot,
                          e.target.value
                        )
                      }
                    >
                      <option value=""  >Select  Member</option>
                      {getAvailableMembers(eventName, events[eventName][slot]).map(
                        (m, idx) => (
                          <option key={idx} value={`${m.name} (${m.regNo})`}>
                            {m.name} ({m.regNo})
                          </option>
                        )
                      )}
                    </select>
                  ))}
                </div>
                <p>
                  Participants: {events[eventName].join(", ") || "None"}
                </p>
              </div>
            ))}
          </div>

          <div className="add-event-section">
            {!showDropdown1 ? (
              <button onClick={() => setShowDropdown1(true)}>Add Event</button>
            ) : (
              <>
                <select
                  className="select-event"
                  value={eventToAddMorning}
                  onChange={(e) => setEventToAddMorning(e.target.value)}
                >
                  <option value="">Select Event</option>
                  {morningEvents
                    .filter((eventName) => !selectedMorningEvents.includes(eventName))
                    .map((eventName) => (
                      <option key={eventName} value={eventName}>
                        {eventName}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    handleAddMorningEvent();
                    setShowDropdown1(false); // after confirm, go back to Add Event button
                  }}
                  disabled={!eventToAddMorning}
                >
                  Confirm
                </button>
              </>
            )}
          </div>


          {/* Afternoon Events Section */}
          <h3 style={{ color: "#00f0ff", marginTop: "20px" }}>Off Stage Events</h3>


          <div className="event-list">
  {selectedAfternoonEvents
    .sort((a, b) => afternoonEvents.indexOf(a) - afternoonEvents.indexOf(b))
    .map((eventName) => (
      <div key={eventName} className="event-box">
        <h4 className="evt-box-header">
          {eventName}
          <p
            className="remove-event-button"
            onClick={() => handleRemoveEvent(eventName, false)} // Pass false for afternoon event
          >
            X
          </p>
        </h4>

        <div className="participants">
          {(
             eventName === "Prompt Builder"
              ? [0] // only one slot
              : [0, 1] // default two slots
          ).map((slot) => (
            <select
              key={slot}
              className="pl"
              value={events[eventName][slot] || ""}
              onChange={(e) =>
                handleEventParticipantChange(eventName, slot, e.target.value)
              }
            >
              <option value="">Select Member</option>
              {getAvailableMembers(eventName, events[eventName][slot]).map(
                (m, idx) => (
                  <option key={idx} value={`${m.name} (${m.regNo})`}>
                    {m.name} ({m.regNo})
                  </option>
                )
              )}
            </select>
          ))}
        </div>

        <p>Participants: {events[eventName].join(", ") || "None"}</p>
      </div>
    ))}
</div>


          <div className="add-event-section">
            {!showDropdown ? (
              <button onClick={() => setShowDropdown(true)}>Add Event</button>
            ) : (
              <>
                <select
                  className="select-event"
                  value={eventToAddAfternoon}
                  onChange={(e) => setEventToAddAfternoon(e.target.value)}
                >
                  <option value="">Select Event</option>
                  {afternoonEvents
                    .filter((eventName) => !selectedAfternoonEvents.includes(eventName))
                    .map((eventName) => (
                      <option key={eventName} value={eventName}>
                        {eventName}
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    handleAddAfternoonEvent();
                    setShowDropdown(false); // after confirm, go back to Add Event button
                  }}
                  disabled={!eventToAddAfternoon}
                >
                  Confirm
                </button>
              </>
            )}
          </div>

          <br /><br />
          <hr />
          <br /><br />

          <div className="payment">
            <h3 style={{ color: "#00f0ff", marginTop: "20px" }}>Payment Details</h3>
            <p>Registration Fee: ₹150 per member</p>
            <h3>Total Amount : {150 * memberCount}</h3>
            <p>Kindly make the payment to the following UPI ID:</p>
            <img  className="upi" src="/payment-scanner.png" alt="" />
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
              <div className="transaction-id">
                  <label htmlFor="transactionId" className="form-label">Transaction ID:</label>
                  <input type="text" name="transactionId" id="transactionId" placeholder="Transaction Id" onChange={(e) => setTransactionId(e.target.value)} />
                </div>
              {loading && <p>Uploading... Please wait ⏳</p>}

                <p>Uploaded Image:</p>
                
                
            </div>
            {uploadedImage && <img src={uploadedImage && uploadedImage.url} className="upi" style={{border:"1px solid",padding:"5px" }} alt="" />}

          </div>

          {/* Navigation buttons */}
          <div>

            <button onClick={handleSubmit} disabled={isSubmitDisabled || loading || !photostatus}>
              {loading ? "Uploading..." : "Submit"}
            </button>
            <button onClick={() => setStep(2)} disabled={loading}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && registeredTeamData && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Registration Successful!</h2>
            <p>
              Your Team ID: <strong>{registeredTeamData.teamId}</strong>
            </p>
            <h3>Team Details:</h3>
            <p>
              <strong>Team Name:</strong> {registeredTeamData.teamName}
            </p>
            <p>
              <strong>College Name:</strong> {registeredTeamData.collegeName}
            </p>
            <p>
              <strong>Department:</strong> {registeredTeamData.dept}
            </p>
            <h4>Members:</h4>
            <ul>
              {registeredTeamData.members.map((member, index) => (
                <li key={index}>
                  {member.name} ({member.regNo})
                </li>
              ))}
            </ul>
            <h4>Registered Events:</h4>
            <ul>
              {Object.entries(registeredTeamData.events).map(
                ([eventName, participants]) =>
                  participants.length > 0 && (
                    <li key={eventName}>
                      <strong>{eventName}:</strong> {participants.join(", ")}
                    </li>
                  )
              )}
            </ul>

            <div className="qr-code-container">
              <h3>Scan for Team ID:</h3>
              <div style={{ padding: "16px", background: "white", display: "inline-block", borderRadius: "8px" }}>
                <QRCodeCanvas value={registeredTeamData.teamUid} size={128} level="H" />
              </div>

            </div>



            <button

              onClick={() => {
                // Poster size (you can scale this up/down)
                const W = 800;
                const H = 1200;

                // Layout metrics
                const topGap = 40;
                const qrCardSize = 420;
                const qrPaddingInside = 36; // padding inside the white QR card for the qrCanvas
                const qrCardX = (W - qrCardSize) / 2;
                const qrCardY = 380;

                // Create canvas
                const canvas = document.createElement("canvas");
                canvas.width = W;
                canvas.height = H;
                const ctx = canvas.getContext("2d");

                // --- Background gradient (purple -> teal) ---
                const g = ctx.createLinearGradient(0, 0, 0, H);
                g.addColorStop(0, "#4b0082"); // deep purple
                g.addColorStop(0.45, "#6a39c6");
                g.addColorStop(1, "#2bd1c9"); // teal-ish
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);

                // --- Big top text: PERIYAR / UNIVERSITY ---
                ctx.textAlign = "center";
                ctx.shadowColor = "rgba(0,0,0,0.25)";
                ctx.shadowBlur = 8;
                ctx.fillStyle = "#c8ffd6"; // mint green for PERIYAR
                ctx.font = "bold 86px Arial";
                ctx.fillText("VIBE 2K25", W / 2, topGap + 90);

                ctx.fillStyle = "#ffffff"; // white for UNIVERSITY
                ctx.font = "600 56px Arial";
                ctx.fillText("PERIYAR UNIVERSITY", W / 2, topGap + 170);

                // --- Registration Successful (subheading) ---
                ctx.shadowBlur = 6;
                ctx.fillStyle = "#ffffff";
                ctx.font = "600 34px Arial";
                ctx.fillText("ID CARD", W / 2, topGap + 230);
                ctx.shadowBlur = 0; // reset

                // --- QR Card with shadow (white rectangle with subtle drop shadow) ---
                ctx.save();
                ctx.shadowColor = "rgba(0,0,0,0.35)";
                ctx.shadowBlur = 20;
                ctx.shadowOffsetY = 50;
                ctx.shadowOffsetX = -50;
                // Draw white rounded rectangle (manual rounded rect)
                const r = 6; // corner radius
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

                // --- Optional angled soft shadow on right (like the example) ---
                // a subtle long shadow block to the right-bottom
                ctx.save();
                ctx.globalAlpha = 0.08;
                ctx.fillStyle = "#000000";
                ctx.fillRect(qrCardX + qrCardSize + 20, qrCardY + 50, 160, 80);
                ctx.restore();

                // --- Draw green corner markers inside the QR card (like the poster) ---
                const cornerColor = "#bff7c7";
                const markLen = 70;
                const markW = 14;
                ctx.strokeStyle = cornerColor;
                ctx.lineWidth = markW;
                ctx.lineCap = "round";

                // Top-left
                ctx.beginPath();
                ctx.moveTo(qrCardX + qrPaddingInside + markLen, qrCardY + qrPaddingInside);
                ctx.lineTo(qrCardX + qrPaddingInside, qrCardY + qrPaddingInside);
                ctx.lineTo(qrCardX + qrPaddingInside, qrCardY + qrPaddingInside + markLen);
                ctx.stroke();

                // Top-right
                ctx.beginPath();
                ctx.moveTo(qrCardX + qrCardSize - qrPaddingInside - markLen, qrCardY + qrPaddingInside);
                ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrPaddingInside);
                ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrPaddingInside + markLen);
                ctx.stroke();

                // Bottom-left
                ctx.beginPath();
                ctx.moveTo(qrCardX + qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside - markLen);
                ctx.lineTo(qrCardX + qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside);
                ctx.lineTo(qrCardX + qrPaddingInside + markLen, qrCardY + qrCardSize - qrPaddingInside);
                ctx.stroke();

                // Bottom-right
                ctx.beginPath();
                ctx.moveTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside - markLen);
                ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside, qrCardY + qrCardSize - qrPaddingInside);
                ctx.lineTo(qrCardX + qrCardSize - qrPaddingInside - markLen, qrCardY + qrCardSize - qrPaddingInside);
                ctx.stroke();

                // --- Draw the actual QR (from existing canvas on page) ---
                const qrCanvas = document.querySelector("canvas"); // assumes the QR canvas exists on page
                if (qrCanvas) {
                  // Compute area inside the white card for the QR (centered)
                  const innerSize = qrCardSize - qrPaddingInside * 2;
                  const innerX = qrCardX + qrPaddingInside;
                  const innerY = qrCardY + qrPaddingInside;
                  try {
                    ctx.drawImage(qrCanvas, innerX, innerY, innerSize, innerSize);
                  } catch (e) {
                    // fallback: draw text placeholder if QR not available
                    ctx.fillStyle = "#f3f3f3";
                    ctx.fillRect(innerX, innerY, innerSize, innerSize);
                    ctx.fillStyle = "#444";
                    ctx.font = "22px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("QR CODE", innerX + innerSize / 2, innerY + innerSize / 2 + 8);
                  }
                }

                // --- Bottom details (NAME, SERIAL NUMBER, EVENT) ---
                const bottomStartY = qrCardY + qrCardSize + 90;
                ctx.textAlign = "center";
                ctx.fillStyle = "#ffffff";
                ctx.font = "700 34px Arial";
                // slight shadow for emboss effect
                ctx.shadowColor = "rgba(0,0,0,0.35)";
                ctx.shadowBlur = 8;
                if (registeredTeamData.teamName) {
                  ctx.fillText((registeredTeamData.teamName || "NAME").toUpperCase(), W / 2, bottomStartY);
                } else {
                  ctx.fillText("NAME", W / 2, bottomStartY);
                }
                if (registeredTeamData.teamId) {
                  ctx.fillText((registeredTeamData.teamId || "NAME").toUpperCase(), W / 2, bottomStartY + 50);
                } else {
                  ctx.fillText("NAME", W / 2, bottomStartY + 50);
                }



                // --- Small footer / stamp (optional) ---
                ctx.fillStyle = "rgba(255,255,255,0.12)";
                ctx.font = "14px Arial";
                ctx.fillText("Powered by Periyar University - Event Registration", W / 2, H - 24);

                // --- Download image ---
                const url = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = url;
                link.download = `qr_${Date.now()}.png`;
                link.click();
                setClose(true)
              }}
              style={{ marginTop: "10px" }}
            >
              Download QR Code
            </button>
            <button onClick={closePopupAndReset} disabled={!close} >Close & Register New Team</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterSymposium;