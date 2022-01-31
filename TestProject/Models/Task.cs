using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestProject.Models
{
    [Table("Task")]
    public class Task
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string PreviousState { get; set; }
        public string CurrentState { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

        //Navigation Properties
        public int AssigneeId { get; set; }
        public User Assignee { get; set; }

        public Task()
        {
            this.DateCreated = DateTime.UtcNow;
            this.DateModified = DateTime.UtcNow;
        }
    }
}
