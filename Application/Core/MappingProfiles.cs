/*
 * Defines a map to copy property values from one object
 * to another avoiding verbose code when classes contains too 
 * much properties.
 */

using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
        }
    }
}