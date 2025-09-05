import React, { useState } from "react";
import "./reg.css";
import { QRCodeCanvas } from "qrcode.react";

const RegisterSymposium = () => {
  const [step, setStep] = useState(1);
  const [college, setCollege] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [collegeName, setCollegeName] = useState("");
  const [dept, setDept] = useState("");
  const [events, setEvents] = useState({
    "Paper Presentation": [],
    "Poster Presentation": [],
    "Story Telling": [],
    "Quiz": [],
    "Word Hunt": [],
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

  const morningEvents = ["Paper Presentation", "Poster Presentation", "Story Telling", "Quiz"];
  const afternoonEvents = ["Word Hunt", "Social Engineering App", "API Fusion"];
  // Note: allEventNames is not strictly needed for rendering but useful for initial setup/filtering

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
        }),
      });

      const result = await res.json();
      if (res.ok) {
        console.log("Response:", result);
        setRegisteredTeamData({
          teamId: result.teamId,
          teamName: college,
          collegeName: collegeName,
          dept: dept,
          members: members,
          events: events,
        });
        setShowSuccessPopup(true);
      } else if (res.status === 400) {
        alert(result.error || "Duplicate registration numbers found!");
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
      "Paper Presentation": [], "Poster Presentation": [], "Story Telling": [], "Quiz": [],
      "Word Hunt": [], "Social Engineering App": [], "API Fusion": [], 
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

          {/* Morning Events Section */}
          <h3 style={{ color: "#00f0ff", marginTop: "20px" }}>Stage Events</h3>
          <div className="add-event-section">
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
            <button onClick={handleAddMorningEvent} disabled={!eventToAddMorning}>
              Add Event
            </button>
          </div>

          <div className="event-list">
            {selectedMorningEvents.sort((a,b) => morningEvents.indexOf(a) - morningEvents.indexOf(b)).map((eventName) => (
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
                      <option value="">Select  Member</option>
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

          {/* Afternoon Events Section */}
          <h3 style={{ color: "#00f0ff", marginTop: "20px" }}>Off Stage Events</h3>
          <div className="add-event-section">
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
            <button onClick={handleAddAfternoonEvent} disabled={!eventToAddAfternoon}>
              Add Event
            </button>
          </div>

          <div className="event-list">
            {selectedAfternoonEvents.sort((a,b) => afternoonEvents.indexOf(a) - afternoonEvents.indexOf(b)).map((eventName) => (
              <div key={eventName} className="event-box" >
                <h4 className="evt-box-header ">
                  {eventName}
                  <p
                    className="remove-event-button"
                    onClick={() => handleRemoveEvent(eventName, false)} // Pass false for afternoon event
                  >
                    X
                  </p>
                </h4>
                <div className="participants">
                  {[0, 1].map((slot) => (
                    <select
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
                <p>
                  Participants: {events[eventName].join(", ") || "None"}
                </p>
              </div>
            ))}
          </div>

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