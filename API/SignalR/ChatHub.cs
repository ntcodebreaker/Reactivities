/*
 * A SignalR hub to let server and clients to communicate directly
 * Used to implement the chat feature in the web application.
 */
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            // broadcast new comment to all connected clients
            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        // this code executes when a client connects to the hub
        // every client gets a connection id to be included in a group
        // named after the activity guid
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];

            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

            var result = await _mediator.Send(new List.Query
            {
                ActivityId = Guid.Parse(activityId)
            });

            // send list of comments to new connected client
            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}