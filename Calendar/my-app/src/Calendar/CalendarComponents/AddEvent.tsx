import styles from "../CalendarStyling/AddEvent.module.css";
import { useState } from "react";
import type { CalendarEvent } from "../../interfaces/CalendarTypes";
import Button from "../../components/Button";
import { useEvents } from "../../context/CalendarContext";
import { useNavigate } from "react-router-dom";

const AddEvent: React.FC = () => {
  //Hooks for saving user typed data
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [savedEvent, setSavedEvent] = useState<boolean>(false);

  const { saveEvent: saveEvent} = useEvents();
  const navigate = useNavigate();

  //HOF factory that dynamically updates the sate of all the hooks
  //It takes a setter (one of the hooks)
  //Receives the event
  //Updates the state
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value);
    };
  
  //Creates new event and save to database in api
  const saveData = async () => {
    const newEvent: CalendarEvent = {
      id: 0,
      userId: 1,
      title,
      description,
      location,
      date,
      startTime,
      endTime,
    };
    try {
      await saveEvent(newEvent);
      setSavedEvent(true);
      setTimeout(() => navigate('/calendar'), 1500)
    } catch (error) {
      console.error("Save failed:", error);
    }
  }
  

  return (
    <div
      className={styles.addEventBody} role="dialog" aria-modal="true" aria-label="Add Event Popup">
      {savedEvent ? (
        <h2>Event Saved Successfully!</h2>
      ) : (
        <>
          <h3>Enter Event Details:</h3>
          <label>Title<input className={styles.field} type="text" placeholder="Event Title" value={title} onChange={handleChange(setTitle)}/></label>
          <label>Description<textarea className={styles.field} placeholder="Event Description" value={description} onChange={handleChange(setDescription)} rows={5}/></label>
          <label>Location<input className={styles.field} type="text" placeholder="Event Location" value={location} onChange={handleChange(setLocation)}/></label>
          <label>Date<input className={styles.field} type="date" value={date} onChange={handleChange(setDate)}/></label>
          <label>Start Time<input className={styles.field} type="time" value={startTime} onChange={handleChange(setStartTime)}/></label>
          <label>End Time<input className={styles.field}type="time" value={endTime} onChange={handleChange(setEndTime)}/></label>
          <Button label="Save Event" variant="normal" onClick={saveData} />
        </>
      )}
    </div>
  );
};

export default AddEvent;