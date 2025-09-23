using System.ComponentModel.DataAnnotations;

namespace HireWire.Server.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public byte[] PasswordHash { get; set; } = null!;

        [Required]
        public byte[] PasswordSalt { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = "User";
    }
}
