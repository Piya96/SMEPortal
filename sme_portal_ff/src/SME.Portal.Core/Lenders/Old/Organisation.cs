using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SME.Portal.Lenders.Old
{
    [Table("Organisation")]
    public class Organisation
    {
        public Organisation()
        {
            //SubjectOrganisations = new List<SubjectOrganisation>();
            //Comments = new List<OrganisationComment>();
            //OrganisationContracts = new List<OrganisationContract>();
        }

        [Key]
        public Guid Id { get; set; }
        [MaxLength(100)]
        [Required]
        public string Name { get; set; }
        public string WebsiteUrl { get; set; }
        public string Permalink { get; set; }
        public string LogoName { get; set; }
        public string FspRegistrationNumber { get; set; }
        public string NcrNumber { get; set; }
        public bool IsSection12J { get; set; }
        public string UserEmailDomain { get; set; }

        public virtual ICollection<FinanceProduct> FinanceProducts { get; set; }
        //public virtual ICollection<SubjectOrganisation> SubjectOrganisations { get; set; }
        //public virtual ICollection<CrmStatus> CrmStatuses { get; set; }
        //public virtual ICollection<OrganisationComment> Comments { get; set; }
        //[JsonIgnore]
        //public virtual ICollection<OrganisationContract> OrganisationContracts { get; set; }
    }
}
