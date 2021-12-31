using DatingApp.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DatingApp.Controllers
{
  

    [Route("api/[controller]")]
    [ApiController]
   
    public class ValuesController1 : ControllerBase

    {
     
        private readonly DataContext _context;


        //now i get the acsses to the data base
        public ValuesController1(DataContext context)
        {
           _context = context;
        }
        // GET: api/<ValuesController1>
        [EnableCors("_myAllowSpecificOrigins")]
        [HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        public  async Task <IActionResult> getValues() {
            var values =await _context.Values.ToListAsync();

            return Ok(values);
      
        }

        // GET api/<ValuesController1>/5
        [HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        public async Task <IActionResult> getvalue(int id) {

            var value =  await _context.Values.FirstOrDefaultAsync(x=>x.Id==id);
            return Ok(value);
        }

        // POST api/<ValuesController1>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ValuesController1>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ValuesController1>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
