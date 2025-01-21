/*
 * Data Transfer Object User
 * its goal is to send the front-end the user's field 
 * after a successful login or registration
 */

namespace API.DTOs
{
    public class UserDto
    {
        public string DisplaName { get; set; }
        public string Token { get; set; }
        public string Image { get; set; }
        public string UserName { get; set; }
    }
}