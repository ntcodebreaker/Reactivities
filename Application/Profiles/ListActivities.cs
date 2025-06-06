using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request,
                CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                    .Where(a => a.AppUser.UserName == request.Username)
                    .OrderBy(a => a.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(uad => uad.Date <= DateTime.Now),
                    "hosting" => query.Where(uad => uad.HostUsername == request.Username),
                    _ => query.Where(uad => uad.Date >= DateTime.Now)
                };

                return Result<List<UserActivityDto>>
                    .Success(await query.ToListAsync());
            }
        }
    }
}