using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.models
{
    public class User
    {
        public int Id{ get; set; }
        public string UserName { get; set; }
        public byte[] PasswordHash{ get; set; }

        public byte[] PasswordSalt { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth{ get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive{ get; set; }
        public string Introduction { get; set; }

        public string LookingFor { get; set; }
        public string Interests{ get; set; }
        public string  City { get; set; }

        public string Country { get; set; }

        public ICollection<Photo> Photos { get; set; }
        //one user has mnaylikers and one user has many likees
        public ICollection<Like> Liker { get; set; }
        public ICollection<Like> Likee { get; set; }
        public ICollection<Messages> MessageSent { get; set; }
        public ICollection<Messages> MessageRecived { get; set; }


        public User() {

            Photos = new Collection<Photo>();
        }



    }
}
