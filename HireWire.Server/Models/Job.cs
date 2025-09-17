using System.ComponentModel.DataAnnotations;

namespace HireWire.Server.Models;

public class Job
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Company { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [Required]
    public JobStatus Status { get; set; }

    [Required]
    public DateTime DateApplied { get; set; }

    [MaxLength(50)]
    public string? Salary { get; set; }

    public string? Notes { get; set; }

    [MaxLength(100)]
    public string? ContactName { get; set; }

    [MaxLength(100)]
    [EmailAddress]
    public string? ContactEmail { get; set; }

    [MaxLength(500)]
    public string? NextSteps { get; set; }

    [Required]
    public DateTime LastUpdated { get; set; }
}

public enum JobStatus
{
    Applied,
    Interview,
    Offer,
    Rejected
}