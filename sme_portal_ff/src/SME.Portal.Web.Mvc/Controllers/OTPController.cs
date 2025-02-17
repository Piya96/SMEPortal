using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SME.Portal.Authorization.Users.Profile;
using SME.Portal.Authorization.Users.Profile.Dto;

namespace SME.Portal.Web.Controllers
{
	public class OTPController : PortalControllerBase
	{
		private readonly ProfileAppService _profileAppService;

		public OTPController(
			ProfileAppService profileAppService
		)
		{
			_profileAppService = profileAppService;
		}

		public class SendOTPToPhoneArgs
		{
			public bool LoggedIn { get; set; }
			public int TenantId { get; set; }
			public long UserId { get; set; }
			public string PhoneNumber { get; set; }
		};

		[HttpPost]
		public async Task<JsonResult> SendOTPToPhone(
			[FromBody] SendOTPToPhoneArgs args
		)
		{
			if(AbpSession.UserId != null)
            {

            }
			if(args.LoggedIn == true)
			{
				SendVerificationSmsInputDto input = new SendVerificationSmsInputDto
				{
					PhoneNumber = args.PhoneNumber
				};
				await _profileAppService.SendVerificationSms(input);
				return Json(new { status = true });
			}
			else
			{
				SendOTPToPhoneDto input = new SendOTPToPhoneDto
				{
					TenantId = args.TenantId,
					UserId = args.UserId,
					PhoneNumber = args.PhoneNumber
				};
				var result = await _profileAppService.SendOTPToPhone(input);
				return Json(new { status = result });
			}
		}

		public class SendOTPToEmailArgs
		{
			public bool LoggedIn { get; set; }
			public int TenantId { get; set; }
			public long UserId { get; set; }
			public string EmailAddress { get; set; }
			public string Subject { get; set; }
			public string Body { get; set; }
		};

		[HttpPost]
		public async Task<JsonResult> SendOTPToEmail(
			[FromBody] SendOTPToEmailArgs args
		)
		{
			SendOTPToEmailDto input = new SendOTPToEmailDto
			{
				TenantId = args.TenantId,
				UserId = args.UserId,
				EmailAddress = args.EmailAddress,
				Subject = args.Subject,
				Body = args.Body
			};
			var result = await _profileAppService.SendOTPToEmail(input);
			return Json(new { status = result });
		}

		public class VerifyOTPArgs
		{
			public bool LoggedIn { get; set; }
			public long UserId { get; set; }
			public int TenantId { get; set; }
			public string PhoneNumber { get; set; }
			public string Code { get; set; }
		};

		[HttpPost]
		public async Task<JsonResult> VerifyOTP(
			[FromBody] VerifyOTPArgs args
		)
		{
			if(args.LoggedIn == true)
			{
				VerifySmsCodeInputDto input = new VerifySmsCodeInputDto
				{
					Code = args.Code,
					PhoneNumber = args.PhoneNumber
				};
				var result = await _profileAppService.VerifySmsCodeExt(input);
				return Json(new { status = result });
			}
			else
			{
				VerifyOTPDto input = new VerifyOTPDto
				{
					TenantId = args.TenantId,
					UserId = args.UserId,
					Code = args.Code
				};
				var result = await _profileAppService.VerifyOTP(input);
				return Json(new { status = result });
			}
		}
	}
}
