using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services,
            IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            // allow all type of requests from our client app
            // allow credentials header in CORS requests to enable SignalR communication in chat
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithOrigins("http://localhost:3000");
                });
            });

            // register MediatR types to implement CQSR in controllers
            services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));

            // register mappers to convert objects from different types
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            // register fluent validation to validate 
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>();

            // add a default implementation to access the http context
            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();

            // add a default implementation to manage the photo upload and removal
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();

            // set up the cloudinary settings
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));

            // Enable SignalR hubs
            services.AddSignalR();

            return services;
        }
    }
}