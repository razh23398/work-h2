import React, { useState } from 'react';
    import Calendar from 'react-calendar';

    function ManagerView({ shifts, addShift, requests, approveRequest, rejectRequest }) {
      const [newShift, setNewShift] = useState({
        date: null,
        shiftType: 'morning',
        employees: 1,
      });

      const handleInputChange = (e) => {
        setNewShift({ ...newShift, [e.target.name]: e.target.value });
      };

      const handleDateChange = (date) => {
        setNewShift({ ...newShift, date: date });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (newShift.date) {
          addShift({
            date: newShift.date.toLocaleDateString(),
            shiftType: newShift.shiftType,
            employees: parseInt(newShift.employees, 10),
          });
          setNewShift({ date: null, shiftType: 'morning', employees: 1 });
        } else {
          alert('Please select a date.');
        }
      };

      const tileContent = ({ date, view }) => {
        if (view === 'month') {
          const hasShift = shifts.some(
            (shift) => new Date(shift.date).getTime() === date.getTime(),
          );
          return hasShift ? <div className="react-calendar__dot" /> : null;
        }
        return null;
      };

      const isPastDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
      };

      return (
        <div className="shift-container">
          <h2>Manager View</h2>
          <h3>Add New Shift</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Date:
              <div className="react-calendar-wrapper">
                <Calendar
                  value={newShift.date}
                  onChange={handleDateChange}
                  tileContent={tileContent}
                  minDate={new Date()}
                  tileDisabled={({ date }) => isPastDate(date)}
                />
              </div>
            </label>
            <label>
              Shift Type:
              <select
                name="shiftType"
                value={newShift.shiftType}
                onChange={handleInputChange}
              >
                <option value="morning">Morning</option>
                <option value="noon">Noon</option>
                <option value="evening">Evening</option>
              </select>
            </label>
            <label>
              Number of Employees:
              <input
                type="number"
                name="employees"
                value={newShift.employees}
                onChange={handleInputChange}
                min="1"
                required
              />
            </label>
            <button type="submit">Add Shift</button>
          </form>

          <h3>Open Shifts</h3>
          <ul className="shift-list">
            {shifts
              .filter((shift) => shift.status === 'open')
              .map((shift) => (
                <li key={shift.id}>
                  {shift.date} - {shift.shiftType}
                </li>
              ))}
          </ul>

          <h3>Pending Requests</h3>
          <ul className="shift-list">
            {requests
              .filter((req) => req.status === 'pending')
              .map((req) => {
                const shift = shifts.find((s) => s.id === req.shiftId);
                return shift ? (
                  <li key={`${req.shiftId}-${req.employeeName}`}>
                    {shift.date} - {shift.shiftType} - Requested by {req.employeeName}
                    <div className="manager-actions">
                      <button onClick={() => approveRequest(req.shiftId, req.employeeName)}>Approve</button>
                      <button onClick={() => rejectRequest(req.shiftId, req.employeeName)}>Reject</button>
                    </div>
                  </li>
                ) : null;
              })}
          </ul>

          <h3>Approved Shifts</h3>
          <ul className="shift-list">
            {shifts
              .filter((shift) => shift.status === 'approved')
              .map((shift) => (
                <li key={shift.id}>
                  {shift.date} - {shift.shiftType}
                </li>
              ))}
          </ul>
        </div>
      );
    }

    export default ManagerView;
