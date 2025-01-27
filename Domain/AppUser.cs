/*
 * Wrapper class to inherit the most common fields from a user
 * plus additional properties we may need (like display name and bio)
 */

using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        // Used by EF in migrations to configure a 
        // relationship between Activities and Attendees
        public ICollection<ActivityAttendee> Activities { get; set; }
    }
}