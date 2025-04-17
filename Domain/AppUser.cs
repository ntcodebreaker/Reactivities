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
        // relationship many-to-many between AppUser and Activities
        public ICollection<ActivityAttendee> Activities { get; set; }

        // Used by EF in migrations to configure a 
        // relationship one-to-many between AppUser and Photos
        public ICollection<Photo> Photos { get; set; }

        // Used by EF in migrations to configure a 
        // relationship one-to-many between AppUser and the people he follows
        public ICollection<UserFollowing> Followings { get; set; }

        // Used by EF in migrations to configure a 
        // relationship one-to-many between AppUser and his followers
        public ICollection<UserFollowing> Followers { get; set; }
    }
}