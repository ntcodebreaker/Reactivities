/*
 * Data Transfer Object ActivityDto 
 * Add more fields to Activity business object to better represent
 * who the host is in a given activity
 */

using Application.Profiles;

namespace Application.Activities
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public bool IsCancelled { get; set; }

        public string HostUserName { get; set; }
        public ICollection<AttendeeDto> Attendees { get; set; }
    }
}