// FILE: src/components/Calendar.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Calendar = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="container mt-5">
      <h1>Calendrier</h1>
      <DatePicker
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        className="form-control"
        dateFormat="dd/MM/yyyy"
      />
    </div>
  );
};

export default Calendar;