using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> ListActivities(string username, string predicate)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query
            {
                Username = username,
                Predicate = predicate
            }));
        }

        /// <summary>
        /// we can send a CQRS command directly to endpoints
        /// the asp net binding mechanism will map the request data
        /// to backend types.
        /// </summary>
        /// <param name="command">Partial profile information</param>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> EditProfile(Edit.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
    }
}