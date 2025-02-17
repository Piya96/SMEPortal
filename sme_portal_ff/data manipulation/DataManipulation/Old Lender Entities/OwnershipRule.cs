using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DataManipulation.Old_Lender_Entities
{
    [Table("OwnershipRule")]
    public class OwnershipRule
    {
        public OwnershipRule()
        {

        }

        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid FinanceProductId { get; set; }
        public FinanceProduct FinanceProduct { get; set; }
        [Required]
        public int Num { get; set; }
        [Required]
        public string Demographic { get; set; }
        [Required]
        public string Measure { get; set; }
        public string Operator { get; set; }
        public decimal? Percentage { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        [Required]
        public DateTime LastUpdatdDate { get; set; }
    }
}
