/*
 * As its name suggests this controller handles the requests involving 
 * user accounts this does not derive from BaseApiController because it 
 * doesn't need any mediator logic. We don't need to be authenticated to use
 * this operations so it make sense to allow anonymous access.
 */

using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager,
            TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // check if email exists in database
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            var userExists = user != null;

            if (!userExists) return Unauthorized();

            // check if password is OK in database
            var passwordOK = await _userManager
                .CheckPasswordAsync(user, loginDto.Password);

            if (passwordOK)
                return CreateUserObject(user);
            else
                return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(u => u.UserName == registerDto.UserName))
                return BadRequest("User name is already taken");

            if (await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
                return BadRequest("Email is already taken");

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            // save user to database
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserObject(user);
            }

            return BadRequest("Problem registering user");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(
                User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);

        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplaName = user.DisplayName,
                Image = null,
                Token = _tokenService.CreateToken(user),
                UserName = user.UserName
            };
        }
    }
}