import styles from "../CalendarStyling/EventCard.module.css";
import type { EventCardProps } from "../../interfaces/CalendarTypes";

const EventCard: React.FC<EventCardProps> = ({name, startTime, endTime, onClick, style}) => {

    return (
        <div className={styles.cardBody} style={style} onClick={onClick}>
            <h3>{name}</h3>
            <p>{startTime}-{endTime}</p>
        </div>
    )
}

export default EventCard;