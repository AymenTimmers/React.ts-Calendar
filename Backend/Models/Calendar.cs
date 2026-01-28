public class Calendar
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ?Title { get; set; }
    public string ?Description { get; set; }
    public string ?Location { get; set; }
    public DateTime Date { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public void Convert(CalendarDTO dto)
    {
        this.Id = dto.Id;
        this.UserId = dto.UserId;
        this.Title = dto.Title ?? "Untitled Event";
        this.Description = dto.Description;
        this.Location = dto.Location;

        if (DateTime.TryParse(dto.Date, out DateTime parsedDate))
        {
            this.Date = parsedDate;
        }
        if (DateTime.TryParse(dto.StartTime, out DateTime sTime))
        {
            this.StartTime = this.Date.Date.Add(sTime.TimeOfDay);
        }
        if (DateTime.TryParse(dto.EndTime, out DateTime eTime))
        {
            this.EndTime = this.Date.Date.Add(eTime.TimeOfDay);
        }
    }
}