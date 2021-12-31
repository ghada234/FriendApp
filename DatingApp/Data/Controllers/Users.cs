using AutoMapper;
using DatingApp.DTOs;
using DatingApp.Helpers;
using DatingApp.models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingApp.Data.Controllers

{
    //action filetr for all user controller 
    [ServiceFilter(typeof(UserLogActivity))]
    [Authorize]

    [Route("api/[controller]")]

    public class UsersController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        //private Microsoft.AspNet.Identity.UserManager<ApplicationUser> _userManager;


        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;

        }



        [HttpGet]

        public async Task<IActionResult> GetUsers([FromQuery] UserParams userparams)
        {
            var current = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var UserFromRepo = await _repo.GetUser(currentUserId);
            userparams.UserId = currentUserId;

            if (string.IsNullOrEmpty(userparams.Gender))
            {
                //get the oppssite gender of user
                userparams.Gender = UserFromRepo.Gender == "male" ? "male" : "female";
            }

            ///
            ///
            var Users = await _repo.GetUsers(userparams);
            var UsersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(Users);
            Response.AddPagination(Users.CurrentPage, Users.PageSize, Users.TotalCount, Users.TotalPages);



            return Ok(UsersToReturn);



        }

        ////////
        ///
        [HttpGet("{id}", Name = "GetUser")]

        public async Task<IActionResult> GetUser(int id)
        {


            var user = await _repo.GetUser(id);
            //_mapper.map<destination>(src)

            var UserToReturn = _mapper.Map<UserForDetailDto>(user);

            return Ok(UserToReturn);

        }


        //////////////////
        /// to update we use put method
        [HttpPut("{id}")]
        public async Task<object> UpdateUser(int id, [FromBody] UserForUpdateDto userforupdatedto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }
            //get the id of current user by token
            //var CurrentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            User UserFromRepo = await _repo.GetUser(id);

            if (UserFromRepo == null)
                return NotFound("cannot found user");
            //var CurrentUserId= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // if (CurrentUserId != UserFromRepo.Id)
            //  return Unauthorized();

            //_mapper.map(src,dest)

            _mapper.Map(userforupdatedto, UserFromRepo);

            //_mapper.Map
            //<userforupdatedto>(UserFromRepo);


            if (await _repo.SaveAll())
            {
                return NoContent();


            }
            throw new Exception("updating user faild");


        }

        //http post method for send like
        [HttpPost("{id}/like/{recevierId}")]
        //id is current user id
        public async Task<IActionResult> sendLike(int id, int recevierId)
        {

            var currentUserid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (currentUserid != id) {
                return Unauthorized();
            }
            var like = await _repo.GetLikes(id,recevierId);
            if (like != null) {
                return BadRequest("you already liked this user");
            }
            if (await _repo.GetUser(recevierId) ==null) {
                return NotFound();
            }
            like = new Like
            {
                LikerId = id,
                LikeeId=recevierId,
            
            };
            _repo.Add<Like>(like);

            if (await _repo.SaveAll()) {
                return Ok();
            }
            else { return BadRequest("faild to adduser"); }
        }


    }
}
