using Microsoft.AspNetCore.Mvc;
using MyBackend.interfaces;
using MyBackend.Models;

public sealed class CalendarService : ICalendarService
{
    private readonly ICalendarRepository _repository;

    public CalendarService(ICalendarRepository repository)
    {
        _repository = repository;
    }

    public async Task<Calendar> GetCalendarById(int id, int userId)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Invalid calendar ID.");
        }

        var calendar = await _repository.GetCalendarEventById(id);

        if(calendar == null)
        {
            throw new KeyNotFoundException("Calendar event not found");
        }

        if(calendar.UserId != userId)
        {
            throw new UnauthorizedAccessException("You do not have access to this event");
        }

        return calendar;
    }

    public async Task<IReadOnlyList<Calendar>> GetEventsForTheWeekAsync(int userId, DateTime start, DateTime end)
    {
        if(start > end)
        {
            throw new ArgumentException("Start date must be before end date.");
        }

        if((end - start).TotalDays >= 7)
        {
            throw new ArgumentException("Start date and end date must be a week apart");
        }
        var inclusiveEnd = end.Date.AddDays(1).AddTicks(-1);
        return await _repository.GetAllCalendarsInbetweenDates(userId, start, inclusiveEnd);
    }

    public async Task<Calendar> InsertNewCalendarEvent(CalendarDTO newCalendar, int userId)
    {
        Calendar newEvent = new();
        newEvent.Convert(newCalendar);

        if (newEvent.StartTime >= newEvent.EndTime)
        {
            throw new ArgumentException("The start time must be earlier than the end time");
        }

        bool isOccupied = await _repository.IsTimeSlotOccupied(
            userId,
            newEvent.Date,
            newEvent.StartTime,
            newEvent.EndTime
        );

        if(isOccupied)
        {
            throw new InvalidOperationException("This time slot is already taken.");
        }
        newEvent.UserId = userId;
        int generatedId = await _repository.CreateCalendar(newEvent);
        newEvent.Id = generatedId;
        return newEvent;
    }

    public async Task DeleteCalendarAppointment(int calendarId, int userId)
    {
        
        if (calendarId <= 0)
        {
            throw new ArgumentException("Invalid calendar ID.");
        }
        if (userId <= 0)
        {
            throw new ArgumentException("Invalid user ID.");
        }
        
        var calendarToDelete = await _repository.GetCalendarEventById(calendarId);

        if (calendarToDelete == null)
        {
            throw new KeyNotFoundException("Calendar for that id doesnt exist.");
        }
        await _repository.RemoveCalendar(calendarId, userId);
    }

    public async Task<Calendar> EditCalendarAppointment(int id, CalendarDTO updatedCalendar, int userId)
    {
        if(updatedCalendar == null)
        {
            throw new ArgumentException("Updated calendar data is required.");
        }

        Calendar updatedEvent = new();
        updatedEvent.Convert(updatedCalendar);
        updatedEvent.Id = id;

        if (updatedEvent.StartTime >= updatedEvent.EndTime)
        {
            throw new ArgumentException("The start time must be earlier than the end time");
        }

        if (updatedEvent.UserId != userId)
        {
            throw new UnauthorizedAccessException("This event does not belong to the given user");
        }

        var currentEvent = await _repository.GetCalendarEventById(id);

        if (currentEvent == null)
        {
            throw new KeyNotFoundException("Calendar event not found");
        }

        await _repository.EditCalendar(updatedEvent);
        return updatedEvent;
    }

    public async Task<IReadOnlyList<Calendar>> GetEventsForCurrentDay(int userId, DateTime start, DateTime end)
    {
        return await _repository.GetAllCalendarsInbetweenDates(userId, start, end);
    }
}