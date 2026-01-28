using Microsoft.AspNetCore.Mvc;

namespace MyBackend.Controllers
{
    [ApiController]
    [Route("calendar")]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarService _service;
        public CalendarController(ICalendarService service)
        {
            _service = service;
        }

        /// <summary>
        /// Retreives a calendar event based on id.
        /// </summary>
        /// <param name="id">Id for the event</param>
        /// <param name="userId">The user id gets sent from the frontend</param>
        /// <returns>The found event</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCalendarById(int id, [FromQuery]int userId)
        {
            try
            {
                var calendar = await _service.GetCalendarById(id, userId);
                return Ok(calendar);
            }
            catch (ArgumentException error)
            {
                return BadRequest(error.Message);
            }
            catch (KeyNotFoundException error)
            {
                return NotFound(error.Message);
            }
            catch (UnauthorizedAccessException error)
            {
                return StatusCode(403, error.Message);
            }
            catch (Exception error)
            {
                return StatusCode(500, "An unexpected error occured:" + error.Message);
            }
        }

        /// <summary>
        /// Gets all calendar events for a single week. Used by frontend calendar
        /// </summary>
        /// <param name="start">Start of the week</param>
        /// <param name="end">End of the week</param>
        /// <param name="userId">events for user with this id</param>
        /// <returns>Returns a list of calendarevents.</returns>
        [HttpGet]
        public async Task<IActionResult> GetCalendarByWeek(int userId, DateTime start, DateTime end)
        {
            try
            {
                var events = await _service.GetEventsForTheWeekAsync(userId, start, end);
                return Ok(events);
            }
            catch (ArgumentException error)
            {
                return BadRequest(error.Message);
            }
            catch (Exception error)
            {
                return StatusCode(500, "An unexpected error occured:" + error.Message);
            }
        }
        
        /// <summary>
        /// Retreives a new calendar event from the frontend and saves it in the database.
        /// </summary>
        /// <param name="newCalendar">the event that needs to be saved</param>
        /// <param name="userId">the user it belongs to</param>
        /// <returns>The created calendar event</returns>
        [HttpPost]
        public async Task<IActionResult> SaveNewCalendarAppointment([FromQuery]int userId, [FromBody]CalendarDTO newCalendar)
        {
            if(newCalendar == null)
            {
                return BadRequest("Event data is required");
            }

            try
            {
                var createdCalendar = await _service.InsertNewCalendarEvent(newCalendar, userId);
                return CreatedAtAction(nameof(GetCalendarById), new { id = createdCalendar.Id, userId }, createdCalendar);
            }
            catch (ArgumentException error)
            {
                return BadRequest(error.Message);
            }
            catch (InvalidOperationException error)
            {
                return Conflict(error.Message);
            }
            catch (Exception error)
            {
                return StatusCode(500, "Failed to save the new event:" + error.Message);
            }
        }

         /// <summary>
        /// Delete an exisiting calendar event.
        /// </summary>
        /// <param name="id">id of the calendar to be deleted</param>
        /// <param name="userId">the user it belongs to</param>
        /// <returns>nothing</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCalendarAppointment(int id, [FromQuery]int userId)
        {
            try
            {
                await _service.DeleteCalendarAppointment(id, userId);
                return NoContent();
            }
            catch (ArgumentException error)
            {
                return BadRequest(error.Message);
            }
            catch (KeyNotFoundException error)
            {
                return NotFound(error.Message);
            }
            catch (Exception error)
            {
                return StatusCode(500, "Something went wrong while deleting the appointment:" + error.Message);
            }
        }

        /// <summary>
        /// Edit an exisiting calendar event.
        /// </summary>
        /// <param name="id">Identifier for the event</param>
        /// <param name="updatedCalendar">new data for the event</param>
        /// <param name="userId">Identifier for the user that the event belongs to</param>
        /// <returns>The updated calendar event</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> EditCalendarAppointment(int id, [FromBody]CalendarDTO updatedCalendar, [FromQuery] int userId)
        {
            try
            {
                var updatedEvent = await _service.EditCalendarAppointment(id, updatedCalendar, userId);
                return Ok(updatedEvent);
            }
            catch (ArgumentException error)
            {
                return BadRequest(error.Message);
            }
            catch (UnauthorizedAccessException error)
            {
                return StatusCode(403, error.Message);
            }
            catch (KeyNotFoundException error)
            {
                return NotFound(error.Message);
            }
            catch (Exception error)
            {
                return StatusCode(500, "An unexpected error occured:" + error.Message);
            }
        }

        [HttpGet("today")]
        public async Task<IReadOnlyList<Calendar>> GetCalendarCurrentDay()
        {
            return await _service.GetEventsForCurrentDay(1,DateTime.Today,DateTime.Today.AddDays(1).AddTicks(-1));
        }
    }
}