namespace MyBackend.interfaces;

public interface ICalendarRepository
{
    public Task<int> CreateCalendar(Calendar calendar);
    public Task<List<Calendar>> GetAllCalendarsInbetweenDates(int userid, DateTime startdate, DateTime enddate);
    public Task RemoveCalendar(int calendarId, int userId);
    public Task<Calendar?> GetCalendarEventById(int calendarId);
    public Task<bool> IsTimeSlotOccupied(int userId, DateTime date, DateTime start, DateTime end);
    public Task EditCalendar(Calendar updatedEvent);
}