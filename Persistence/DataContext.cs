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
    }
}