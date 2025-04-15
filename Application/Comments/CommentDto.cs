/*
 * Data Transfer Object CommentDto 
 * Add more fields to Comment business object to better represent
 * how a chat comment would look like
 */

namespace Application.Comments
{
    public class CommentDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Body { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
    }
}