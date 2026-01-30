import { useEffect } from "react"
import { DateHelper } from "./DateHelper"
import { useCalendar } from "./CalendarHelper"
import styles from "./CalendarStyling/Calendar.module.css"
import type { WeekDay } from "../interfaces/CalendarTypes"
import ProfileBar from "./CalendarComponents/ProfileBar"
import { useLocation, useNavigate, Outlet } from "react-router-dom"
import { useEvents } from "../context/CalendarContext"

const Calendar: React.FC = () => {

    const navigate = useNavigate();
    const location = useLocation();

    //GET GLOBAL EVENTS FROM CONTEXT
    const { refreshEvents, loading, error } = useEvents();

    //GET DATE NAVIGATION LOGIC
    const { week, month, year, changeWeek, jumpToDate } = useCalendar();

    //RE-FETCH WHENEVER THERE ARE CHANGES
    useEffect(() => {
        refreshEvents(week, year);
    }, [week, year]);

    const isAddingEvent = location.pathname === "/calendar/addevent";

    const handleAddEventToggle = () => {
        if (isAddingEvent) {
            navigate('/calendar');
        } else {
            navigate('/calendar/addevent');
        }
    };


    const datesWeek = DateHelper.getDaysOfWeek(week, year);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const addDaysIndex: WeekDay[] = days.map((day, index) => ({
        Id: index + 1,
        Name: day,
        date: datesWeek[index]
    }));

    const handleJumpToDate = (selectedDate: Date) => {
        jumpToDate(selectedDate);
    };

    if (error) return <p>{error}</p>;

    return (
        <div className={styles.pagecontainer}>
            <ProfileBar 
                yearNumber={year} 
                monthNumber={month} 
                weekNumber={week} 
                handlePreviousWeek={() => changeWeek(-1)} 
                handleNextWeek={() => changeWeek(+1)}
                openAddEvent={handleAddEventToggle}
                closeAddEvent={() => navigate('/calendar')}
                isAddingEvent={isAddingEvent}
                onDateSelect={handleJumpToDate}/>

            <main>
                {loading && <p>Loading events...</p>}
                <Outlet context={{ days: addDaysIndex }} />
            </main>
       </div>
    )
}

export default Calendar