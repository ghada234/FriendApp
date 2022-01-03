using DatingApp.Helpers;
using DatingApp.models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _Datacontext;

        public DatingRepository(DataContext datacontext)
        {
            _Datacontext = datacontext;
        }

        public void Add<T>(T entity) where T : class
        {
            _Datacontext.Add(entity);

        }

        public void Delete<T>(T entity) where T : class
        {
            _Datacontext.Remove(entity);
        }

        ///////////////

        public async Task<User> GetUser(int id)
        {
            var User = await _Datacontext.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Id == id);
            return User;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userparams)
        {
            var Users = _Datacontext.Users.Include(p => p.Photos).OrderByDescending(x => x.LastActive).AsQueryable();
            var Likes = _Datacontext.Likes.AsQueryable();


            //dont get the current user data
            Users = Users.Where(u => u.Id != userparams.UserId);
            Users = Users.Where(u => u.Gender == userparams.Gender);

            //filter by ikees and likers of current logged in user
            if (userparams.Likers)
            {
                //var userLikers = await GetUserLikes(userparams.UserId, userparams.Likers);

                //Users = Users.Where(u => userLikers.Any(liker=>liker.LikerId==u.Id)
                //Users=Users.Where(u=>u.Likee.Any(l=>l.LikeeId==u.Id));
                Likes = Likes.Where(l => l.LikeeId == userparams.UserId);
                Users = Likes.Select(like => like.Likee);
            }
            if (userparams.Likees)
            {
                //var userLikees = await GetUserLikes(userparams.UserId, userparams.Likees);

                //Users = Users.Where(u => userLikees.Any(likee => likee.LikeeId == u.Id));
                Likes = Likes.Where(l => l.LikerId == userparams.UserId);
                Users = Likes.Select(like => like.Likeer);
            }


            //filter by age
            if (userparams.MinAge != 18 || userparams.MaxAge != 70)
            {
                //Users = Users.Where(u => u.DateOfBirth.ToList().CalculateAge() >= userparams.MinAge && u.DateOfBirth.ToList().CalculateAge() <= userparams.MaxAge);
                //Users = Users.Where(u => u.DateOfBirth >= userparams.MinAge.ToList().CalculateAge() && u.DateOfBirth <= userparams.MaxAge.Tolist().CalculateAge());

                var minDob = DateTime.Today.AddYears(-userparams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userparams.MinAge);
                Users = Users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            }
            if (!string.IsNullOrEmpty(userparams.OrderBy))
            {
                switch (userparams.OrderBy)
                {
                    case "created":
                        Users = Users.OrderByDescending(x => x.Created);
                        break;
                    default:
                        Users = Users.OrderByDescending(x => x.LastActive);
                        break;

                }

            }
            //    switch (userparams.OrderBy) {
            //        case "created":
            //            Users = Users.OrderByDescending(x => x.Created);

            //    }


            //}
            var user = Users;

            return await PagedList<User>.CreateAsync(Users, userparams.PageNumber, userparams.PageSize);

        }

        public async Task<bool> SaveAll()
        {
            return await _Datacontext.SaveChangesAsync() > 0;

        }
        /// 
        public async Task<IEnumerable<Like>> GetUserLikes(int id, bool likers)
        {

            var user = await _Datacontext.Users.Include(x => x.Likee).Include(x => x.Liker).FirstOrDefaultAsync(u => u.Id == id);
            if (likers)
            {

                return user.Likee.Where(u => u.LikeeId == id);
            }
            else
            {
                return user.Liker.Where(l => l.LikerId == id);
            }

        }


        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _Datacontext.Photos.FirstOrDefaultAsync(x => x.Id == id);
            return photo;

        }

        public async Task<Photo> GetMainPhoto(int userId)

        {
            var photo = await _Datacontext.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain == true);
            return photo;
        }

        public async Task<Like> GetLikes(int userid, int recevierid)
        {
            return await _Datacontext.Likes.FirstOrDefaultAsync(x => x.LikerId == userid && x.LikeeId == recevierid);

        }

        public async Task<Messages> GetMessage(int id)
        {
            return await _Datacontext.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Messages>> GetMessagesForUser(MessageParams messageparams)

        {
            //get messages include sender and recipent and their photo also
            var messages = _Datacontext.Messages.Include(x => x.Sender).ThenInclude(x => x.Photos).Include(x => x.Recepient).ThenInclude(x => x.Photos).AsQueryable();
            switch (messageparams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(m => m.RecepientId == messageparams.UserId && m.RecipentDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(m => m.SenderId == messageparams.UserId && m.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(x => x.RecepientId == messageparams.UserId && x.IsRead == false && x.RecipentDeleted == false);
                    break;

            }
            messages = messages.OrderByDescending(x => x.MessageSent);
            return await PagedList<Messages>.CreateAsync(messages, messageparams.PageNumber, messageparams.PageSize);
        }


        //get converation between two user and order it by datecreated of message
        public async Task<IEnumerable<Messages>> GetMessagesThread(int userId, int recipentId)
        {
            var messages = await _Datacontext.Messages.Include(x => x.Sender)
                .ThenInclude(x => x.Photos).Include(x => x.Recepient).ThenInclude(x => x.Photos)
                .Where(m => (m.RecepientId == userId && m.RecipentDeleted == false && m.SenderId == recipentId) || (m.RecepientId == recipentId && m.SenderDeleted == false && m.SenderId == userId))
                .OrderBy(m => m.MessageSent).ToListAsync();
            return messages;

        }
    }
}
