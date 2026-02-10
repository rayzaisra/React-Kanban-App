using Microsoft.EntityFrameworkCore;

namespace ReactApp.Server.Entities
{
    public class AppDbContext : DbContext
    {
        public DbSet<Task> Tasks { get; set; }
        public DbSet<UserPreferences> UserPreferences { get; set; }
        public DbSet<BoardColumn> BoardColumns { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Task>().Property(t => t.Status).HasConversion<string>();
            modelBuilder.Entity<Task>().ToTable("Tasks");
            //modelBuilder.Entity<Task>().Property(e => e.RequestDate)
            //  .HasColumnType("timestamp");  
            //modelBuilder.Entity<Task>().Property(e => e.DueDate)
            // .HasColumnType("timestamp");
            //modelBuilder.Entity<Task>().Property(e => e.CreatedAt)
            //.HasColumnType("timestamp");


            // UserPreferences configuration
            modelBuilder.Entity<UserPreferences>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UserId).IsRequired();
                entity.HasIndex(e => e.UserId).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("sysdatetime()");
            });

            // BoardColumn configuration
            modelBuilder.Entity<BoardColumn>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.StatusValue).IsRequired();
                entity.Property(e => e.DisplayOrder).IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("sysdatetime()");
            });
        }
    }
}
