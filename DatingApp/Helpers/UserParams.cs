using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Helpers
{
    public class UserParams
    {

        //max page size to prevet user to request more than it and problem happens
        private const int MaxPageSize = 20;

        //set default of page number as one
        public int PageNumber { get; set; } = 1;

        //propfull to get privat and public like what iddid in pagesize

        //initial pagesize as 10
        private int pagesize=10;

        public int PageSize
        {
            get { return pagesize; }
            set { pagesize = (value > MaxPageSize) ? MaxPageSize : value; }
        }
        public int UserId { get; set; }
        public  string Gender { get; set; }

        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 70;
        public string OrderBy { get; set; }
        public bool Likees { get; set; } = false;

        public bool Likers { get; set; } = false;










    }
}
