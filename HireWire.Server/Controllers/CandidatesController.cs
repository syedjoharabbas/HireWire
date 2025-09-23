using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HireWire.Server.Data;
using HireWire.Server.Models;
using System.Security.Claims;

namespace HireWire.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CandidatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CandidatesController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private int? GetCurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(idClaim, out var id)) return id;
            return null;
        }

        private bool IsAdmin() => User.IsInRole("Admin");

        private string ToAbsoluteUrl(string relativePath)
        {
            if (string.IsNullOrEmpty(relativePath)) return relativePath ?? string.Empty;
            if (relativePath.StartsWith("http://") || relativePath.StartsWith("https://")) return relativePath;
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            return baseUrl + relativePath;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Candidate>>> GetCandidates()
        {
            List<Candidate> list;
            if (IsAdmin())
                list = await _context.Candidates.ToListAsync();
            else
            {
                var uid = GetCurrentUserId();
                if (uid == null) return Forbid();
                list = await _context.Candidates.Where(c => c.OwnerId == uid.Value).ToListAsync();
            }

            // Normalize resume URLs
            list.ForEach(c => { if (!string.IsNullOrEmpty(c.ResumePath)) c.ResumePath = ToAbsoluteUrl(c.ResumePath); });

            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Candidate>> GetCandidate(int id)
        {
            var cand = await _context.Candidates.FindAsync(id);
            if (cand == null) return NotFound();
            if (!IsAdmin() && cand.OwnerId != GetCurrentUserId()) return Forbid();
            if (!string.IsNullOrEmpty(cand.ResumePath)) cand.ResumePath = ToAbsoluteUrl(cand.ResumePath);
            return Ok(cand);
        }

        [HttpPost]
        public async Task<ActionResult<Candidate>> CreateCandidate([FromBody] Candidate dto)
        {
            var uid = GetCurrentUserId();
            if (uid == null) return Forbid();

            var cand = new Candidate
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Notes = dto.Notes,
                ResumePath = dto.ResumePath,
                OwnerId = uid.Value,
                OwnerUsername = User.Identity?.Name,
                CreatedAt = DateTime.UtcNow,
                LastUpdated = DateTime.UtcNow
            };

            _context.Candidates.Add(cand);
            await _context.SaveChangesAsync();

            if (!string.IsNullOrEmpty(cand.ResumePath)) cand.ResumePath = ToAbsoluteUrl(cand.ResumePath);
            return CreatedAtAction(nameof(GetCandidate), new { id = cand.Id }, cand);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidate(int id, [FromBody] Candidate dto)
        {
            if (id != dto.Id) return BadRequest();
            var existing = await _context.Candidates.FindAsync(id);
            if (existing == null) return NotFound();
            if (!IsAdmin() && existing.OwnerId != GetCurrentUserId()) return Forbid();

            existing.FullName = dto.FullName;
            existing.Email = dto.Email;
            existing.Phone = dto.Phone;
            existing.Notes = dto.Notes;
            existing.ResumePath = dto.ResumePath;
            existing.LastUpdated = DateTime.UtcNow;

            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidate(int id)
        {
            var existing = await _context.Candidates.FindAsync(id);
            if (existing == null) return NotFound();
            if (!IsAdmin() && existing.OwnerId != GetCurrentUserId()) return Forbid();

            _context.Candidates.Remove(existing);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/uploadResume")]
        public async Task<IActionResult> UploadResume(int id, IFormFile file)
        {
            var existing = await _context.Candidates.FindAsync(id);
            if (existing == null) return NotFound();
            if (!IsAdmin() && existing.OwnerId != GetCurrentUserId()) return Forbid();

            if (file == null || file.Length == 0) return BadRequest("No file");

            // Primary web root (where StaticFiles serves from)
            var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsPrimary = Path.Combine(webRoot, "uploads");
            if (!Directory.Exists(uploadsPrimary)) Directory.CreateDirectory(uploadsPrimary);

            // Secondary: application base (in case static files served from published location)
            var baseDir = AppContext.BaseDirectory;
            var uploadsSecondary = Path.Combine(baseDir, "wwwroot", "uploads");
            if (!Directory.Exists(uploadsSecondary)) Directory.CreateDirectory(uploadsSecondary);

            var fileName = $"candidate_{id}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var primaryPath = Path.Combine(uploadsPrimary, fileName);
            var secondaryPath = Path.Combine(uploadsSecondary, fileName);

            // write primary
            using (var stream = System.IO.File.Create(primaryPath))
            {
                await file.CopyToAsync(stream);
            }

            try
            {
                // write secondary by reopening the file stream
                using (var readStream = file.OpenReadStream())
                using (var stream2 = System.IO.File.Create(secondaryPath))
                {
                    await readStream.CopyToAsync(stream2);
                }
            }
            catch
            {
                // ignore secondary write errors
            }

            // Save absolute URL
            var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
            existing.ResumePath = url;
            existing.LastUpdated = DateTime.UtcNow;
            await _context.SaveChangesAsync();

#if DEBUG
            return Ok(new { url = existing.ResumePath, physical = new[] { primaryPath, secondaryPath } });
#else
            return Ok(new { url = existing.ResumePath });
#endif
        }
    }
}
