using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestProject.Models;

namespace TestProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly dbtestContext _context;

        public UsersController(dbtestContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            user.Tasks = _context.Tasks.Where(t => t.AssigneeId == user.Id).ToList();
            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // Login: api/Users/login
        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public ActionResult<User> LoginUser(User user)
        {
            // check username and password
            var _user = _context.Users.FirstOrDefault(
                    u => u.Username.Equals(user.Username)
                        && u.Password.Equals(user.Password)
                );

            if (_user == null)
            {
                return NotFound();
            }
            // set token
            _user.AuthToken = Guid.NewGuid().ToString();
            // update model
            //_context.Users.Attach(user);
            //_context.Entry(user).Property(x => x.AuthToken).IsModified = true;
            _context.Entry(_user).State = EntityState.Modified;
            _context.SaveChanges();
            return _user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserDTO user)
        {
            var _user = new User()
            {
                Username = user.Username,
                Password = user.Password
            };
            _context.Users.Add(_user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = _user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }

    public class UserDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string ?AuthToken { get; set; }
    }
}
