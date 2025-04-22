/*
 * Query class to get the list of paginated activities
 */
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        {
            public ActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                /*
                 * sending back to client the activities with their related data
                 * using Include and ThenInclude produce circular references since 
                 * AppUser contains a list of ActivityAttendee and ActivityAttendee 
                 * contains an AppUser.
                 * To fix that problem use a projection to a Dto object instead
                 * This method is included as part of automapper package.
                 */
                var query = _context.Activities
                    .Where(a => a.Date >= request.Params.StartDate)
                    .OrderBy(a => a.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                        new { currentUserName = _userAccessor.GetUsername() })
                    .AsQueryable();

                // keep just the activities the current user is going.
                if (request.Params.IsGoing && !request.Params.IsHost)
                {
                    query = query.Where(x => x.Attendees.Any(a =>
                        a.UserName == _userAccessor.GetUsername()));
                }

                // keep just the activities hosted by the current user.
                if (request.Params.IsHost && !request.Params.IsGoing)
                {
                    query = query.Where(x => x.HostUserName == _userAccessor.GetUsername());
                }

                return Result<PagedList<ActivityDto>>.Success(
                    await PagedList<ActivityDto>.CreateAsync(query,
                        request.Params.PageNumber,
                        request.Params.PageSize)
                );
            }
        }
    }
}