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
    public class JobsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int? GetCurrentUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(idClaim, out var id)) return id;
            return null;
        }

        private bool IsAdmin() => User.IsInRole("Admin");

        // GET: api/jobs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
        {
            if (IsAdmin())
            {
                return await _context.Jobs.ToListAsync();
            }

            var userId = GetCurrentUserId();
            if (userId == null) return Forbid();

            return await _context.Jobs.Where(j => j.OwnerId == userId.Value).ToListAsync();
        }

        // GET: api/jobs/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            if (!IsAdmin())
            {
                var userId = GetCurrentUserId();
                if (userId == null || job.OwnerId != userId.Value) return Forbid();
            }

            return job;
        }

        // POST: api/jobs
        [HttpPost]
        public async Task<ActionResult<Job>> CreateJob(Job job)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Forbid();

            job.LastUpdated = DateTime.UtcNow;
            job.OwnerId = userId.Value;
            job.OwnerUsername = User.Identity?.Name;

            if (job.CandidateId.HasValue)
            {
                var cand = await _context.Candidates.FindAsync(job.CandidateId.Value);
                if (cand != null) job.CandidateName = cand.FullName;
            }

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        // PUT: api/jobs/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, Job job)
        {
            if (id != job.Id)
            {
                return BadRequest();
            }

            var existingJob = await _context.Jobs.FindAsync(id);
            if (existingJob == null) return NotFound();

            if (!IsAdmin())
            {
                var userId = GetCurrentUserId();
                if (userId == null || existingJob.OwnerId != userId.Value) return Forbid();
            }

            existingJob.Title = job.Title;
            existingJob.Company = job.Company;
            existingJob.Location = job.Location;
            existingJob.Status = job.Status;
            existingJob.DateApplied = job.DateApplied;
            existingJob.Salary = job.Salary;
            existingJob.Notes = job.Notes;
            existingJob.ContactName = job.ContactName;
            existingJob.ContactEmail = job.ContactEmail;
            existingJob.NextSteps = job.NextSteps;
            existingJob.LastUpdated = DateTime.UtcNow;

            existingJob.CandidateId = job.CandidateId;
            if (job.CandidateId.HasValue)
            {
                var cand = await _context.Candidates.FindAsync(job.CandidateId.Value);
                existingJob.CandidateName = cand?.FullName;
            }

            _context.Entry(existingJob).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/jobs/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/jobs/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetJobStats()
        {
            if (IsAdmin())
            {
                var stats = await _context.Jobs
                    .GroupBy(j => j.Status)
                    .Select(g => new { status = g.Key, count = g.Count() })
                    .ToListAsync();

                return Ok(new { statusBreakdown = stats });
            }

            var userId = GetCurrentUserId();
            if (userId == null) return Forbid();

            var statsUser = await _context.Jobs
                .Where(j => j.OwnerId == userId.Value)
                .GroupBy(j => j.Status)
                .Select(g => new { status = g.Key, count = g.Count() })
                .ToListAsync();

            return Ok(new { statusBreakdown = statsUser });
        }

        private bool JobExists(int id)
        {
            return _context.Jobs.Any(e => e.Id == id);
        }
    }
}