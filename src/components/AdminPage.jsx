import React, { useState, useEffect, useMemo } from "react";

const AdminPage = () => {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("students");
  const [imageUrl, setImageUrl] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [display, setDisplay] = useState("none");

  const [studentNameFilter, setStudentNameFilter] = useState("");

  const [selectedEventForEventsTab, setSelectedEventForEventsTab] = useState("");

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

  const filteredStudents = students.filter((student) => {
    const teamMatch = teamFilter
      ? student.teamNo?.toLowerCase().includes(teamFilter.toLowerCase())
      : true;

    const eventMatch = eventFilter
      ? student.events.some((e) =>
          e.toLowerCase().includes(eventFilter.toLowerCase())
        )
      : true;

    const statusMatch = statusFilter
      ? student.status === statusFilter
      : true;

    const nameMatch = studentNameFilter
      ? student.name?.toLowerCase().includes(studentNameFilter.toLowerCase())
      : true;

    return teamMatch && eventMatch && statusMatch && nameMatch;
  });

  const processedEventParticipants = useMemo(() => {
    if (!selectedEventForEventsTab) return [];

    const participantsMap = new Map();

    students.forEach(student => {
      if (!student.events.includes(selectedEventForEventsTab)) {
        return;
      }

      if (student.teamName === "SOLO-REG") {
        participantsMap.set(`solo-${student._id}`, {
          type: "solo",
          _id: student._id,
          studentNo: student.studentNo,
          name: student.name,
          regNo: student.regNo, // This is now the Email ID
          teamNo: student.teamNo,
          teamName: student.teamName,
          collegeName: student.college,
          status: student.status,
          imgUrl: student.imgUrl,
          events: student.events,
          // Removed 'email' field, will use 'regNo' as email
        });
      } else {
        const teamNo = student.teamNo;
        if (!participantsMap.has(teamNo)) {
          const teamDetails = teams.find(t => t.teamNo === teamNo);
          participantsMap.set(teamNo, {
            type: "team",
            teamNo: teamNo,
            teamName: student.teamName,
            collegeName: teamDetails ? teamDetails.collegeName : "N/A",
            members: [],
            hasPaymentProof: false,
            overallStatus: "N/A",
            imgUrls: [],
          });
        }
        const teamEntry = participantsMap.get(teamNo);
        teamEntry.members.push({
          _id: student._id,
          studentNo: student.studentNo,
          name: student.name,
          regNo: student.regNo, // This is now the Email ID
          status: student.status,
          imgUrl: student.imgUrl,
          // Removed 'email' field, will use 'regNo' as email
        });

        if (student.imgUrl) {
          teamEntry.hasPaymentProof = true;
          teamEntry.imgUrls.push(student.imgUrl);
        }
      }
    });

    participantsMap.forEach((entry, key) => {
      if (entry.type === "team") {
        const statuses = entry.members.map(m => m.status);
        const presentCount = statuses.filter(s => s === "Present").length;
        const absentCount = statuses.filter(s => s === "Absent").length;
        const totalMembers = statuses.length;

        if (totalMembers === 0) {
          entry.overallStatus = "No Members";
        } else if (presentCount === totalMembers) {
          entry.overallStatus = "Present";
        } else if (absentCount === totalMembers) {
          entry.overallStatus = "Absent";
        } else if (presentCount > 0 && absentCount > 0) {
          entry.overallStatus = "Mixed";
        } else if (presentCount > 0 && absentCount === 0) {
          entry.overallStatus = "Partially Present";
        } else if (absentCount > 0 && presentCount === 0) {
          entry.overallStatus = "Partially Absent";
        } else {
          entry.overallStatus = "N/A";
        }
        
        entry.displayImgUrl = entry.imgUrls.length > 0 ? entry.imgUrls[0] : "";
        // For teams, use the regNo (email) of the first member as the primary team email
        entry.primaryEmail = entry.members[0]?.regNo || "N/A"; 
      } else {
        entry.overallStatus = entry.status;
        entry.displayImgUrl = entry.imgUrl;
        // For solo, use their regNo (email) as primary email
        entry.primaryEmail = entry.regNo;
      }
    });

    return Array.from(participantsMap.values());
  }, [students, teams, selectedEventForEventsTab]);

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

  const downloadExcel = (data, headers, filename = "data") => {
    if (!data || data.length === 0) {
      alert("No data to export!");
      return;
    }

    const csvRows = [];
    
    csvRows.push(headers.map(header => `"${header}"`).join(','));

    data.forEach(item => {
      const row = headers.map(header => {
        let value = '';
        switch (header) {
          // --- Students Tab Headers ---
          case 'Student No': value = item.studentNo; break;
          case 'Name': value = item.name; break;
          case 'RegNo': value = item.regNo; break;
          case 'Team No': value = item.teamNo; break; 
          case 'Team Name': value = item.teamName; break; 
          case 'College Name': 
            if (activeTab === "students") {
                if (item.teamName === "SOLO-REG") {
                    value = item.college;
                } else {
                    const team = teams.find((t) => t.teamNo === item.teamNo);
                    value = team ? team.collegeName : "N/A";
                }
            } else if (activeTab === "events") {
                value = item.collegeName;
            }
            break;
          case 'Event 1': value = item.events?.[0] || ''; break;
          case 'Event 2': value = item.events?.[1] || ''; break;
          case 'Payment Status': value = item.imgUrl ? 'Proof Available' : 'N/A'; break;
          case 'Status': value = item.status; break;

          // --- Teams Tab Headers ---
          case 'College': value = item.collegeName; break;
          case 'Department': value = item.dept; break;
          case 'Members': 
            value = item.members ? item.members.map(m => `${m.name} (${m.regNo}) - Status: ${m.status}`).join('; ') : ''; 
            break;
          case 'Events': 
            value = item.event ? Object.keys(item.event).join(', ') : ''; 
            break;
          
          // --- Events Tab Headers (Simplified for Attendance) ---
          case 'Type': value = item.type === 'solo' ? 'Solo' : 'Team'; break;
          case 'Student/Team Name': value = item.type === 'solo' ? item.name : item.teamName; break; 
          case 'Members List': 
            value = item.type === 'solo' 
                ? `${item.name} (${item.regNo})` 
                : (item.members && item.members.length > 0 
                    ? item.members.map(m => `${m.name} (${m.regNo})`).join(', ') // Join with comma for excel
                    : ''); 
            break;
          case 'College Name': value = item.collegeName; break;
          case 'Email ID': 
            value = item.primaryEmail || 'N/A'; // Use the primaryEmail field
            break;
          case 'Overall Status': value = item.overallStatus; break; 

          default: value = item[header.replace(/\s/g, '')] || ''; 
        }
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert("Your browser does not support downloading files directly. Please copy the data manually.");
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
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setActiveTab("students")}>Students</button>
          <button onClick={() => setActiveTab("teams")}>Teams</button>
          <button onClick={() => setActiveTab("events")}>Events</button>
        </div>

        {activeTab === "students" && (
          <div>
            <h2>Student Details</h2>

            <div style={{ marginBottom: "20px", display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <label>
                Search by Student Name:{" "}
                <input
                  type="text"
                  value={studentNameFilter}
                  onChange={(e) => setStudentNameFilter(e.target.value)}
                  placeholder="Type student name"
                />
              </label>
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
              <button
                onClick={() => {
                  const headers = [
                    "Student No", "Name", "RegNo", "Team No", "Team Name", 
                    "College Name", "Event 1", "Event 2", "Payment Status", "Status"
                  ];
                  downloadExcel(filteredStudents, headers, "Students_List");
                }}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "auto"
                }}
              >
                Download Students as Excel
              </button>
            </div>

            <table border="1" cellPadding="10" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Student No</th>
                  <th>Name</th>
                  <th>RegNo</th>
                  <th>Team No</th>
                  <th>Team Name</th>
                  <th>College Name</th>
                  <th>Event 1</th>
                  <th>Event 2</th>
                  <th>Payment Status</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => {
                    let collegeDisplayName = "";
                    if (s.teamName === "SOLO-REG") {
                      collegeDisplayName = s.college;
                    } else {
                      const team = teams.find((t) => t.teamNo === s.teamNo);
                      collegeDisplayName = team ? team.collegeName : "N/A";
                    }

                    return (
                      <tr key={s._id}>
                        <td>{s.studentNo}</td>
                        <td>{s.name}</td>
                        <td>{s.regNo}</td>
                        <td>{s.teamNo}</td>
                        <td>{s.teamName}</td>
                        <td>{collegeDisplayName}</td>
                        <td>{s.events[0] || '-'}</td>
                        <td>{s.events[1] || '-'}</td>
                        <td onClick={() => s.imgUrl && openImagePopup(s.imgUrl)}>
                          {s.imgUrl ? (
                            <p style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>
                              Check Proof
                            </p>
                          ) : (
                            "N/A"
                          )}
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center" }}>
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
            <div style={{ marginBottom: "20px", textAlign: "right" }}>
              <button
                onClick={() => {
                  const headers = [
                    "Team No", "Team Name", "College", "Department", "Members", "Events"
                  ];
                  downloadExcel(teams, headers, "Teams_List");
                }}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Download Teams as Excel
              </button>
            </div>
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

        {activeTab === "events" && (
          <div>
            <h2>Event-wise Participants</h2>
            <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <label>
                Select Event:{" "}
                <select
                  value={selectedEventForEventsTab}
                  onChange={(e) => setSelectedEventForEventsTab(e.target.value)}
                >
                  <option value="">--- Select an Event ---</option>
                  {uniqueEvents.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </label>
              {selectedEventForEventsTab && (
                <button
                  onClick={() => {
                    const headers = [
                      "Type", 
                      "Student/Team Name", 
                      "Members List",
                      "College Name",
                      "Email ID", 
                      "Overall Status" 
                    ];
                    downloadExcel(processedEventParticipants, headers, `${selectedEventForEventsTab}_Attendance`);
                  }}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Download Attendance Sheet as Excel
                </button>
              )}
            </div>

            {selectedEventForEventsTab && (
              <table border="1" cellPadding="10" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Team No</th> 
                    <th>Team/Student Name</th>
                    <th>College Name</th>
                    <th>Members/Reg No</th>
                    <th>Payment Status</th>
                    <th>Overall Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedEventParticipants.length > 0 ? (
                    processedEventParticipants.map((entry) => (
                      <tr key={entry.type === "solo" ? entry._id : entry.teamNo}>
                        <td>{entry.type === "solo" ? "Solo" : "Team"}</td>
                        <td>{entry.teamNo || '-'}</td>
                        <td>
                          {entry.type === "solo" ? entry.name : entry.teamName}
                        </td>
                        <td>{entry.collegeName}</td>
                        <td>
                          {entry.type === "solo" ? (
                            `${entry.name} (${entry.regNo})` 
                          ) : (
                            <ul>
                              {entry.members.map((member) => (
                                <li key={member._id}>
                                  {member.name} ({member.regNo}) - Status: {member.status}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td onClick={() => entry.displayImgUrl && openImagePopup(entry.displayImgUrl)}>
                          {entry.type === "solo" ? (
                            entry.imgUrl ? (
                              <p style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>
                                Check Proof
                              </p>
                            ) : "N/A"
                          ) : (
                            entry.hasPaymentProof ? (
                              <p style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>
                                {"Check Payment Proof"}
                              </p>
                            ) : "N/A"
                          )}
                        </td>
                        <td>{entry.overallStatus}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No participants found for this event.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            {!selectedEventForEventsTab && (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                Please select an event to view participants.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPage;