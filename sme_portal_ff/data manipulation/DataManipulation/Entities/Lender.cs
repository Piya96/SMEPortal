using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DataManipulation.Entities
{
	[Table("Lenders")]
	public class Lender
	{
		public int Id { get; set; }

		[Required]
		[StringLength(100, MinimumLength = 5)]
		public virtual string Name { get; set; }

		public virtual string WebsiteUrl { get; set; }

		public virtual string Permalink { get; set; }

		public virtual string LogoName { get; set; }

		public virtual string FSPRegistrationNumber { get; set; }

		public virtual bool IsSection12J { get; set; }

		[StringLength(20, MinimumLength = 2)]
		public virtual string NcrNumber { get; set; }

		//
		// Summary:
		//     Is this entity Deleted?
		public virtual bool IsDeleted { get; set; }
		//
		// Summary:
		//     Which user deleted this entity?
		public virtual long? DeleterUserId { get; set; }
		//
		// Summary:
		//     Deletion time of this entity.
		public virtual DateTime? DeletionTime { get; set; }

		//
		// Summary:
		//     Last modification date of this entity.
		public virtual DateTime? LastModificationTime { get; set; }
		//
		// Summary:
		//     Last modifier user of this entity.
		public virtual long? LastModifierUserId { get; set; }

		//
		// Summary:
		//     Creation time of this entity.
		public virtual DateTime CreationTime { get; set; }
		//
		// Summary:
		//     Creator of this entity.
		public virtual long? CreatorUserId { get; set; }


	}
}
