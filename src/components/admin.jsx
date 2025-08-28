import React, { useState, useEffect } from 'react';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Admin = () => {
    const [responseData, setResponseData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [attendanceFilter, setAttendanceFilter] = useState('all');
    const [eventFilter, setEventFilter] = useState('all');
    const [events, setEvents] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('');

    //   Fetch data
    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_URL}/admin-data`)
            .then(res => res.json())
            .then(data => {
                setResponseData(data);
                setFilteredData(data);
                setEvents([...new Set(data.map(p => p.event))]);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    //   Apply filters
    useEffect(() => {
        let data = responseData;

        if (attendanceFilter !== 'all') {
            data = data.filter(p => attendanceFilter === 'present' ? p.attendance : !p.attendance);
        }

        if (eventFilter !== 'all') {
            data = data.filter(p => p.event === eventFilter);
        }

        if (searchName.trim() !== '') {
            data = data.filter(p => p.name.toLowerCase().includes(searchName.trim().toLowerCase()));
        }

        if (dateFilter) {
            data = data.filter(p => new Date(p.date).toISOString().slice(0, 10) === dateFilter);
        }

        setFilteredData(data);
    }, [attendanceFilter, eventFilter, responseData, searchName, dateFilter]);

    //   Mark as Present
    const markAsPresent = async (serialNumber, uid) => {
        const participant = responseData.find(p => p.serialNumber === serialNumber);
        if (!participant) return;
        if (!confirm(`Are you sure you want to mark ${participant.name} as present?`)) return;

        try {
            await fetch(`${import.meta.env.VITE_URL}/mark-present`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serialNumber, uniqueId: uid })
            });
            window.location.reload();
        } catch (err) {
            console.error('Failed to mark as present:', err);
        }
    };

    //   Mark as Absent
    const markAsAbsent = async (serialNumber, uid) => {
        const participant = responseData.find(p => p.serialNumber === serialNumber);
        if (!participant) return;
        if (!confirm(`Are you sure you want to mark ${participant.name} as absent?`)) return;

        try {
            await fetch(`${import.meta.env.VITE_URL}/mark-absent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serialNumber, uniqueId: uid })
            });
            window.location.reload();
        } catch (err) {
            console.error('Failed to mark as absent:', err);
        }
    };

    //   Export to Excel using exceljs
   // Export all participants ignoring filters
const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Participants");

    worksheet.columns = [
        { header: "VIBE Number", key: "serialNumber", width: 15 },
        { header: "Name", key: "name", width: 20 },
        { header: "Email", key: "email", width: 25 },
        { header: "Mobile", key: "mobile", width: 15 },
        { header: "Level", key: "level", width: 10 },
        { header: "College", key: "college", width: 25 },
        { header: "Year", key: "year", width: 10 },
        { header: "Department", key: "department", width: 20 },
        { header: "Event", key: "event", width: 20 },
        { header: "Date", key: "date", width: 15 },
        { header: "Attendance", key: "attendance", width: 15 },
    ];

    responseData.forEach(p => {
        worksheet.addRow({
            serialNumber: p.serialNumber,
            name: p.name,
            email: p.email,
            mobile: p.mobile,
            level: p.level === 1 ? "UG" : "PG",
            college: p.college,
            year: p.year,
            department: p.department,
            event: p.event,
            date: new Date(p.date).toLocaleDateString(),
            attendance: p.attendance ? "PRESENT" : "ABSENT",
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "participants.xlsx");
};

// Export all participants event-wise ignoring filters
const exportEventWiseExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    // Get all unique events from full data
    const uniqueEvents = [...new Set(responseData.map(p => p.event))];

    uniqueEvents.forEach(eventName => {
        const worksheet = workbook.addWorksheet(eventName.substring(0, 31)); // max 31 chars for sheet name

        worksheet.columns = [
            { header: "VIBE Number", key: "serialNumber", width: 15 },
            { header: "Name", key: "name", width: 20 },
            { header: "Email", key: "email", width: 25 },
            { header: "Mobile", key: "mobile", width: 15 },
            { header: "Level", key: "level", width: 10 },
            { header: "College", key: "college", width: 25 },
            { header: "Year", key: "year", width: 10 },
            { header: "Department", key: "department", width: 20 },
            { header: "Date", key: "date", width: 15 },
            { header: "Attendance", key: "attendance", width: 15 },
        ];

        // Add rows for this event
        responseData
            .filter(p => p.event === eventName)
            .forEach(p => {
                worksheet.addRow({
                    serialNumber: p.serialNumber,
                    name: p.name,
                    email: p.email,
                    mobile: p.mobile,
                    level: p.level === 1 ? "UG" : "PG",
                    college: p.college,
                    year: p.year,
                    department: p.department,
                    date: new Date(p.date).toLocaleDateString(),
                    attendance: p.attendance ? "PRESENT" : "ABSENT",
                });
            });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "participants_by_event.xlsx");
};


    return (
        <div>
            <h2>Registered Participants</h2>

            <div style={{ marginBottom: '1em' }}>
                <label>
                    Attendance:&nbsp;
                    <select value={attendanceFilter} onChange={e => setAttendanceFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                    </select>
                </label>
                &nbsp;&nbsp;
                <label>
                    Event:&nbsp;
                    <select value={eventFilter} onChange={e => setEventFilter(e.target.value)}>
                        <option value="all">All</option>
                        {events.map(event => <option key={event} value={event}>{event}</option>)}
                    </select>
                </label>
                &nbsp;&nbsp;
                <label>
                    Search Name:&nbsp;
                    <input
                        type="text"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                        placeholder="Enter name"
                    />
                </label>
                &nbsp;&nbsp;
                <label>
                    Date:&nbsp;
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                    />
                </label>
                &nbsp;&nbsp;
                <button
                    onClick={exportToExcel}
                    style={{ backgroundColor: "#007bff", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px" }}
                >
                    Export to Excel
                </button>
                <button
                    onClick={exportEventWiseExcel}
                    style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        marginLeft: "10px"
                    }}
                >
                    Export Event-wise Excel
                </button>

            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2em' }}>
                    <span>Loading...</span>
                </div>
            ) : (
                <table border={1} cellPadding={15} cellSpacing={0}>
                    <thead>
                        <tr>
                            <th>VIBE Number</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                            <th>Level</th>
                            <th>College</th>
                            <th>Year</th>
                            <th>Department</th>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Attendance</th>
                            <th>Mark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(p => (
                            <tr key={p.serialNumber}>
                                <td>{p.serialNumber}</td>
                                <td>{p.name}</td>
                                <td>{p.email}</td>
                                <td>{p.mobile}</td>
                                <td>{p.level === 1 ? "UG" : "PG"}</td>
                                <td>{p.college}</td>
                                <td>{p.year}</td>
                                <td>{p.department}</td>
                                <td>{p.event}</td>
                                <td>{new Date(p.date).toLocaleDateString()}</td>
                                <td style={{ color: p.attendance ? 'green' : 'red' }}>{p.attendance ? 'PRESENT' : 'ABSENT'}</td>
                                <td>
                                    {!p.attendance && <button style={{ backgroundColor: 'green', color: 'white' }}
                                        onClick={() => markAsPresent(p.serialNumber, p.uniqueId)}>Mark as Present</button>}
                                    {p.attendance && <button style={{ backgroundColor: 'red', color: 'white' }}
                                        onClick={() => markAsAbsent(p.serialNumber, p.uniqueId)}>Mark as Absent</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Admin;
