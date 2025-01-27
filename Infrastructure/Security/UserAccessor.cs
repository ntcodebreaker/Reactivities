/*
 * Implementation of IUserAccessor to get user name 
 * from http context. Interface defined and used in Application layer
 * according to dependency inversion principle.
 */
using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetUsername()
        {
            return _httpContextAccessor
                .HttpContext
                .User
                .FindFirstValue(ClaimTypes.Name);
        }
    }
}