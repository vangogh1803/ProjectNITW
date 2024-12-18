import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/', { withCredentials: true });
        console.log('Fetched events:', response.data); // Log all events
        
        // Extract event names (summaries) from the fetched data
        const eventNames = response.data.map(event => event.summary);
        
        console.log('Event Names:', eventNames); // Log only the event names
        
        // Map the events to the format required by the Calendar
        const formattedEvents = response.data.map(event => ({
          title: event.summary,
          start: event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date),
          end: event.end.dateTime ? new Date(event.end.dateTime) : new Date(event.end.date),
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error.response ? error.response.data : error.message);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Your Events</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
      />
    </div>
  );
};

export default MyCalendar;

