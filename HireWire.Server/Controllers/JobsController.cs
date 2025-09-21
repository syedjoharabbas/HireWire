using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HireWire.Server.Data;
using HireWire.Server.Models;

namespace HireWire.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/jobs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
        {
            return await _context.Jobs.ToListAsync();
        }

        // GET: api/jobs/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }
            return job;
        }

        // POST: api/jobs
        [HttpPost]
        public async Task<ActionResult<Job>> CreateJob(Job job)
        {
            job.LastUpdated = DateTime.UtcNow;
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
            if (existingJob == null)
            {
                return NotFound();
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

            _context.Entry(existingJob).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!JobExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/jobs/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/jobs/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetJobStats()
        {
            var stats = await _context.Jobs
                .GroupBy(j => j.Status)
                .Select(g => new { status = g.Key, count = g.Count() })
                .ToListAsync();

            return Ok(new { statusBreakdown = stats });
        }

        private bool JobExists(int id)
        {
            return _context.Jobs.Any(e => e.Id == id);
        }
    }
}