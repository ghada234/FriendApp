using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace DatingApp.Controllers
{

    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;


        //inject authrepository to call functions inside it
        public AuthController(IAuthRepository repo, IConfiguration config,IMapper mapper)
        {
            _repo = repo;
           _config = config;
            _mapper = mapper;
        }

        [HttpPost("register")]


        //use dto to transfer data between layers back and front 
        public async Task<IActionResult> Register([FromBody] UserForRegistryDto userForRegistryDto)

        {

            //if (!string.IsNullOrEmpty(userForRegistryDto.UserName))
            //{ userForRegistryDto.UserName = userForRegistryDto.UserName.ToLower(); }
          

            //if (await _repo.UserExist(userForRegistryDto.UserName))
            //{
            //    ModelState.AddModelError("UserName", "Username is already exist");

            //}

            //validate parameter that will enter database
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            //create new instance of user it username =username that we recived
            //var UserToCreate = new User
            //{
            //    UserName = userForRegistryDto.UserName

            //};
            var UserToCreate = _mapper.Map<User>(userForRegistryDto);
            var Createduser = await _repo.Register(UserToCreate, userForRegistryDto.Password);
            var UserToReturn = _mapper.Map<UserForDetailDto>(Createduser);

            //not understand
            return CreatedAtAction("GetUser", new { controller="users", id=Createduser.Id}, UserToReturn);

        }

        //end of register function
        [HttpPost("login")]
        public async Task<IActionResult> login([FromBody] UserForLoginDto userForLoginDto)
        {


                //throw new Exception("exception error sorry yla");

                var UserFromRepo = await _repo.Login(userForLoginDto.UserName.ToLower(), userForLoginDto.Password);
                if (UserFromRepo == null)
                {
                    return Unauthorized();
                }
                //creating the token jwt

                var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:Token").Value);
            var TokenDescriptor = new SecurityTokenDescriptor
                {

                    Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.NameIdentifier, UserFromRepo.Id.ToString()),
                    new Claim(ClaimTypes.Name, UserFromRepo.UserName)
                }),
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512)
                };
                //create token and token string
                var token = tokenHandler.CreateToken(TokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);
            var user = _mapper.Map<UserForListDto>(UserFromRepo);


            //return token as an object


            return Ok(new {tokenString,user});
            //return Ok(new UserDto { Username=UserFromRepo.UserName,Token=tokenString,KnownAs=UserFromRepo.KnownAs,Gender=UserFromRepo.Gender,
            //PhotoUrl=UserFromRepo.Photos.FirstOrDefault(x => x.IsMain)?.Url,

            //});




      

           


        }

        //end of login method
    }
}
