import React, { useState, useEffect } from 'react';

const Admin = () => {
    const [responseData, setResponseData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [attendanceFilter, setAttendanceFilter] = useState('all');
    const [eventFilter, setEventFilter] = useState('all');
    const [events, setEvents] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('');

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
            data = data.filter(p => {
                const participantDate = new Date(p.date).toISOString().slice(0, 10);
                return participantDate === dateFilter;
            });
        }
        setFilteredData(data);
    }, [attendanceFilter, eventFilter, responseData, searchName, dateFilter]);

    const markAsPresent = async (serialNumber,uid) => {
        const participant = responseData.find(p => p.serialNumber === serialNumber);
        const res=confirm(`Are you sure you want to mark ${participant.name} as present?`);
        if (!res) return;
        
        if (!participant) return;

        try {
            
            await fetch(`${import.meta.env.VITE_URL}/mark-present`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serialNumber: serialNumber,
                    uniqueId: uid 
                })
            });
           window.location.reload();
        } catch (err) {
            console.error('Failed to mark as present:', err);
        }
    };
    const markAsAbsent = async (serialNumber,uid) => {
        const participant = responseData.find(p => p.serialNumber === serialNumber);
        const res=confirm(`Are you sure you want to mark ${participant.name} as present?`);
        if (!res) return;

        if (!participant) return;

        try {
            
            await fetch(`${import.meta.env.VITE_URL}/mark-absent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serialNumber: serialNumber,
                    uniqueId: uid 
                })
            });
           window.location.reload();
        } catch (err) {
            console.error('Failed to mark as present:', err);
        }
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
                        {events.map(event => (
                            <option key={event} value={event}>{event}</option>
                        ))}
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
                            <th>Mark as present</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(participant => (
                            <tr key={participant.serialNumber}>
                                <td>{participant.serialNumber}</td>
                                <td>{participant.name}</td>
                                <td>{participant.email}</td>
                                <td>{participant.mobile}</td>
                                <td>{participant.level === 1 ? "UG" : "PG"}</td>
                                <td>{participant.college}</td>
                                <td>{participant.year}</td>
                                <td>{participant.department}</td>
                                <td>{participant.event}</td>
                                <td>{new Date(participant.date).toLocaleDateString()}</td>
                                <td>{participant.attendance ? '✅' : '❌'}</td>
                                <td>
                                    <button  style={{display: participant.attendance ? 'none' : 'inline',backgroundColor: 'green', color: 'white'}}  onClick={() => markAsPresent(participant.serialNumber,participant.uniqueId)}>Mark as Present</button>
                                    <button  style={{display: !participant.attendance ? 'none' : 'inline', backgroundColor: 'red', color: 'white'}} onClick={() => markAsAbsent(participant.serialNumber,participant.uniqueId)}>Mark as Absent</button>
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