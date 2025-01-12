import React, { useState } from 'react';
    import ManagerView from './components/ManagerView';
    import EmployeeView from './components/EmployeeView';

    function App() {
      const [shifts, setShifts] = useState([]);
      const [requests, setRequests] = useState([]);

      const addShift = (shift) => {
        const newShifts = [];
        for (let i = 0; i < shift.employees; i++) {
          newShifts.push({
            ...shift,
            id: Date.now() + i,
            status: 'open',
          });
        }
        setShifts([...shifts, ...newShifts]);
      };

      const requestShift = (shiftId, employeeName) => {
        const shift = shifts.find((s) => s.id === shiftId);
        if (shift && shift.status === 'open') {
          setRequests([
            ...requests,
            { shiftId, employeeName, status: 'pending' },
          ]);
          setShifts(
            shifts.map((s) =>
              s.id === shiftId ? { ...s, status: 'requested' } : s,
            ),
          );
        }
      };

      const approveRequest = (shiftId, employeeName) => {
        setRequests(
          requests.map((req) =>
            req.shiftId === shiftId && req.employeeName === employeeName
              ? { ...req, status: 'approved' }
              : req,
          ),
        );
        setShifts(
          shifts.map((s) =>
            s.id === shiftId ? { ...s, status: 'approved' } : s,
          ),
        );
      };

      const rejectRequest = (shiftId, employeeName) => {
        setRequests(
          requests.map((req) =>
            req.shiftId === shiftId && req.employeeName === employeeName
              ? { ...req, status: 'rejected' }
              : req,
          ),
        );
        setShifts(
          shifts.map((s) =>
            s.id === shiftId ? { ...s, status: 'open' } : s,
          ),
        );
      };

      return (
        <div>
          <h1>Restaurant Shift Management</h1>
          <ManagerView
            shifts={shifts}
            addShift={addShift}
            requests={requests}
            approveRequest={approveRequest}
            rejectRequest={rejectRequest}
          />
          <EmployeeView shifts={shifts} requestShift={requestShift} />
        </div>
      );
    }

    export default App;
