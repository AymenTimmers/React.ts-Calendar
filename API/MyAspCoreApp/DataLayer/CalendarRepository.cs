using MyBackend.interfaces;

public class CalendarRepository : ICalendarRepository
{
    private readonly IDatabaseService _connection;

    public CalendarRepository(IDatabaseService connection)
    {
        _connection = connection;
    }

    public async Task<int> CreateCalendar(Calendar eventToSave)
    {
        string query = @"INSERT INTO calendar (userid, title, description, location, date, startTime, endTime) 
                        Values (@UserId, @Title, @Description, @Location, @Date, @StartTime, @EndTime);
                        SELECT last_insert_rowid();";

        return await _connection.QuerySingleAsync<int>(query, eventToSave);
    }

    public async Task<List<Calendar>> GetAllCalendarsInbetweenDates(int userid, DateTime startdate, DateTime enddate)
    {
        string query = @"SELECT * FROM calendar WHERE UserId = @userId AND date between @startdate AND @enddate";
        var results = await _connection.QueryListAsync<Calendar>(query, new { userId = userid, startdate, enddate });
        return results.ToList();
    }
    
    public async Task RemoveCalendar(int calendarId, int userId)
    {
        string query = @"DELETE FROM calendar WHERE id = @calendarID AND userId = @userID";
        await _connection.ExecuteAsync(query, new { calendarID = calendarId, userID = userId });
    }

    public async Task EditCalendar(Calendar updatedEvent)
    {
        string query = @"
            UPDATE calendar 
            SET
                title = @Title,
                description = @Description,
                location = @Location,
                date = @Date,
                startTime = @StartTime,
                endTime = @EndTime
            WHERE Id = @Id AND UserId = @UserId";
        await _connection.ExecuteAsync(query, updatedEvent);
    }

    public async Task<Calendar?> GetCalendarEventById(int calendarId)
    {
        string query = @"
        SELECT 
            id,
            userId AS UserId,
            title AS Title,
            description AS Description,
            location AS Location,
            date AS Date,
            startTime AS StartTime,
            endTime AS EndTime
        FROM calendar
        WHERE id = @calendarId";
        return await _connection.QueryFirstOrDefaultAsync<Calendar>(query, new {calendarId});
    }

    public async Task<bool> IsTimeSlotOccupied(int userId, DateTime date, DateTime start, DateTime end)
    {
        //Check for any event that overlaps the proposed Start/End window
        string query = @"
            SELECT COUNT(1) 
            FROM calendar 
            WHERE userid = @userId 
            AND date = @date
            AND startTime < @endTime 
            AND endTime > @startTime";

        int count = await _connection.QuerySingleAsync<int>(query, new { userId, date, startTime = start, endTime = end });
        return count > 0;
    }
}