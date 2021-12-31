using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.DTOs
{

    //messages we want toreturn
    public class MessageToReturnDto
    {
        public int Id { get; set; }

        //sendrid is foreign key
        public int SenderId { get; set; }
        public string SenderKnownAs { get; set; }
        public string SenderPhotoUrl { get; set; }

        //recipent id is foreign key
        public int RecepientId { get; set; }
        public string RecepientKnownAs { get; set; }
        public string RecipentPhotoUrl { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }
    }
}
