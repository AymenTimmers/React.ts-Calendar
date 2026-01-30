import styles from "../CalendarStyling/EventCardDetails.module.css"
import Button from "../../components/Button";
import { useEvents } from "../../context/CalendarContext"
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import EditingEvent from "./EditingEvent"

const EventCardDetails: React.FC = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate();
    const { getEventById, updateEvent, deleteEvent } = useEvents();

    //Get data based on url/id
    const event = getEventById(Number(id));
    if (!event) {
        return (
            <div className={styles.main}>
                <p>Event not found.</p>
                <button onClick={() => navigate('/calendar')}>Back to Calendar</button>
            </div>
        );
    }

    return (
        <div className={styles.mainContainer}>
            <Button label="← Back to Calendar" onClick={() => navigate('/calendar')} variant="normal"/>
            {isEditing ? (
                <EditingEvent event={event} setIsEditing={setIsEditing} updateEvent={updateEvent} />
            ) : isDeleting ? (
                <div>
                    <p>Are you sure you want to delete this event?</p>

                    <div className={styles.actions}>
                        <Button
                        label="Confirm Delete"
                        variant="normal"
                        onClick={async () => {await deleteEvent(event.id); setIsDeleting(false); navigate('/calendar')}}
                        />

                        <Button
                        label="Cancel"
                        variant="normal"
                        onClick={() => setIsDeleting(false)}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.header}>
                        <span className={styles.label}>Event Title</span>
                        <h1 className={styles.title}>{event.title}</h1>
                    </div>

                    <div className={styles.dateTime}>
                        <div className={styles.infoOrder}>
                            <span className={styles.label}>Date</span>
                            <span className={styles.value}>{event.date.split("T")[0]}</span>
                        </div>
                        <div className={styles.infoOrder}>
                            <span className={styles.label}>Time</span>
                            <span className={styles.value}>{event.startTime.split("T")[1].slice(0, 5)}-{event.endTime.split("T")[1].slice(0, 5)}</span>
                        </div>
                    </div>

                    <div className={styles.infoOrder}>
                        <span className={styles.label}>Location</span>
                        <span className={styles.value}>{event.location}</span>
                    </div>

                    <div className={styles.infoOrder}>
                        <span className={styles.label}>Description</span>
                        <div className={styles.descriptionContainer}>
                            {event.description}
                        </div>
                    </div>
                    <Button label="Edit" variant="normal" onClick={() => setIsEditing(true)}/>
                    <Button label="Delete" variant="normal" onClick={() => setIsDeleting(true)}/> 
                </>
            )}
        </div>
    );
};

export default EventCardDetails;