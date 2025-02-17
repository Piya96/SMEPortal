using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Threading.BackgroundWorkers;
using Abp.Threading.Timers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using SME.Portal.Authorization.Users;
using SME.Portal.Url;
using System;
using System.Linq;
using SME.Portal.MultiTenancy;
using Abp.Auditing;
using Microsoft.Extensions.Configuration;
using SME.Portal.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Abp.Net.Mail;
using Abp.Authorization.Users;
using Abp.Authorization;
using System.Collections.Generic;

namespace SME.Portal.Accounts
{
	public class UserAccessRevokeJob :
		PeriodicBackgroundWorkerBase,
		ISingletonDependency	
	{
		public IAppUrlService AppUrlService { get; set; }

		private readonly IEmailSender _emailSender;
		private readonly IUnitOfWorkManager _unitOfWorkManager;
		private readonly IRepository<AuditLog, long> _auditLogRepository;
		private readonly IRepository<Tenant> _tenantRepository;
		private readonly IRepository<User, long> _userRepository;
		private readonly IUserEmailer _userEmailer;
		private readonly IWebHostEnvironment _webHostEnvironment;
		private readonly IConfigurationRoot _appConfiguration;
		private readonly IRepository<UserLoginAttempt, long> _userLoginAttemptRepository;

		public UserAccessRevokeJob(
			AbpTimer timer,
			IEmailSender emailSender,
			IUnitOfWorkManager unitOfWorkManager,
			IRepository<AuditLog, long> auditLogRepository,
			IRepository<Tenant> tenantRepository,
			IRepository<User, long> userRepository,
			IUserEmailer userEmailer,
			IWebHostEnvironment webHostEnvironment,
			IRepository<UserLoginAttempt, long> userLoginAttemptRepository
		)
			: base(timer)
		{
			AppUrlService = NullAppUrlService.Instance;
			_emailSender = emailSender;
			_unitOfWorkManager = unitOfWorkManager;
			_auditLogRepository = auditLogRepository;
			_tenantRepository = tenantRepository;
			_userRepository = userRepository;
			_userEmailer = userEmailer;
			_webHostEnvironment = webHostEnvironment;
			_appConfiguration = _webHostEnvironment.GetAppConfiguration();
			_userLoginAttemptRepository = userLoginAttemptRepository;

			string period = _appConfiguration.GetValue<string>("UserAccessRevokeJob:JobInterval") ?? "86400";
			Timer.Period = Int32.Parse(period);
		}

		[UnitOfWork]
		protected override void DoWork()
		{
			var isProduction = _webHostEnvironment.IsProduction();
			var isStaging = _webHostEnvironment.IsStaging();

			//Logger.Warn($"UserAccessRevokeJob is in production:{isInProduction}");
			int warningTimeoutDays = Int32.Parse(_appConfiguration["UserAccessRevokeJob:WarningTimeout:Days"]);
			int warningTimeoutHours = Int32.Parse(_appConfiguration["UserAccessRevokeJob:WarningTimeout:Hours"]);
			int warningTimeoutMinutes = Int32.Parse(_appConfiguration["UserAccessRevokeJob:WarningTimeout:Minutes"]);

			int revokeTimeoutDays = Int32.Parse(_appConfiguration["UserAccessRevokeJob:RevokeTimeout:Days"]);
			int revokeTimeoutHours = Int32.Parse(_appConfiguration["UserAccessRevokeJob:RevokeTimeout:Hours"]);
			int revokeTimeoutMinutes = Int32.Parse(_appConfiguration["UserAccessRevokeJob:RevokeTimeout:Minutes"]);

			string tenantsStr = _appConfiguration["UserAccessRevokeJob:TenantList"];
			string[] tenantArray = tenantsStr.Split(",");

			string emailStr = _appConfiguration["UserAccessRevokeJob:TestData:UserEmails"];
			string [] emailArray = emailStr.Split(",");
			bool isTest = bool.Parse(_appConfiguration["UserAccessRevokeJob:TestData:IsTest"]);

			var warningDate = DateTime.Now.AddDays(-warningTimeoutDays);
			warningDate = warningDate.AddHours(-warningTimeoutHours);
			warningDate = warningDate.AddMinutes(-warningTimeoutMinutes);

			var revokeDate = DateTime.Now.AddDays(-revokeTimeoutDays);
			revokeDate = revokeDate.AddHours(-revokeTimeoutHours);
			revokeDate = revokeDate.AddMinutes(-revokeTimeoutMinutes);

			foreach(var tenantStr in tenantArray)
			{
				int tenantId = Int32.Parse(tenantStr);
				var tenant = _tenantRepository.Get(tenantId);
				using(CurrentUnitOfWork.SetTenantId(tenantId))
				{

					var users = _userRepository.GetAll().Where(c =>
						c.IsActive == true &&
						c.IsEmailConfirmed == true &&
						c.NormalizedUserName.ToLower() != "admin").ToList();

					foreach(var user in users)
					{
						bool skip = (isTest == true ? emailArray.Contains(user.EmailAddress) == false : false);
						if(skip == true)
                        {
							continue;
                        }

						var login = _userLoginAttemptRepository.GetAll().Where(c =>
							c.UserId == user.Id &&
							c.TenantId == tenantId &&
							c.Result == AbpLoginResultType.Success).OrderByDescending(c => c.CreationTime).First();

						if(user.PropertiesJson == null)
						{
							dynamic temp = new JObject();
							user.PropertiesJson = JsonConvert.SerializeObject(temp);
						}
						bool jsonSave = false;
						var json = JsonConvert.DeserializeObject<dynamic>(user.PropertiesJson);
						if(json["user-revoked"] == null)
						{
							dynamic temp = new JObject();
							temp["warning-sent"] = false;
							temp["revocation-sent"] = false;
							json["user-revoked"] = temp;
							jsonSave = true;
						}
						if(login.CreationTime <= revokeDate)
						{
							json["user-revoked"]["revocation-sent"] = true;
							user.PropertiesJson = JsonConvert.SerializeObject(json);
							user.IsActive = false;
							_userRepository.Update(user);
							CurrentUnitOfWork.SaveChanges();
							if(isProduction == true || isStaging == true)
							{
								Logger.Warn($"UserAccessRevokeJob warning email sent to user {user.EmailAddress}.");

								string subject =
									"Important Notice regarding your access to the " + tenant.TenancyName + " system.";

								string body =
									"<p>There has been no recent activity on your account.If you do not log into your account within the next " + revokeTimeoutDays.ToString() + " days, your access will be deactivated by the system for security reasons.</p>" +
									"<p>Contact us on 087 500 9950 if you require assistance logging in.</p>";

								_emailSender.Send(user.EmailAddress, subject, body);
							}
							continue;
						}
						bool WarningSent = json["user-revoked"]["warning-sent"];
						if(login.CreationTime <= warningDate && WarningSent == false)
						{
							json["user-revoked"]["warning-sent"] = true;
							user.PropertiesJson = JsonConvert.SerializeObject(json);
							_userRepository.Update(user);
							CurrentUnitOfWork.SaveChanges();
							if(isProduction == true || isStaging == true)
							{
								Logger.Warn($"UserAccessRevokeJob revocation email sent to user {user.EmailAddress}.");

								string subject =
									"Important Notice regarding your access to the " + tenant.TenancyName + " system.";

								string body =
									"<p>There has been no recent activity on your account, and the system has deactivated you for security reasons.</p>" +
									"<p>To reactivate your account, please log in to the system and follow the instructions to guide you through the process.</p>" +
									"<p>Contact us on 087 500 9950 if you require assistance logging in.</p>";

								_emailSender.Send(user.EmailAddress, subject, body);
							}
							continue;
						}
						if(jsonSave == true)
                        {
							user.PropertiesJson = JsonConvert.SerializeObject(json);
							_userRepository.Update(user);
							CurrentUnitOfWork.SaveChanges();
						}
					}
				}
			}
		}
	}
}
