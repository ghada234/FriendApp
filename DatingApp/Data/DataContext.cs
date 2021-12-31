using DatingApp.models;
using Microsoft.EntityFrameworkCore;
using System;


namespace DatingApp.Data {


	public class DataContext:DbContext
	{
		public DataContext(DbContextOptions<DataContext> options):base(options)
		{
		}
		//end of constructor

		//create table name values 
		public DbSet<value> Values { get; set; }
        public DbSet <User>Users { get; set; }
        public DbSet <Photo> Photos { get; set; }

		public DbSet<Like> Likes { get; set; }
        public DbSet<Messages> Messages{ get; set; }

        protected override void OnModelCreating(ModelBuilder builder) {

			//assign primary key to both liker id and likee id
			builder.Entity<Like>().HasKey(k => new { k.LikerId, k.LikeeId });
		
			//relationships that i don't understand well
			builder.Entity<Like>().HasOne(u => u.Likee).WithMany(u => u.Liker).HasForeignKey(k => k.LikerId).OnDelete(DeleteBehavior.Restrict);
			builder.Entity<Like>().HasOne(u => u.Likeer).WithMany(u => u.Likee).HasForeignKey(k => k.LikeeId).OnDelete(DeleteBehavior.Restrict);
			builder.Entity<Messages>().HasOne(u => u.Sender).WithMany(m => m.MessageSent).OnDelete(DeleteBehavior.Restrict);

			builder.Entity<Messages>().HasOne(u => u.Recepient).WithMany(m => m.MessageRecived).OnDelete(DeleteBehavior.Restrict);

		}





    }

}


