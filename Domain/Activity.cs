namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public bool IsCancelled { get; set; }

        // Used by EF in migrations to configure a 
        // relationship many-to-many between Activity and AppUser
        public ICollection<ActivityAttendee> Attendees { get; set; }
            = new List<ActivityAttendee>();

        public ICollection<Comment> Comments { get; set; }
            = new List<Comment>();
    }
}