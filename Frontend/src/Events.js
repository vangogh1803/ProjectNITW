// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import MyCalendar from './Calender.js'; // Import the Calendar component
// import './css/Events.css';

// const Events = () => {
//   const [summary, setSummary] = useState('');
//   const [start, setStart] = useState('');
//   const [end, setEnd] = useState('');
//   const [events, setEvents] = useState([]); // To store fetched events

//   useEffect(() => {
//     document.body.className = 'events-page';
//     return () => {
//       document.body.className = '';
//     };
//   }, []);

//   const handleAddEvent = async () => {
//     try {
//       // Validate inputs
//       if (!start || !end) {
//         alert('Start and end times are required.');
//         return;
//       }

//       // Ensure start and end are valid dates
//       const startDate = new Date(start);
//       const endDate = new Date(end);

//       if (isNaN(startDate) || isNaN(endDate)) {
//         alert('Invalid date or time format.');
//         return;
//       }

//       // Convert to ISO strings (dateTime)
//       const startISO = startDate.toISOString();
//       const endISO = endDate.toISOString();

//       // Construct the event object with dateTime
//       const newEvent = {
//         summary,
//         start: {
//           dateTime: startISO,
//           timeZone: 'Asia/Kolkata',
//         },
//         end: {
//           dateTime: endISO,
//           timeZone: 'Asia/Kolkata',
//         },
//       };

//       // Make POST request to add the event
//       const response = await axios.post('http://localhost:5001/api/events', newEvent, {
//         withCredentials: true,
//         validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
//       });

//       // Handle response
//       if (response.status === 500) {
//         console.warn('Server returned a 500 status code');
//         return;
//       }

//       // Optionally fetch updated events
//       const updatedEvents = await axios.get('http://localhost:5001/', { withCredentials: true });
//       setEvents(updatedEvents.data);

//       // Clear form fields
//       setSummary('');
//       setStart('');
//       setEnd('');
//     } catch (error) {
//       console.error('Error adding event:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="events-page">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2>Navigation</h2>
//         <a href="/UserPage">User Page</a>
//         <a href="/events">Events</a>
//       </div>
//       <div className="main-content">
//         <h1>Add New Event</h1>
//         <input
//           type="text"
//           placeholder="Event Summary"
//           value={summary}
//           onChange={(e) => setSummary(e.target.value)}
//         />
//         <input
//           type="datetime-local"
//           value={start}
//           onChange={(e) => setStart(e.target.value)}
//         />
//         <input
//           type="datetime-local"
//           value={end}
//           onChange={(e) => setEnd(e.target.value)}
//         />
//         <button type="button" onClick={handleAddEvent}>
//           Add Event
//         </button>

//         <div className="calendar-container">
//           <MyCalendar className="calendar-section" events={events} />
//         </div>

//         {/* Link to Google Calendar */}
//         <div className="google-calendar-link">
//           <a
//             href="https://www.google.com/calendar"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="google-calendar-button"
//           >
//             Go to Google Calendar
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Events;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyCalendar from './Calender.js'; // Import the Calendar component
import UpcomingEvents from './UpcomingEvents'; // Import UpcomingEvents component
import './css/Events.css';

const Events = () => {
  const [summary, setSummary] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [events, setEvents] = useState([]); // To store fetched events

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/', { withCredentials: true });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error.response?.data || error.message);
      }
    };

    fetchEvents(); // Fetch events when the component loads
    document.body.className = 'events-page';

    return () => {
      document.body.className = '';
    };
  }, []); // Empty dependency array ensures this runs only on mount

  const handleAddEvent = async () => {
    try {
      if (!start || !end) {
        alert('Start and end times are required.');
        return;
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate) || isNaN(endDate)) {
        alert('Invalid date or time format.');
        return;
      }

      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

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

      const response = await axios.post('http://localhost:5001/api/events', newEvent, {
        withCredentials: true,
        validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
      });

      if (response.status === 500) {
        console.warn('Server returned a 500 status code');
        return;
      }

      // Fetch updated events after adding a new one
      const updatedEvents = await axios.get('http://localhost:5001/', { withCredentials: true });
      setEvents(updatedEvents.data);

      setSummary('');
      setStart('');
      setEnd('');
    } catch (error) {
      console.error('Error adding event:', error.response?.data || error.message);
    }
  };

  

  return (
    <div className="events-page">

      <div className='sidebar'>
        <h2>Welcome!</h2>
        <a href="/UserPage">My Profile</a>
      </div>

      <div className="main-content">
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
        <button type="button" onClick={handleAddEvent}>
          Add Event
        </button>

        <div className="calendar-container">
          <MyCalendar className="calendar-section" events={events} />
        </div>

        <div className="google-calendar-link">
          <a
            href="https://www.google.com/calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="google-calendar-button"
          >
            Go to Google Calendar
          </a>
        </div>
      </div>

      {/* Upcoming Events Box */}
      <div className="upcoming-events-container">
        <UpcomingEvents events={events} />
      </div>
    </div>
  );
};

export default Events;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import MyCalendar from './Calender.js'; // Import the Calendar component
// import UpcomingEvents from './UpcomingEvents'; // Import UpcomingEvents component
// import './css/Events.css';

// const Events = () => {
//   const [summary, setSummary] = useState('');
//   const [start, setStart] = useState('');
//   const [end, setEnd] = useState('');
//   const [events, setEvents] = useState([]); // To store fetched events
//   const [sidebarOpen, setSidebarOpen] = useState(false); // State to toggle sidebar

//   useEffect(() => {
//     document.body.className = 'events-page';
//     return () => {
//       document.body.className = '';
//     };
//   }, []);

//   const handleAddEvent = async () => {
//     try {
//       if (!start || !end) {
//         alert('Start and end times are required.');
//         return;
//       }

//       const startDate = new Date(start);
//       const endDate = new Date(end);

//       if (isNaN(startDate) || isNaN(endDate)) {
//         alert('Invalid date or time format.');
//         return;
//       }

//       const startISO = startDate.toISOString();
//       const endISO = endDate.toISOString();

//       const newEvent = {
//         summary,
//         start: {
//           dateTime: startISO,
//           timeZone: 'Asia/Kolkata',
//         },
//         end: {
//           dateTime: endISO,
//           timeZone: 'Asia/Kolkata',
//         },
//       };

//       const response = await axios.post('http://localhost:5001/api/events', newEvent, {
//         withCredentials: true,
//         validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
//       });

//       if (response.status === 500) {
//         console.warn('Server returned a 500 status code');
//         return;
//       }

//       const updatedEvents = await axios.get('http://localhost:5001/', { withCredentials: true });
//       setEvents(updatedEvents.data);

//       setSummary('');
//       setStart('');
//       setEnd('');
//     } catch (error) {
//       console.error('Error adding event:', error.response?.data || error.message);
//     }
//   };


//   return (
//     <div className="events-page">
//       <div className = 'sidebar'>
//         <h2>Navigation</h2>
//         <a href="/UserPage">User Page</a>
//         <a href="/events">Events</a>
//       </div>

//       <div className="main-content">
//         <h1>Add New Event</h1>
//         <input
//           type="text"
//           placeholder="Event Summary"
//           value={summary}
//           onChange={(e) => setSummary(e.target.value)}
//         />
//         <input
//           type="datetime-local"
//           value={start}
//           onChange={(e) => setStart(e.target.value)}
//         />
//         <input
//           type="datetime-local"
//           value={end}
//           onChange={(e) => setEnd(e.target.value)}
//         />
//         <button type="button" onClick={handleAddEvent}>
//           Add Event
//         </button>

//         <div className="calendar-container">
//           <MyCalendar className="calendar-section" events={events} />
//         </div>

//         <div className="google-calendar-link">
//           <a
//             href="https://www.google.com/calendar"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="google-calendar-button"
//           >
//             Go to Google Calendar
//           </a>
//         </div>
//       </div>

//       {/* Upcoming Events Box */}
//       <div className="upcoming-events-container">
//         <UpcomingEvents events={events} />
//       </div>
//     </div>
//   );
// };

// export default Events;



// import React, { useState } from 'react';
// import axios from 'axios';
// import MyCalendar from './Calender.js'; //Import the Calendar component
// import './css/Events.css';
// import {useEffect} from 'react';
// const Events = () => {
//   const [summary, setSummary] = useState('');
//   const [start, setStart] = useState('');
//   const [end, setEnd] = useState('');
//   const [events, setEvents] = useState([]); // To store fetched events

//   useEffect(() => {
//     document.body.className = 'events-page';
//     return () => {
//       document.body.className = '';
//     };
//   }, []);
//   const handleAddEvent = async () => {
//     try {
//       // Validate inputs
//       if (!start || !end) {
//         alert('Start and end times are required.');
//         return;
//       }
  
//       // Ensure start and end are valid dates
//       const startDate = new Date(start);
//       const endDate = new Date(end);
  
//       if (isNaN(startDate) || isNaN(endDate)) {
//         alert('Invalid date or time format.');
//         return;
//       }
  
//       // Convert to ISO strings (dateTime)
//       const startISO = startDate.toISOString();
//       const endISO = endDate.toISOString();
  
//       // Construct the event object with dateTime
//       const newEvent = {
//         summary,
//         start: {
//           dateTime: startISO,
//           timeZone: 'Asia/Kolkata',
//         },
//         end: {
//           dateTime: endISO,
//           timeZone: 'Asia/Kolkata',
//         },
//       };
  
//       // Make POST request to add the event
//       const response = await axios.post('http://localhost:5001/api/events', newEvent, {
//         withCredentials: true,
//         validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
//       });
  
//       // Handle response
//       if (response.status === 500) {
//         console.warn('Server returned a 500 status code');
//         return;
//       }
  
//       //console.log('Backend Response:', response.data);
  
//       // Optionally fetch updated events
//       const updatedEvents = await axios.get('http://localhost:5001/', { withCredentials: true });
//       setEvents(updatedEvents.data);
//       console.log(updatedEvents);

//       // Clear form fields
//       setSummary('');
//       setStart('');
//       setEnd('');
//     } catch (error) {
//       console.error('Error adding event:', error.response?.data || error.message);
//     }

//   };

//   return (
//     <div className="events-page">
//     {/* Sidebar */}
//     <div className="sidebar">
//       <h2>Navigation</h2>
//       <a href="/UserPage">User Page</a>
//       <a href="/events">Events</a>
//     </div>
//     <div className='main-content'>
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
//       <button type="button" onClick={handleAddEvent}>Add Event</button>
//     <div className='calendar-container'>
//       <MyCalendar className='calendar-section'events={events} /> 
      
//     </div>
//     </div>
//     </div>
//    );
// };

// export default Events;


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

