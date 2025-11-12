using Microsoft.EntityFrameworkCore;

namespace ReactApp.Server.Entities
{
    public class AppDbContext : DbContext
    {
        public DbSet<Task> Tasks { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Task>().Property(t => t.Status).HasConversion<string>();
            modelBuilder.Entity<Task>().ToTable("Tasks");
            modelBuilder.Entity<Task>().Property(e => e.RequestDate)
              .HasColumnType("timestamp");  
            modelBuilder.Entity<Task>().Property(e => e.DueDate)
             .HasColumnType("timestamp");
            modelBuilder.Entity<Task>().Property(e => e.CreatedAt)
            .HasColumnType("timestamp");
        }
    }
}
