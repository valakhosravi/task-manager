using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestProject.Models
{
    [Table("User")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(25)]
        public string Username { get; set; }
        [Required, MaxLength(25)]
        public string Password { get; set; }
        [MaxLength(100)]
        public string AuthToken { get; set; }

        //Navigation Properties
        public List<Task> Tasks { get; set; }
    }
}
