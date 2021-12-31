using DatingApp.models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Data
{
    public class Seed
    {
        private readonly DataContext _context;

        public Seed(DataContext context)
        {
            _context = context;   
        }


/// //////////////////////////////////////////////////////////////////

        public void SeedUser() {


            //remove all data in Users table

            //_context.Users.RemoveRange(_context.Users);
            //_context.SaveChanges();

            var UserData = System.IO.File.ReadAllText("Data/UserSeedData.json");

            //convert from json to object user
            var Users = JsonConvert.DeserializeObject<List<User>>(UserData);

            foreach (var user in Users)

            {
                byte[] passwordHash, passwordSalt;

                CreatePasswordHash("password", out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.UserName = user.UserName.ToLower();
                //add user to every colounmn in Users table
                //add user to every colounmn in Users table
                _context.Users.Add(user);
            }
            _context.SaveChanges();

        }
        /////////////////////////////////////////

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
