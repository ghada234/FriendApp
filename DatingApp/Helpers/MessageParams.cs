using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Helpers
{
    public class MessageParams
    {
        //max page size to prevet user to request more than it and problem happens
        private const int MaxPageSize = 20;

        //set default of page number as one
        public int PageNumber { get; set; } = 1;

        //propfull to get privat and public like what iddid in pagesize

        //initial pagesize as 10
        private int pagesize = 10;

        public int PageSize
        {
            get { return pagesize; }
            set { pagesize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        //in case of inbox userid=recipentid in case of outbox userid=senderid
        public int UserId { get; set; }
        public string MessageContainer { get; set; } = "Unread";
    }
}
