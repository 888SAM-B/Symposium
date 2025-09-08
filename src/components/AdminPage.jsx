import React, { useState, useEffect } from "react";

const AdminPage = () => {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("students");

  const [teamFilter, setTeamFilter] = useState("");
  const [eventFilter, setEventFilter] = useState(""); // New state for event filtering

  const API_URL = import.meta.env.VITE_URL; // Use a constant for the base URL

  // Function to fetch students
  const fetchStudents = () => {
    fetch(`${API_URL}/students`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  };

  // Function to fetch teams
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

  // 🔥 Smart filtering (substring + case-insensitive)
  const filteredStudents = students.filter((student) => {
    const teamMatch = teamFilter
      ? student.teamNo?.toLowerCase().includes(teamFilter.toLowerCase())
      : true;

    const eventMatch = eventFilter
      ? student.events.some((e) =>
          e.toLowerCase().includes(eventFilter.toLowerCase())
        )
      : true;

    return teamMatch && eventMatch;
  });

  // Handle status change for a student
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
        // Update the student's status in the local state
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

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <button onClick={() => setActiveTab("students")}>Students</button>
        <button onClick={() => setActiveTab("teams")}>Teams</button>
      </div>

      {activeTab === "students" && (
        <div>
          <h2>Student Details</h2>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ marginRight: "15px" }}>
              Search by Team No:{" "}
              <input
                type="text"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                placeholder="Type team no (ex: vt01)"
              />
            </label>
            <label>
              Search by Event:{" "}
              <input
                type="text"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                placeholder="Type event name (ex: web design)"
              />
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
                <th>Events</th>
                <th>Status</th>
                <th>Actions</th> {/* New column for actions */}
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
                    <td>{s.events.join(", ")}</td>
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
                  <td colSpan="8" style={{ textAlign: "center" }}>
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
                <th>Events</th> {/* Added events to team table */}
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
                      {/* Display events from the team's event map */}
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
  );
};

export default AdminPage;