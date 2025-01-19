import React from 'react';

const UpcomingEvents = ({ events }) => {
  // Get today's date
  const today = new Date();

  // Filter events that are after today
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.start.dateTime);
    return eventDate > today;
  });

  return (
    <div className="upcoming-events-box">
      <h3>Upcoming Events</h3>
      {upcomingEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <ul>
          {upcomingEvents.map((event, index) => (
            <li key={index}>
              <strong>{event.summary}</strong>
              <br />
              {new Date(event.start.dateTime).toLocaleString()} -{' '}
              {new Date(event.end.dateTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpcomingEvents;
