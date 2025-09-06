import React, { useState, useEffect } from "react";

const AdminPage = () => {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("students");

  const [teamFilter, setTeamFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL}/students`)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));

    fetch(`${import.meta.env.VITE_URL}/teams`)
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  // 🔥 Smart filtering (substring + case-insensitive)
  const filteredStudents = students.filter((student) => {
    return (
      (teamFilter
        ? student.teamNo?.toLowerCase().includes(teamFilter.toLowerCase())
        : true) &&
      (eventFilter
        ? student.events.some((e) =>
            e.toLowerCase().includes(eventFilter.toLowerCase())
          )
        : true)
    );
  });

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

          <div>
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
              Search by Event:{" "}
              <input
                type="text"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                placeholder="Type event name (ex: web)"
              />
            </label>
          </div>

          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Student No</th>
                <th>Name</th>
                <th>RegNo</th>
                <th>Team No</th>
                <th>Team Name</th>
                <th>Events</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s._id}>
                  <td>{s.studentNo}</td>
                  <td>{s.name}</td>
                  <td>{s.regNo}</td>
                  <td>{s.teamNo}</td>
                  <td>{s.teamName}</td>
                  <td>{s.events.join(", ")}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "teams" && (
        <div>
          <h2>Team Details</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Team No</th>
                <th>Team Name</th>
                <th>College</th>
                <th>Department</th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t._id}>
                  <td>{t.teamNo}</td>
                  <td>{t.teamName}</td>
                  <td>{t.collegeName}</td>
                  <td>{t.dept}</td>
                  <td>
                    {t.members.map((m, i) => (
                      <div key={i}>
                        {m.studentNo} - {m.name} ({m.regNo})
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
