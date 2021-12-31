using DatingApp.models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Data
{
    public class AuthRepository : IAuthRepository


    {
        //constructor
        private readonly DataContext _contetxt;

        public AuthRepository(DataContext context)
        {
            _contetxt = context;
        }

        public DataContext Context { get; }

        public async Task<User> Login(string username, string password)
        {
            var user = await _contetxt.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x => x.UserName == username);
            if (user == null)
            {
                return null;

            }

            if (!verifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {

                return null;
            }
            return user;
        }
        private bool verifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHsh = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHsh.Length; i++)
                {
                    if (computedHsh[i] != passwordHash[i])
                    {
                        return false;

                    }

                }

            }
            return true;

        }

        public async Task<User> Register(User user, string password)
        {


            byte[] passwordHash, passwordSalt;
            createPasswordHash(password, out passwordHash, out passwordSalt);
            //assign to user the values of password salt and password hash
            //we do it to encrypt password
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            //restore the new value of user in database
            await _contetxt.Users.AddAsync(user);
            await _contetxt.SaveChangesAsync();
            return user;



        }

        private void createPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExist(string username)
            
        {
            if (await _contetxt.Users.AnyAsync(x => x.UserName == username)) {
                return true;
              
            }
            return false;
        }

       
    }
}
