using DatingApp.Data;
using DatingApp.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace DatingApp
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var key = Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value);
            services.AddControllers();
            //

            services.Configure<CloudInarySetting>(Configuration.GetSection("CloudInarySetting"));


            //        services.Configure<IdentityOptions>(options =>
            //options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier);

            //for error in routes
            //services.AddControllers(options => options.SuppressAsyncSuffixInActionNames = false);

            services.AddControllers(opt => {
                opt.SuppressAsyncSuffixInActionNames = false;
            });

            services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddTransient<Seed>();

            services.AddCors(option => option.AddPolicy(MyAllowSpecificOrigins, builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
            
           
            services.AddAutoMapper(typeof(Startup));
            //

            //add repository interf(ace and concerte class to the service
            services.AddScoped<IAuthRepository, AuthRepository>();

            services.AddScoped<IDatingRepository, DatingRepository>();

            //for actionfilter in user controllers
            services.AddScoped<UserLogActivity>();
            services.Configure<IdentityOptions>(options =>
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier);


            ////jwt bearer authntication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                     IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false,


                        // ValidIssuer = Configuration["Tokens:Issuer"],
                        //ValidAudience = Configuration["Tokens:Audience"],
                    };
                });



        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, Seed seeder
    )
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(builder =>
                {
                    builder.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }

                    });

                });

            }

            //app.UseHttpsRedirection();


            app.UseRouting();
            app.UseCors(MyAllowSpecificOrigins);

            ///
           //seeder.SeedUser();
            ////
            app.UseAuthentication();
            app.UseAuthorization();
          



            app.UseEndpoints(endpoints =>
            {
                //endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}");

                endpoints.MapDefaultControllerRoute();
            });
            //solve orgin domain problem from 4200 to 5000





        }
    }
}
