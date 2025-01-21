/*
 * Data Transfer Object Login 
 * its goal is to send the backend the fields required for a login 
 */
 
namespace API.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}