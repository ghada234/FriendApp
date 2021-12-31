using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.DTOs;
using DatingApp.Helpers;
using DatingApp.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingApp.Data.Controllers
{

    [Route("api/users/{userId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IDatingRepository _repo;
        private readonly IOptions<CloudInarySetting> _cloudinaryconfig;
        private readonly IMapper _mapper;
        private Cloudinary _cloudinary;

        //private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo,
            IMapper mapper,
           IOptions<CloudInarySetting> cloudinaryconfig)

        {
            _repo = repo;
            _cloudinaryconfig = cloudinaryconfig;
            _mapper = mapper;

            //using cloudinaryconfig to create new account 

            Account cc = new Account(
                _cloudinaryconfig.Value.CloudName,
                _cloudinaryconfig.Value.ApiKey,
                _cloudinaryconfig.Value.ApiSecret

                );
            _cloudinary = new Cloudinary(cc);

        }



        //http get method
        [HttpGet("{id}", Name = nameof(GetPhoto))]


        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        ////////////

        //http post method
        [HttpPost]
        public async Task<IActionResult> addUserPhoto(int userId, PhotoForCreationDto photoforcreationdto)
        {

            //user from repo
            var user = await _repo.GetUser(userId);
            if (user == null)
            {
                return BadRequest("cannot find user ");
            }
            //get looged in user


            //var currentUserid = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            //if (currentUserid != user.Id)
            //{
            //   return Unauthorized();
            //}
            //upload photo to api

            var file = photoforcreationdto.File;
            //result when upload phot to cloudinary
            var uploadResult = new ImageUploadResult();

            //if there is afile
            if (file.Length > 0)
            {
                //read the file
                using (var stream = file.OpenReadStream())
                {
                    //maje file ready to upload to cloudinary
                    var imageuploadparams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face"),


                    };
                    //upload image to cloudinary
                    uploadResult = _cloudinary.Upload(imageuploadparams);

                }
            }
            //end of if

            //assign values to url and public id of photo
            photoforcreationdto.Url = uploadResult.Uri.ToString();
            photoforcreationdto.PublicId = uploadResult.PublicId;

            //<dest>(src)
            //we put photoforcreation dto to photo
            var photo = _mapper.Map<Photo>(photoforcreationdto);

            //after we put it we get photo class with values we want
            photo.user = user;
            if (!user.Photos.Any(m => m.IsMain))
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);
            var phototoreturn = _mapper.Map<PhotoForReturnDto>(photo);
            if (await _repo.SaveAll())
            {
                return CreatedAtAction(nameof(GetPhoto), new { id = photo.Id }, phototoreturn);

                //return Ok("uploade photos");
            }

            return BadRequest("couldn't add the photo");


        }

        //end of th post function


        ///////////////////
        //set main function
        //id is the photo id
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> setMainPhoto(int userId, int id)
        {
            //if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
            //    return Unauthorized();
            //}
            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo == null)
            {
                return NotFound();
            }
            if (photoFromRepo.IsMain == true)
            {
                return BadRequest("this is already main photo");
            }

            var currntMainPhoto = await _repo.GetMainPhoto(userId);
            if (currntMainPhoto != null)
            {
                currntMainPhoto.IsMain = false;
                photoFromRepo.IsMain = true;
            }

            if (await _repo.SaveAll())
            {
                return NoContent();

            }

            return BadRequest("faild to set photo to main");

        }

        //deletefphoto function
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {


            //if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
            //    return Unauthorized();
            //}

            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo == null)
            {
                return NotFound();
            }
            if (photoFromRepo.IsMain == true)
            {
                return BadRequest("cannot delete Main photo");
            }

            if (photoFromRepo.PublicId != null)
            {
                //delete photo from cloudinary

                var deleteparams = new DeletionParams(photoFromRepo.PublicId);

                var result = _cloudinary.Destroy(deleteparams);
                //sucessful destroy operation return result ok
                //check if photo was destroyed from cloudinary
                if (result.Result == "ok")
                {
                    _repo.Delete(photoFromRepo);
                }
            }
            if (photoFromRepo.PublicId == null)
            {
                _repo.Delete(photoFromRepo);
            }

            if (await _repo.SaveAll())
            {
                return Ok("photo was deleted");

            }
            return BadRequest("faild to delete the photo");
        }




    }
}
