import React, { useState } from "react";
import "./reg.css";

const RegisterSymposium = () => {
  const [step, setStep] = useState(1);
  const [college, setCollege] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
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

  const morningEvents = ["Event 1", "Event 2", "Event 3", "Event 4"];
  const afternoonEvents = ["Event 5", "Event 6", "Event 7", "Event 8"];

  // Step 2: generate member inputs
  const handleMemberInput = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  // Validate duplicate registration numbers
  const hasDuplicateRegNo = () => {
    const regNos = members.map((m) => m.regNo.trim());
    return new Set(regNos).size !== regNos.length;
  };

  // Final submit
  const handleSubmit = async () => {
    if (hasDuplicateRegNo()) {
      alert("Duplicate registration numbers are not allowed!");
      return;
    }

    // Check that every student is in at least one event
    const allAssigned = members.every((member) =>
      Object.values(events).some((ev) =>
        ev.includes(`${member.name} (${member.regNo})`)
      )
    );

    if (!allAssigned) {
      alert("Every student must be assigned to at least one event!");
      return;
    }

    const data = {
      college,
      members,
      events,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/team-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({teamName:college,event:events,members})
      });

      const result = await res.json();
      if (res.ok) {
        alert("Team Registered Successfully!");
        console.log("Response:", result);
      } else {
        alert(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Server error, please try again later.");
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

  return (
    <div className="register-container">
      {step === 1 && (
        <div>
          <h2>Step 1: College Details</h2>
          <input
            type="text"
            placeholder="College Name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
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
          <button
            onClick={verifyTeamName}
            disabled={!college || memberCount < 1}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
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
                type="text"
                placeholder="Registration Number"
                value={m.regNo}
                onChange={(e) =>
                  handleMemberInput(idx, "regNo", e.target.value)
                }
              />
            </div>
          ))}

          <div>
            <button onClick={() => setStep(1)} className="back">
              Back
            </button>
            <button
              onClick={() => {
                const regNos = members.map((m) => m.regNo.trim());
                const uniqueRegNos = new Set(regNos);

                if (uniqueRegNos.size !== regNos.length) {
                  alert("Duplicate Registration Numbers are not allowed!");
                  return;
                }

                setStep(3);
              }}
              disabled={members.some((m) => !m.name || !m.regNo)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Step 3: Event Selection</h2>

          {/* Stage Events Section */}
          <h3 style={{ color: "#00f0ff", marginTop: "20px" }}>Stage Events</h3>
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

                          if (events[eventName][slot]) {
                            newEvents[eventName] = newEvents[eventName].filter(
                              (m) => m !== events[eventName][slot]
                            );
                          }

                          if (
                            newMember &&
                            !newEvents[eventName].includes(newMember)
                          ) {
                            const isMorning = morningEvents.includes(eventName);
                            const sessionEvents = isMorning
                              ? morningEvents
                              : afternoonEvents;

                            const alreadyInSession = sessionEvents.some((ev) =>
                              newEvents[ev].includes(newMember)
                            );

                            if (alreadyInSession) {
                              alert(
                                `${newMember} can join only one ${
                                  isMorning ? "morning" : "afternoon"
                                } event!`
                              );
                              return;
                            }

                            newEvents[eventName][slot] = newMember;
                          }

                          setEvents(newEvents);
                        }}
                      >
                        <option value="">Select Member</option>
                        {members.map((m, idx) => (
                          <option key={idx} value={`${m.name} (${m.regNo})`}>
                            {m.name} ({m.regNo})
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                  <p>
                    Participants: {events[eventName].join(", ") || "None"}
                  </p>
                </div>
              ))}
          </div>

          {/* Off Stage Events Section */}
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

                          if (events[eventName][slot]) {
                            newEvents[eventName] = newEvents[eventName].filter(
                              (m) => m !== events[eventName][slot]
                            );
                          }

                          if (
                            newMember &&
                            !newEvents[eventName].includes(newMember)
                          ) {
                            const isMorning = morningEvents.includes(eventName);
                            const sessionEvents = isMorning
                              ? morningEvents
                              : afternoonEvents;

                            const alreadyInSession = sessionEvents.some((ev) =>
                              newEvents[ev].includes(newMember)
                            );

                            if (alreadyInSession) {
                              alert(
                                `${newMember} can join only one ${
                                  isMorning ? "morning" : "afternoon"
                                } event!`
                              );
                              return;
                            }

                            newEvents[eventName][slot] = newMember;
                          }

                          setEvents(newEvents);
                        }}
                      >
                        <option value="">Select Member</option>
                        {members.map((m, idx) => (
                          <option key={idx} value={`${m.name} (${m.regNo})`}>
                            {m.name} ({m.regNo})
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                  <p>
                    Participants: {events[eventName].join(", ") || "None"}
                  </p>
                </div>
              ))}
          </div>

          <div>
            <button onClick={() => setStep(2)}>Back</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterSymposium;
