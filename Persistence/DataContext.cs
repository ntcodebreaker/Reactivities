/*
 * Context derived from IdentityDbContext so we can integrate ASP NET Core Identity
 * with Entity Framework enabling the management of user authentication and 
 * authorization data in the database (along with the previous dbsets like Activity).
 */
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // configure primary key of join table
            builder.Entity<ActivityAttendee>(x =>
                x.HasKey(aa => new { aa.AppUserId, aa.ActivityId }));

            // configure the many-to-many relationship
            builder.Entity<ActivityAttendee>()
                .HasOne(aa => aa.AppUser)
                .WithMany(aa => aa.Activities)
                .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<ActivityAttendee>()
                .HasOne(aa => aa.Activity)
                .WithMany(aa => aa.Attendees)
                .HasForeignKey(aa => aa.ActivityId);
        }
    }
}