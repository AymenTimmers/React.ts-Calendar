import { useAuth } from "../../context/AuthContext"
import styles from "../CalendarStyling/ProfileBar.module.css"
import profilepic from "../../assets/ProfilePicturePlaceholder.jpg"
import Button from "../../components/Button"
import type { ProfileBarProps } from "../../../interfaces/CalendarTypes"
import { useRef } from "react"

function ProfileBar({yearNumber, monthNumber, weekNumber, handlePreviousWeek, handleNextWeek, openAddEvent, closeAddEvent, isAddingEvent, onDateSelect}: ProfileBarProps) 
{
    //Fetch the username for the profile bar
    const auth = useAuth()
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleLabelClick = () => {
        if (dateInputRef.current) {
            try {
                dateInputRef.current.showPicker();
            } catch (error) {
                // Fallback for older browsers
                dateInputRef.current.focus();
            }
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            const selectedDate = new Date(e.target.value);
            onDateSelect(selectedDate);
        }
    }

    return(
        <div className={styles.profilebar}>
            <div className={styles.profiledetails}>
                <img src={profilepic} alt={`${auth.user?.name}'s profile picture`} className={styles.profileimg} />
                <p className={styles.usertext}>{auth.user?.name}</p>
            </div>
            <div className={styles.datePickerContainer}>
                <Button label="<" variant="normal" onClick={ () => handlePreviousWeek()} aria-label="Select previous week"/>
                <label htmlFor="calendar-jump" className={`${styles.dateText}`} onClick={handleLabelClick}>
                    {yearNumber}-{monthNumber}-{weekNumber}
                    <span className={styles.calendarIcon}>📅</span>
                </label>

                <input id="calendar-jump" type="date" ref={dateInputRef} className={styles.hiddenDateInput} onChange={handleDateChange}/>
                <Button label=">" variant="normal" onClick={ () => handleNextWeek()} aria-label="Select next week"/>

            </div>
            <Button label={isAddingEvent ? "Back To Calendar" : "Add Event"} variant="normal" onClick={isAddingEvent ? closeAddEvent : openAddEvent}/>
        </div>
    )
}

export default ProfileBar