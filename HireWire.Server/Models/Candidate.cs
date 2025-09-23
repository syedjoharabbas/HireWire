using System.ComponentModel.DataAnnotations;

namespace HireWire.Server.Models;

public class Candidate
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    [MaxLength(50)]
    public string? Phone { get; set; }

    [MaxLength(500)]
    public string? ResumePath { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    // Ownership
    public int OwnerId { get; set; }
    public string? OwnerUsername { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime LastUpdated { get; set; }
}
