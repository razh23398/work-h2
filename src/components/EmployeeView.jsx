import React, { useState } from 'react';
    import Calendar from 'react-calendar';

    function EmployeeView({ shifts, requestShift }) {
      const [employeeName, setEmployeeName] = useState('');
      const [selectedDate, setSelectedDate] = useState(null);

      const handleRequest = (shiftId) => {
        if (employeeName) {
          requestShift(shiftId, employeeName);
        } else {
          alert('Please enter your name before requesting a shift.');
        }
      };

      const handleDateChange = (date) => {
        setSelectedDate(date);
      };

      const filteredShifts = selectedDate
        ? shifts.filter(
            (shift) =>
              shift.status === 'open' &&
              new Date(shift.date).getTime() === selectedDate.getTime(),
          )
        : shifts.filter((shift) => shift.status === 'open');

      const tileContent = ({ date, view }) => {
        if (view === 'month') {
          const hasOpenShift = shifts.some(
            (shift) =>
              shift.status === 'open' &&
              new Date(shift.date).toLocaleDateString() === date.toLocaleDateString(),
          );
          return hasOpenShift ? (
            <div className="react-calendar__dot" style={{ backgroundColor: '#ffa726' }} />
          ) : null;
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
          <h2>Employee View</h2>
          <label>
            Your Name:
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </label>
          <label>
            Select Date:
            <div className="react-calendar-wrapper">
              <Calendar
                value={selectedDate}
                onChange={handleDateChange}
                tileContent={tileContent}
                minDate={new Date()}
                tileDisabled={({ date }) => isPastDate(date)}
              />
            </div>
          </label>
          <h3>Available Shifts</h3>
          <ul className="shift-list">
            {filteredShifts.map((shift) => (
              <li key={shift.id}>
                {shift.date} - {shift.shiftType}
                <button onClick={() => handleRequest(shift.id)}>Request</button>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    export default EmployeeView;
