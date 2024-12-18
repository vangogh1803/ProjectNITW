import React, { useState } from 'react';
import axios from 'axios';
import MyCalendar from './Calender.js'; // Import the Calendar component

const Events = () => {
  const [summary, setSummary] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [events, setEvents] = useState([]); // To store fetched events

  const handleAddEvent = async () => {
    try {
      // Validate inputs
      if (!start || !end) {
        alert('Start and end times are required.');
        return;
      }
  
      // Ensure start and end are valid dates
      const startDate = new Date(start);
      const endDate = new Date(end);
  
      if (isNaN(startDate) || isNaN(endDate)) {
        alert('Invalid date or time format.');
        return;
      }
  
      // Convert to ISO strings (dateTime)
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();
  
      // Construct the event object with dateTime
      const newEvent = {
        summary,
        start: {
          dateTime: startISO,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: endISO,
          timeZone: 'Asia/Kolkata',
        },
      };
  
      // Make POST request to add the event
      const response = await axios.post('http://localhost:5001/api/events', newEvent, {
        withCredentials: true,
        validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
      });
  
      // Handle response
      if (response.status === 500) {
        console.warn('Server returned a 500 status code');
        return;
      }
  
      //console.log('Backend Response:', response.data);
  
      // Optionally fetch updated events
      const updatedEvents = await axios.get('http://localhost:5001/', { withCredentials: true });
      setEvents(updatedEvents.data);
      console.log(updatedEvents);

      // Clear form fields
      setSummary('');
      setStart('');
      setEnd('');
    } catch (error) {
      console.error('Error adding event:', error.response?.data || error.message);
    }

  };

  return (
    <div>
      <h1>Add New Event</h1>
      <input
        type="text"
        placeholder="Event Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <button onClick={handleAddEvent}>Add Event</button>

      <MyCalendar events={events} /> {/* Display the calendar with events */}
    </div>
  );
};

export default Events;


// import React, { useState } from 'react';
// import axios from 'axios';
// import MyCalendar from './Calender.js'; // Import the Calendar component


// const Events = () => {
//   const [summary, setSummary] = useState('');
//   const [start, setStart] = useState('');
//   const [end, setEnd] = useState('');
//   const [events, setEvents] = useState([]); // To store fetched events

//   const handleAddEvent = async () => {
//     try {
     
//       const startDate = new Date(start).toISOString(); // Generates a date-time string
// const endDate = new Date(end).toISOString();

// const newEvent = {
//   summary,
//   start: {
//     dateTime: startDate, // Use ISO string for start date
//     timeZone: 'Asia/Kolkata', // Add consistent timeZone
//   },
//   end: {
//     dateTime: endDate, // Use ISO string for end date
//     timeZone: 'Asia/Kolkata',
//   },
// };
// try {
//   const response = await axios.post('http://localhost:5001/api/events', newEvent, {
//     withCredentials: true,
//     validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
//   });

//   console.log('Backend Response:', response.data);

//   if (response.status === 500) {
//     console.warn('Server returned a 500 status code');
//     return;
//   }
// } catch (error) {
//   console.error('Error adding event:', error.response?.data || error.message);
// }
      
//       const response = await axios.post('http://localhost:5001/api/events', newEvent, { withCredentials: true,
//       validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
//     });
//     console.log(response);
//     if (response.status === 500) {
//       console.warn('Server returned a 500 status code');
//       return; // Exit if there's a server error
//     }

//     console.log('Backend Response:', response.data);
//       //////changed here////
//       // // Optionally, fetch the updated list of events after adding the new one
//       // const response = await axios.get('http://localhost:5001/api/events', { withCredentials: true });
//       // setEvents(response.data); // Update state with new event list

//       // Clear form fields
//       setSummary('');
//       setStart('');
//       setEnd('');
//     } catch (error) {
//       console.error('Error adding event:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Add New Event</h1>
//       <input
//         type="text"
//         placeholder="Event Summary"
//         value={summary}
//         onChange={(e) => setSummary(e.target.value)}
//       />
//       <input
//         type="datetime-local"
//         value={start}
//         onChange={(e) => setStart(e.target.value)}
//       />
//       <input
//         type="datetime-local"
//         value={end}
//         onChange={(e) => setEnd(e.target.value)}
//       />
//       <button onClick={handleAddEvent}>Add Event</button>

//       <MyCalendar events={events} /> {/* Display the calendar with events */}
//     </div>
//   );
// };

// export default Events;

