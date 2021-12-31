using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Helpers
{
    public class PagedList<T>:List<T>
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        //constructor
        public PagedList(List<T> items,int count,int pagenumber,int pagesize)
           
        {
            PageSize = pagesize;
            TotalCount = count;
            CurrentPage = pagenumber;
            TotalPages = (int)Math.Ceiling(count / (double)pagesize);

            //add to instance of paglist type the items we pass it when create new instance
            this.AddRange(items);

                    
        }
        //createAsync method to create pagelist and return it 
        public async static Task<PagedList<T>> CreateAsync(IQueryable<T> source,int pagenumber,int pagesize) {

            //get number of items  returned from the source
            var count = await source.CountAsync();
            var items = await source.Skip((pagenumber - 1) * pagesize).Take(pagesize).ToListAsync();
            return new PagedList<T>(items, count, pagenumber, pagesize);
        
        }

    }
}
