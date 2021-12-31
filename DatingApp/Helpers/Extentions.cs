using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Helpers
{


    //this is extention method 
    public static class Extentions
    {
        public static void AddApplicationError(this HttpResponse resonse ,string message) {


            resonse.Headers.Add("Application-Error",message);
            resonse.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
           resonse.Headers.Add("Access-Control-Allow-origin", "*");
        
        }

        //extention for response pagination header  that return to uwer in header response
        public static void AddPagination(this HttpResponse httpresponse, int currentpage, int itemsperpage, int totalitems, int totalpages) {


            var paginationheader = new PaginationHeader( currentpage, itemsperpage, totalitems, totalpages);

            //convert httpresponse from Pascal to Can=melcase formatter
            var CamelCaseFormatter = new JsonSerializerSettings();
            CamelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            httpresponse.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationheader,CamelCaseFormatter));
            httpresponse.Headers.Add("Access-Control-Expose-Headers", "Pagination");


        }

        /////////// to calculate age
        public static int CalculateAge(this DateTime theDate) {

            var age = DateTime.Today.Year - theDate.Year;

            if (theDate.AddYears(age) > DateTime.Today)
            {

                age--;
            }

            return age;
        
        }

    }
}
