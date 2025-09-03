import React, { useState } from "react";
import "./reg.css";
// import QRCode from "qrcode.react"; // Import QRCode component
import { QRCodeCanvas } from "qrcode.react";

const RegisterSymposium = () => {
  const [step, setStep] = useState(1);
  const [college, setCollege] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [collegeName, setCollegeName] = useState("");
  const [dept, setDept] = useState("");
  const [events, setEvents] = useState({
    "Event 1": [],
    "Event 2": [],
    "Event 3": [],
    "Event 4": [],
    "Event 5": [],
    "Event 6": [],
    "Event 7": [],
    "Event 8": [],
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state for popup visibility
  const [registeredTeamData, setRegisteredTeamData] = useState(null); // New state for popup data

  const morningEvents = ["Event 1", "Event 2", "Event 3", "Event 4"];
  const afternoonEvents = ["Event 5", "Event 6", "Event 7", "Event 8"];

  const handleMemberInput = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const hasDuplicateRegNo = () => {
    const regNos = members.map((m) => m.regNo.trim());
    return new Set(regNos).size !== regNos.length;
  };

  const handleSubmit = async () => {
    if (hasDuplicateRegNo()) {
      alert("Duplicate registration numbers are not allowed!");
      return;
    }

    // Ensure all members are assigned to at least one event
    const allAssigned = members.every((member) =>
      Object.values(events).some((ev) =>
        ev.includes(`${member.name} (${member.regNo})`)
      )
    );

    if (!allAssigned) {
      alert("Every student must be assigned to at least one event!");
      return;
    }

    setLoading(true); // Start loading
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
        }),
      });

      const result = await res.json();
      if (res.ok) {
        // alert("Team Registered Successfully!"); // We will use the popup instead of alert
        console.log("Response:", result);

        // Assuming your backend returns teamId and other relevant data upon successful registration
        setRegisteredTeamData({
          teamId: result.teamId, // Make sure your backend sends this
          teamName: college,
          collegeName: collegeName,
          dept: dept,
          members: members,
          events: events,
          // Add any other data you want to display
        });
        setShowSuccessPopup(true); // Show the popup
      } else if (res.status === 400) {
        alert(result.error || "Duplicate registration numbers found!");
      } else {
        alert(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Server error, please try again later.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  const verifyTeamName = () => {
    fetch(`${import.meta.env.VITE_URL}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ college }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.exists) {
          alert("Team name already exists!");
        } else {
          setStep(2);
        }
      })
      .catch((error) => {
        console.error("Error checking team name:", error);
      });
  };

  // Function to close the popup and reset the form
  const closePopupAndReset = () => {
    setShowSuccessPopup(false);
    setRegisteredTeamData(null);
    // Reset form fields
    setStep(1);
    setCollege("");
    setMemberCount(0);
    setMembers([]);
    setCollegeName("");
    setDept("");
    setEvents({
      "Event 1": [],
      "Event 2": [],
      "Event 3": [],
      "Event 4": [],
      "Event 5": [],
      "Event 6": [],
      "Event 7": [],
      "Event 8": [],
    });
  };

  return (
    <div className="register-container">
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
              disabled={!college || memberCount < 1}
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
                onChange={(e) =>
                  handleMemberInput(idx, "regNo", e.target.value)
                }
              />
            </div>
          ))}

          {step === 2 && (
            <div>
              <button onClick={() => setStep(1)} className="back" disabled={loading}>
                Back
              </button>
              <button
                onClick={async () => {
                  const regNos = members.map((m) => m.regNo.trim());
                  const uniqueRegNos = new Set(regNos);
                  if (uniqueRegNos.size !== regNos.length) {
                    alert("Duplicate Registration Numbers are not allowed!");
                    return;
                  }

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

                    if (data.exists && data.exists.length > 0) {
                      alert(
                        `These Registration Numbers already exist: ${data.exists.join(
                          ", "
                        )}`
                      );
                      return;
                    }

                    setStep(3);
                  } catch (error) {
                    console.error("Error checking regNos:", error);
                    alert(
                      "Something went wrong while checking registration numbers!"
                    );
                  }
                }}
                disabled={members.some((m) => !m.name || !m.regNo) || loading}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3 */}
      {step >= 3 && (
        <div className="step-3">
          <h2>Step 3: Event Selection</h2>

          {(() => {
            const getAvailableMembers = (eventName, slot) => {
              const isMorning = morningEvents.includes(eventName);
              const sessionEvents = isMorning ? morningEvents : afternoonEvents;

              const chosenMembers = [];
              sessionEvents.forEach((ev) => {
                events[ev].forEach((m, idx) => {
                  if (m && !(ev === eventName && idx === slot)) {
                    chosenMembers.push(m);
                  }
                });
              });

              return members.filter(
                (m) => !chosenMembers.includes(`${m.name} (${m.regNo})`)
              );
            };

            return (
              <>
                {/* Stage Events (Morning) */}
                <h3 style={{ color: "#00f0ff", marginTop: "20px" }}>
                  Stage Events
                </h3>
                <div className="event-list">
                  {Object.keys(events)
                    .slice(0, 4)
                    .map((eventName) => (
                      <div key={eventName} className="event-box">
                        <h4>{eventName}</h4>
                        <div className="participants">
                          {[0, 1].map((slot) => (
                            <select
                              key={slot}
                              value={events[eventName][slot] || ""}
                              onChange={(e) => {
                                const newMember = e.target.value;
                                const newEvents = { ...events };

                                if (newEvents[eventName] === undefined) {
                                  newEvents[eventName] = [];
                                }

                                // Create a copy of the array to ensure immutability
                                const updatedParticipants = [...newEvents[eventName]];

                                // If a member was previously selected for this slot, remove them from other events in the same session
                                if (updatedParticipants[slot]) {
                                  const prevMember = updatedParticipants[slot];
                                  const sessionEvents = morningEvents.includes(eventName) ? morningEvents : afternoonEvents;
                                  sessionEvents.forEach(ev => {
                                    if (newEvents[ev]) {
                                      newEvents[ev] = newEvents[ev].filter(p => p !== prevMember);
                                    }
                                  });
                                }

                                if (newMember) {
                                  // Add the new member, ensuring no duplicates in the same session
                                  const sessionEvents = morningEvents.includes(eventName) ? morningEvents : afternoonEvents;
                                  sessionEvents.forEach(ev => {
                                      if (newEvents[ev] && newEvents[ev].includes(newMember)) {
                                          newEvents[ev] = newEvents[ev].filter(p => p !== newMember);
                                      }
                                  });
                                  updatedParticipants[slot] = newMember;
                                } else {
                                  updatedParticipants[slot] = ""; // Clear the slot
                                }
                                newEvents[eventName] = updatedParticipants.filter(Boolean); // Remove empty slots
                                setEvents(newEvents);
                              }}
                            >
                              <option value="">Select Member</option>
                              {getAvailableMembers(eventName, slot).map(
                                (m, idx) => (
                                  <option
                                    key={idx}
                                    value={`${m.name} (${m.regNo})`}
                                  >
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

                {/* Off Stage Events (Afternoon) */}
                <h3 style={{ color: "#00f0ff", marginTop: "20px" }}>
                  Off Stage Events
                </h3>
                <div className="event-list">
                  {Object.keys(events)
                    .slice(4)
                    .map((eventName) => (
                      <div key={eventName} className="event-box">
                        <h4>{eventName}</h4>
                        <div className="participants">
                          {[0, 1].map((slot) => (
                            <select
                              key={slot}
                              value={events[eventName][slot] || ""}
                              onChange={(e) => {
                                const newMember = e.target.value;
                                const newEvents = { ...events };

                                if (newEvents[eventName] === undefined) {
                                  newEvents[eventName] = [];
                                }

                                // Create a copy of the array to ensure immutability
                                const updatedParticipants = [...newEvents[eventName]];

                                // If a member was previously selected for this slot, remove them from other events in the same session
                                if (updatedParticipants[slot]) {
                                  const prevMember = updatedParticipants[slot];
                                  const sessionEvents = afternoonEvents.includes(eventName) ? afternoonEvents : morningEvents; // This logic needs to be careful
                                  sessionEvents.forEach(ev => {
                                    if (newEvents[ev]) {
                                      newEvents[ev] = newEvents[ev].filter(p => p !== prevMember);
                                    }
                                  });
                                }

                                if (newMember) {
                                  // Add the new member, ensuring no duplicates in the same session
                                  const sessionEvents = afternoonEvents.includes(eventName) ? afternoonEvents : morningEvents; // This logic needs to be careful
                                  sessionEvents.forEach(ev => {
                                      if (newEvents[ev] && newEvents[ev].includes(newMember)) {
                                          newEvents[ev] = newEvents[ev].filter(p => p !== newMember);
                                      }
                                  });
                                  updatedParticipants[slot] = newMember;
                                } else {
                                  updatedParticipants[slot] = ""; // Clear the slot
                                }
                                newEvents[eventName] = updatedParticipants.filter(Boolean); // Remove empty slots
                                setEvents(newEvents);
                              }}
                            >
                              <option value="">Select Member</option>
                              {getAvailableMembers(eventName, slot).map(
                                (m, idx) => (
                                  <option
                                    key={idx}
                                    value={`${m.name} (${m.regNo})`}
                                  >
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
              </>
            );
          })()}

          {/* Navigation buttons */}
          <div>
            <button onClick={() => setStep(2)} disabled={loading}>
              Back
            </button>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Registering..." : "Submit"}
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
              <QRCodeCanvas value={registeredTeamData.teamId} size={128} level="H" />
            </div>

            <button onClick={closePopupAndReset}>Close & Register New Team</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterSymposium;