public interface ICalendarService
{
    public Task<IReadOnlyList<Calendar>> GetEventsForTheWeekAsync(int userId, DateTime start, DateTime end);
    public Task<Calendar> InsertNewCalendarEvent(CalendarDTO newCalendar, int userId);
    public Task<IReadOnlyList<Calendar>> GetEventsForCurrentDay(int userId, DateTime start, DateTime end);
    public Task DeleteCalendarAppointment(int calendarId, int userId);
    public Task<Calendar> EditCalendarAppointment(int id, CalendarDTO updatedCalendar, int userId);
    public Task<Calendar> GetCalendarById(int id, int userId);
}