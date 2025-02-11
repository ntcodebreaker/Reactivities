/*
 * Defines a map to copy property values from one object
 * to another avoiding verbose code when classes contains too 
 * much properties.
 */

using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            /*
             * mapping two objects of the same type to avoid verbose code.
             */
            CreateMap<Activity, Activity>();

            /*
             * when mapping Activity to ActivityDto the Host user name 
             * is obtained navigating to the attendees list of an activity
             * and find the item with the IsHost flag
             */
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUserName,
                    opts => opts.MapFrom(a => a.Attendees.FirstOrDefault(
                        aa => aa.IsHost).AppUser.UserName));

            /*
             * get the image for the AttendeeDto object by navigating to 
             * the Photos and select the main one.
             */
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));

            /*
             * get the image for the Profile object by navigating to 
             * the Photos and select the main one.
             */
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}