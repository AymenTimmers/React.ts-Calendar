import type { EditingEventProps } from "../../interfaces/CalendarTypes";
import styles from "../CalendarStyling/EditingEvent.module.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const EditingEvent: React.FC<EditingEventProps> = ({event, setIsEditing, updateEvent}) => {

    const [tempEvent, setTempEvent] = useState(event);
    const navigate = useNavigate();

    // Update tempEvent whenever the original event changes (e.g., after initial fetch)
    useEffect(() => {
        setTempEvent(event);
    }, [event]);


    return(
        <div className={styles.editForm}>
            <div className={styles.header}>
                <span className={styles.label}>Edit Title</span>
                <input 
                    className={styles.field}
                    value={tempEvent.title}
                    onChange={(e) => setTempEvent({...tempEvent, title: e.target.value})}
                />
                <span className={styles.label}>Description</span>
                <textarea
                    className={styles.field}
                    value={tempEvent.description}
                    onChange={(e) => setTempEvent({...tempEvent, description: e.target.value})}
                    rows={5}
                />
                <span className={styles.label}>Location</span>
                <input
                    className={styles.field}
                    value={tempEvent.location}
                    onChange={(e) => setTempEvent({...tempEvent, location: e.target.value})}
                />
            </div>

            <div className={styles.dateTime}>
                <div className={styles.infoOrder}>
                    <span className={styles.label}>Date</span>
                    <input
                        className={styles.field}
                        type="date"
                        value={tempEvent.date.split("T")[0]}
                        onChange={(e) => setTempEvent({...tempEvent, date: e.target.value})}
                    />
                    <span className={styles.label}>StartTime</span>
                    <input
                        className={styles.field}
                        type="time"
                        value={tempEvent.startTime?.includes("T") ? tempEvent.startTime.split("T")[1].slice(0, 5) : tempEvent.startTime || ""}
                        onChange={(e) => setTempEvent({...tempEvent, startTime: e.target.value})}
                    />
                    <span className={styles.label}>EndTime</span>
                    <input
                        className={styles.field}
                        type="time"
                        value={tempEvent.endTime?.includes("T") ? tempEvent.endTime.split("T")[1].slice(0, 5) : tempEvent.endTime || ""}
                        onChange={(e) => setTempEvent({...tempEvent, endTime: e.target.value})}
                    />   
                </div>
            </div>

            <div className={styles.actions}>
                <Button label="Save Changes" variant="normal" onClick={async () => {await updateEvent(tempEvent); setIsEditing(false); navigate('/calendar')}} />
                <Button label="Cancel" variant="normal" onClick={() => setIsEditing(false)} />
            </div>
        </div>
    )
}

export default EditingEvent