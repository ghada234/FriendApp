using AutoMapper;
using DatingApp.Data.Controllers;
using DatingApp.DTOs;
using DatingApp.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()

            //createMap<src,dest>
        {
            CreateMap<User, UserForListDto>().ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url)).ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<User, UserForDetailDto>().ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url)).ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge())); ;

            CreateMap<Photo, PhotoForDetailDto>();
            ////////////////////////////////////////
            /// map data from userforupdate to user

            CreateMap<UserForUpdateDto, User>();
            ///////////////////////////////////////

            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<Photo, PhotoForReturnDto>();

            CreateMap<UserForRegistryDto, User>();
            CreateMap<MessageForCreationDto, Messages>().ReverseMap();

            CreateMap<Messages, MessageToReturnDto>()
                .ForMember(dest => dest.SenderKnownAs, opt => opt.MapFrom(src => src.Sender.KnownAs))
                .ForMember(dest => dest.RecepientKnownAs, opt => opt.MapFrom(src => src.Recepient.KnownAs))
                .ForMember(dest => dest.SenderPhotoUrl, opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            
            .ForMember(dest => dest.RecipentPhotoUrl, opt => opt.MapFrom(src => src.Recepient.Photos.FirstOrDefault(p => p.IsMain).Url));




        }
    }
}
