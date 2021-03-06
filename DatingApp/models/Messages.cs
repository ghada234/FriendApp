using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.models
{
    public class Messages
    {


        public int Id { get; set; }

        //sendrid is foreign key
        public int SenderId { get; set; }
        public User Sender { get; set; }

        //recipent id is foreign key
        public int RecepientId { get; set; }
        public User Recepient{ get; set; }

        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }
        public bool SenderDeleted { get; set; }
        public bool RecipentDeleted { get; set; }


    }
}
