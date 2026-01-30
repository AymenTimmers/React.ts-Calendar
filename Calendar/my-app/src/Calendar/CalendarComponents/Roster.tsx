import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/CalendarContext'; 
import type { WeekDay } from '../../interfaces/CalendarTypes';
import EventCard from "./EventCard";
import { getEventPosition} from "../CalendarHelper";
import styles from "../CalendarStyling/Roster.module.css";

const Roster: React.FC = () => {

    //Get the 'days' array from the Calendar's <Outlet />
    const { days } = useOutletContext<{ days: WeekDay[] }>();
    
    //Get the events and loading state from Context
    const { events, loading } = useEvents();
    
    //Navigation for viewing details
    const navigate = useNavigate();

    //Basic variables that make up the calendar
    const startHour = 8;
    const endHour = 20;
    const timeSlots = [];
    for (let h = startHour; h < endHour; h++) {
        timeSlots.push(`${h}:00`, `${h}:30`);
    }

    // Filter events for a specific day
    const eventsForDay = (dayDate: Date) =>
        events?.filter(event => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getFullYear() === dayDate.getFullYear() &&
                eventDate.getMonth() === dayDate.getMonth() &&
                eventDate.getDate() === dayDate.getDate()
            );
        }) || [];

    // combine days with events
    const daysWithEvents = days.map(day => ({
        day,
        events: eventsForDay(day.date)
    }));

    if (loading) return <div className={styles.loading}>Updating Roster...</div>;

    return (
        <div className={styles.calendarContainer}>
            {/* TIME COLUMN */}
            <div className={styles.timeColumn}>
                <div className={styles.headerSpacer} />
                {timeSlots.map(time => (
                    <h2 key={time}>{time}</h2>
                ))}
            </div>

            {/* DAY COLUMNS */}
            {daysWithEvents.map(({ day, events }) => (
                <div key={day.Id} className={styles.dayColumn}>
                    <h2>{day.date.toDateString().split(" ").slice(0, 3).join(" ")}</h2>
                    <div className={styles.dayBody}>
                        {events.map(event => {
                            // Formatting time strings safely
                            const startTimeStr = event.startTime.includes("T") ? event.startTime.split("T")[1].slice(0, 5) : event.startTime;
                            const endTimeStr = event.endTime.includes("T") ? event.endTime.split("T")[1].slice(0, 5) : event.endTime;
                            
                            const { top, height } = getEventPosition(startTimeStr, endTimeStr, startHour, endHour);
                            
                            return (
                                <EventCard
                                    key={event.id} 
                                    weekDayid={day.Id} 
                                    name={event.title} 
                                    location={event.location} 
                                    date={event.date.split("T")[0]} 
                                    startTime={startTimeStr} 
                                    endTime={endTimeStr}
                                    description={event.description} 
                                    style={{ top: top, height: height }}
                                    // Navigate to the unique URL for this event
                                    onClick={() => navigate(`/calendar/event/${event.id}`)}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Roster;