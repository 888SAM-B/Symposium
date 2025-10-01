import React, { useState, useEffect, useMemo } from "react";

const AdminPage = () => {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("students");
  const [imageUrl, setImageUrl] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // New state for status filter
  const [display, setDisplay] = useState("none");

  const API_URL = import.meta.env.VITE_URL;

  const fetchStudents = () => {
    fetch(`${API_URL}/students`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  };

  const fetchTeams = () => {
    fetch(`${API_URL}/teams`)
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Error fetching teams:", err));
  };

  useEffect(() => {
    fetchStudents();
    fetchTeams();
  }, []);

  const uniqueEvents = useMemo(() => {
    const events = new Set();
    students.forEach((student) => {
      student.events.forEach((event) => {
        events.add(event);
      });
    });
    return [...Array.from(events).sort()];
  }, [students]);

  // Updated smart filtering to include status filter
  const filteredStudents = students.filter((student) => {
    const teamMatch = teamFilter
      ? student.teamNo?.toLowerCase().includes(teamFilter.toLowerCase())
      : true;

    const eventMatch = eventFilter
      ? student.events.some((e) =>
          e.toLowerCase().includes(eventFilter.toLowerCase())
        )
      : true;

    // New status filter condition
    const statusMatch = statusFilter
      ? student.status === statusFilter
      : true;

    return teamMatch && eventMatch && statusMatch;
  });

  const handleStatusChange = async (studentId, currentStatus) => {
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";

    try {
      const response = await fetch(`${API_URL}/students/${studentId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStudents((prevStudents) =>
          prevStudents.map((s) =>
            s._id === studentId ? { ...s, status: newStatus } : s
          )
        );
        console.log(`Student ${studentId} status updated to ${newStatus}`);
      } else {
        console.error("Failed to update student status");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  const openImagePopup = (imgUrl) => {
    setImageUrl(imgUrl);
    setDisplay("flex");
  };

  const closeImagePopup = (e) => {
    if (e.target.className === "img-pop") {
      setDisplay("none");
      setImageUrl("");
    }
  };

  return (
    <>
      <div className="img-pop" style={{ display: display }} onClick={closeImagePopup}>
        <div className="img-pop-up">
          <img src={imageUrl} alt="Payment Proof" />
        </div>
      </div>
      <div>
        <h1>Admin Page</h1>
        <div>
          <button onClick={() => setActiveTab("students")}>Students</button>
          <button onClick={() => setActiveTab("teams")}>Teams</button>
        </div>

        {activeTab === "students" && (
          <div>
            <h2>Student Details</h2>

            <div style={{ marginBottom: "20px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <label>
                Search by Team No:{" "}
                <input
                  type="text"
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  placeholder="Type team no (ex: vt01)"
                />
              </label>
              <label>
                Select by Event:{" "}
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                >
                  <option value="">All Events</option>
                  {uniqueEvents.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </label>
              {/* New Status Filter Dropdown */}
              <label>
                Filter by Status:{" "}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </label>
            </div>

            <table border="1" cellPadding="10" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Student No</th>
                  <th>Name</th>
                  <th>RegNo</th>
                  <th>Team No</th>
                  <th>Team Name</th>
                  <th>Event 1</th>
                  <th>Event 2</th>
                  <th>Payment Status</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s._id}>
                      <td>{s.studentNo}</td>
                      <td>{s.name}</td>
                      <td>{s.regNo}</td>
                      <td>{s.teamNo}</td>
                      <td>{s.teamName}</td>
                      <td>{s.events[0] || '-'}</td>
                      <td>{s.events[1] || '-'}</td>
                      <td onClick={() => openImagePopup(s.imgUrl)}>
                        <p style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>
                          Check Proof
                        </p>
                      </td>
                      <td>{s.status}</td>
                      <td>
                        <button
                          onClick={() => handleStatusChange(s._id, s.status)}
                          style={{
                            backgroundColor:
                              s.status === "Present" ? "#dc3545" : "#28a745",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Mark {s.status === "Present" ? "Absent" : "Present"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "teams" && (
          <div>
            <h2>Team Details</h2>
            <table border="1" cellPadding="10" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Team No</th>
                  <th>Team Name</th>
                  <th>College</th>
                  <th>Department</th>
                  <th>Members</th>
                  <th>Events</th>
                </tr>
              </thead>
              <tbody>
                {teams.length > 0 ? (
                  teams.map((t) => (
                    <tr key={t._id}>
                      <td>{t.teamNo}</td>
                      <td>{t.teamName}</td>
                      <td>{t.collegeName}</td>
                      <td>{t.dept}</td>
                      <td>
                        {t.members.map((m, i) => (
                          <div key={i}>
                            {m.studentNo} - {m.name} ({m.regNo}) -{" "}
                            *Status: {m.status}*
                          </div>
                        ))}
                      </td>
                      <td>
                        {Object.keys(t.event).length > 0
                          ? Object.keys(t.event).join(", ")
                          : "No events"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No teams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPage;