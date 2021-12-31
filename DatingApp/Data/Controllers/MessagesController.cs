using AutoMapper;
using DatingApp.DTOs;
using DatingApp.Helpers;
using DatingApp.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingApp.Data.Controllers

{
  
    [Authorize]

    [Route("api/users/{userId}/[controller]")]
    public class MessagesController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repo, IMapper mapper)
        {


            _repo = repo;
            _mapper = mapper;
        }

        //id in get is message id
        [HttpGet("{id}", Name = "GetMessage")]

        public async Task<IActionResult> GetMessage(int userId, int id) {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId != currentUserId)
            {
                return Unauthorized();
            }
            var MessageFromRepo = await _repo.GetMessage(id);
            if (MessageFromRepo == null) {
                return NotFound("cannot found message");


            }
            return Ok(MessageFromRepo);
        }

        //get messages for users inbox ,outbox,unread
        [HttpGet]
        public async Task<IActionResult> getMessagesForUser(int userId, MessageParams messageParams) {

            //
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId != currentUserId)
            {
                return Unauthorized();
            }
            //
            messageParams.UserId = userId;
            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);
            Response.AddPagination(messagesFromRepo.CurrentPage, messagesFromRepo.PageSize, messagesFromRepo.TotalCount, messagesFromRepo.TotalPages);
            var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);
            return Ok(messages);
        }

        //id is the recipent id or the another person of conversation
        [HttpGet("thread/{id}")]
        public async Task<IActionResult> GetMessageThread(int userId, int id) {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId != currentUserId)
            {
                return Unauthorized();
            }
            var messageSFromRepo = await _repo.GetMessagesThread(userId, id);
            var messageThread = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageSFromRepo);
            return Ok(messageThread);
        }

        [HttpPost]

        public async Task<IActionResult> createMessage(int userId, [FromBody] MessageForCreationDto messageForCreationDto) {
            var currentUserId =int.Parse( User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId != currentUserId) {
                return Unauthorized();
            }
            messageForCreationDto.SenderId = userId;
           
            //get recipent user
            var recipent = await _repo.GetUser(messageForCreationDto.RecipentId);

            if (recipent == null) {
                return BadRequest("there is no user to send message to him");

            }
            var message = _mapper.Map<Messages>(messageForCreationDto);
            var newmessage = new Messages { RecepientId = messageForCreationDto.RecipentId, SenderId = userId, Content = messageForCreationDto.Content, MessageSent = DateTime.Now };
            _repo.Add<Messages>(newmessage);
            if (await _repo.SaveAll()) {

                return CreatedAtAction("GetMessage",new { id= newmessage.Id},newmessage);
            }
            else { throw new Exception("create message faild"); }
        
        }
    }
}
