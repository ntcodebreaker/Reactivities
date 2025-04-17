using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseApiController
    {
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow(string username)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command {
                TargetUserName = username }));
        }

        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollowings(string username, string predicate)
        {
            // "predicate" is null unless specified in some other place
            // like the query string
            return HandleResult(await Mediator.Send(new List.Query
            {
                Username = username,
                Predicate = predicate
            }));
        }
    }
}