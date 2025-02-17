using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.Portal.Integrations
{
	public class TelephoneVerificationRequest
	{
		public string IdentityNumber { get; set; }
		public string TelephoneNumber { get; set; }
	}

	public interface ICPBAppService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="identityNo"></param>
        /// <returns></returns>
        Task<string> CipcDirectorsBy(string identityNo);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="registrationNo"></param>
        /// <returns></returns>
        Task<string> CipcEnterprisesBy(string registrationNo);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="identityNo"></param>
        /// <returns></returns>
        Task<string> PersonValidationBy(string identityNo);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="identityNo"></param>
        /// <returns></returns>
        Task<string> JudgementsBy(string identityNo);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="identityNo"></param>
        /// <returns></returns>
        Task<string> DebtReviewBy(string identityNo);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="identityNo"></param>
        /// <returns></returns>
        Task<string> DefaultsBy(string identityNo);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="identityNo"></param>
        /// <param name="dob"></param>
        /// <param name="firstName"></param>
        /// <param name="lastName"></param>
        /// <param name="enquiryReason"></param>
        /// <param name="enquiryDoneBy"></param>
        /// <returns></returns>
        Task<string> CreditReport(string identityNo, string dob, string firstName, string lastName, string enquiryReason, string enquiryDoneBy);


        /// <summary>
        /// 
        /// </summary>
        /// <param name="registrationNo"></param>
        /// <param name="permissiblePurpose"></param>
        /// <param name="term"></param>
        /// <param name="sortBy"></param>
        /// <param name="maxRow"></param>
        /// <param name="filters"></param>
        /// <returns></returns>
        Task<string> CommercialDefaults(string registrationNo, string permissiblePurpose, string term, string sortBy, string maxRow, List<string> filters);


        /// <summary>
        /// 
        /// </summary>
        /// <param name="registrationNo"></param>
        /// <param name="permissiblePurpose"></param>
        /// <param name="term"></param>
        /// <param name="sortBy"></param>
        /// <param name="maxRow"></param>
        /// <param name="filters"></param>
        /// <returns></returns>
        Task<string> CommercialJudgements(string registrationNo, string permissiblePurpose, string term, string sortBy, string maxRow, List<string> filters);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="identityNo"></param>
        /// <returns></returns>
        Task<string> TelephoneById(string identityNo);

		/// <summary>
		/// 
		/// </summary>
		/// <param name="identityNo"></param>
		/// <param name="mobileNo"></param>
		/// <returns></returns>
		Task<string> TelephoneByIdAndMobile(string identityNo, string mobileNo);

		/// <summary>
		/// 
		/// </summary>
		/// <param name="identityNo"></param>
		/// <param name="mobile"></param>
		/// <returns></returns>
		Task<bool> TelephoneExistsForId(string identityNo, string mobile);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="identityNo"></param>
        /// <returns></returns>
        Task<string> ProofOfAddressBy(string identityNo);

    }
}
