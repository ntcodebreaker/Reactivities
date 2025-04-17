using Domain;

namespace Application.Profiles
{
    public class Profile
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }

        public bool Following { get; set; } // is the current user following this profile
        public int FollowersCount { get; set; } // count of people following this profile
        public int FollowingCount { get; set; } // count of people this profile follows

        public ICollection<Photo> Photos { get; set; }
    }
}