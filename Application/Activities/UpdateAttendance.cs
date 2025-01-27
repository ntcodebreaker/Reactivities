/*
 * Command class to update the list of attendees to an activity
 */
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request,
                CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(u => u.AppUser)
                    .FirstOrDefaultAsync(a => a.Id == request.Id);

                if (activity == null) return null;

                var user = await _context.Users.FirstOrDefaultAsync(
                    u => u.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var hostUserName = activity.Attendees.FirstOrDefault(
                    aa => aa.IsHost)?.AppUser?.UserName;

                var attendee = activity.Attendees.FirstOrDefault(
                    aa => aa.AppUser.UserName == user.UserName);

                // if attendee is host cancel or reactivate the activity
                if (attendee != null && hostUserName == user.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                // if attendee is not host remove him from list of attendees
                if (attendee != null && hostUserName != user.UserName)
                    activity.Attendees.Remove(attendee);

                // otherwise add new attendee to list
                if (attendee == null)
                {
                    attendee = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendee);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result 
                    ? Result<Unit>.Success(Unit.Value) 
                    : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}