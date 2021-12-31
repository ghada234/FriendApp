using DatingApp.Helpers;
using DatingApp.models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Data
{
   public interface IDatingRepository
    {
        //add and delete use generic method and that mean just one method that can take any type of class

        void Add<T>(T entity) where T :class;
        void Delete<T>(T entity) where T : class;

        ///////////

        Task<bool> SaveAll();
        Task<PagedList<User>> GetUsers(UserParams userparams);

        Task<User> GetUser( int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhoto(int userId);
        Task<Like> GetLikes(int userid , int recevierid);

        //id is te id of messaeg
        Task<Messages> GetMessage(int id);
        Task<PagedList<Messages>> GetMessagesForUser(MessageParams messageparams);
        Task<IEnumerable<Messages>> GetMessagesThread(int userId, int recipentId);




    }
}
