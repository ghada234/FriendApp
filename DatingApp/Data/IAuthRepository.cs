using DatingApp.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Data
{
   public interface IAuthRepository
    {
        //returnuser
       Task<User> Register(User user,string password);
        //returnuser
        Task<User> Login(string username, string password);
        //return bool
        Task<bool> UserExist(string username);
      



            
    }
}
