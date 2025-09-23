using Microsoft.EntityFrameworkCore;
using HireWire.Server.Models;

namespace HireWire.Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Job> Jobs { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Candidate> Candidates { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Company).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Status).IsRequired();
            entity.Property(e => e.DateApplied).IsRequired();
            entity.Property(e => e.LastUpdated).IsRequired();
            entity.Property(e => e.Salary).HasMaxLength(50);
            entity.Property(e => e.ContactName).HasMaxLength(100);
            entity.Property(e => e.ContactEmail).HasMaxLength(100);
            entity.Property(e => e.NextSteps).HasMaxLength(500);

            entity.Property(e => e.OwnerId).IsRequired();
            entity.Property(e => e.OwnerUsername).HasMaxLength(100);

            entity.Property(e => e.CandidateId);
            entity.Property(e => e.CandidateName).HasMaxLength(200);
        });

        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.ResumePath).HasMaxLength(500);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            entity.Property(e => e.OwnerUsername).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.LastUpdated).IsRequired();
        });
    }
}