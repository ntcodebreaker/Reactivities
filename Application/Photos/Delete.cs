/*
 * Command class to delete a photo.
 */
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor,
                IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;

            }

            public async Task<Result<Unit>> Handle(Command request,
                CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(u => u.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                /*
                * this is not async because all the photos of the user where 
                * loaded in memory using eager loading (include)
                */
                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

                if (photo == null) return null;

                if (photo.IsMain) return Result<Unit>.Failure("You cannot delete your main photo.");

                var result = await _photoAccessor.DeletePhoto(photo.Id);

                if (result == null) return Result<Unit>.Failure("Problem deleting the photo from Cloudinary");

                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}