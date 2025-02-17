using Abp.BackgroundJobs;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using SME.Portal.Authorization.Users;
using SME.Portal.Company.Dtos;
using SME.Portal.Company.Exporting;
using SME.Portal.Helpers;
using SME.Portal.HubSpot;
using SME.Portal.HubSpot.Dtos;
using SME.Portal.Qlana;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.Company
{
    public class OwnersAppServiceExt : OwnersAppService
    {
        private readonly IRepository<Owner, long> _ownerRepository;
        private readonly IRepository<User, long> _lookup_userRepository;
        private readonly IAbpSession _session;
        private readonly IBackgroundJobManager _backgroundJobManager;
        private readonly IOwnersExcelExporter _ownersExcelExporter;
        private readonly IOwnerCompanyMappingAppService _ownerCompanyMappingAppService;

        public OwnersAppServiceExt( IRepository<Owner, long> ownerRepository,
                                    IRepository<User, long> lookup_userRepository,
                                    IAbpSession session,
                                    IBackgroundJobManager backgroundJobManager,
                                    IOwnersExcelExporter ownersExcelExporter,
                                    IOwnerCompanyMappingAppService ownerCompanyMappingAppService) 
            :
            base(ownerRepository, ownersExcelExporter, lookup_userRepository)
        {
            _ownerRepository = ownerRepository;
            _lookup_userRepository = lookup_userRepository;
            _session = session;
            _backgroundJobManager = backgroundJobManager;
            _ownersExcelExporter = ownersExcelExporter;
            _ownerCompanyMappingAppService = ownerCompanyMappingAppService;
        }

        public override async Task<long> CreateOrEdit(CreateOrEditOwnerDto input)
        {
            #region Validation and Business rules

            // check the user session is valid
            if (!AbpSession.UserId.HasValue)
                throw new SystemException("There is no current user session for the request");

			// if an owner exists with the same identitynumber throw
			//if (_ownerRepository.GetAll().Any(x => x.IdentityOrPassport == input.IdentityOrPassport))
			//    throw new SystemException($"Owner with matching IdentityOrPassport already exists");

			if(input.Id.HasValue == true && input.Id.Value > 0)
			{

			}
			else
			{
				if(_ownerRepository.GetAll().Any(x => x.UserId == AbpSession.UserId))
				{
					throw new SystemException($"User with matching Id already exists");
				}
			}

			#endregion

			// create/edit the Owner entity
			input.UserId = AbpSession.UserId.Value;
            var ownerId = await base.CreateOrEdit(input);
            var owner = await _ownerRepository.GetAsync(ownerId);

            #region Queue the job to add Owner/contact to crm
            
            await _backgroundJobManager.EnqueueAsync<HubSpotEventTriggerBackgroundJob, HubSpotEventTriggerDto>(new HubSpotEventTriggerDto()
            {
                TenantId = (int)AbpSession.TenantId,
                OwnerId = owner.Id,
                EventType = HubSpotEventTypes.CreateEdit,
                HSEntityType = HubSpotEntityTypes.contacts,
                UserJourneyPoint = UserJourneyContextTypes.OnboardingCompleted
            }, BackgroundJobPriority.Normal);

            #endregion

            #region Queue the job to add Owner/contact to Qlana

            //await _backgroundJobManager.EnqueueAsync<QLanaCreateUpdateBackgroundJob, QlanaEventTriggerDto>(new QlanaEventTriggerDto()
            //{
            //    TenantId = (int)AbpSession.TenantId,
            //    OwnerId = owner.Id,
            //    EventType = QlanaEntityTypes.Contact
            //}, BackgroundJobPriority.Normal);

            #endregion

            return ownerId;
        }

        protected override async Task<long> Create(CreateOrEditOwnerDto input)
        {
			input.UserId = (int) AbpSession.UserId;
			var owner = ObjectMapper.Map<Owner>(input);

            if (AbpSession.TenantId != null)
            {
                owner.TenantId = (int)AbpSession.TenantId;
            }

            return await _ownerRepository.InsertAndGetIdAsync(owner);
        }

        protected override async Task<long> Update(CreateOrEditOwnerDto input)
        {
            var owner = await _ownerRepository.FirstOrDefaultAsync((long)input.Id);
            ObjectMapper.Map(input, owner);

            return owner.Id;
        }

        public async Task<GetOwnerForViewDto> GetOwnerForViewByUser()
        {
            long userId = (long)_session.UserId;
            var ownerDto = await _ownerRepository.FirstOrDefaultAsync(x => x.UserId == userId);
            if (ownerDto == null)
            {
                return new GetOwnerForViewDto { Owner = null, UserName = null };
            }
            else
            {
                var output = new GetOwnerForViewDto { Owner = ObjectMapper.Map<OwnerDto>(ownerDto) };

                output.UserName = ownerDto?.Name?.ToString();

                return output;
            }
        }

        public async Task<GetOwnerForEditOutput> GetOwnerForEditByUser()
        {
            long userId = (long)_session.UserId;
            var ownerDto = await _ownerRepository.FirstOrDefaultAsync(x => x.UserId == userId);
            if (ownerDto == null)
            {
                return new GetOwnerForEditOutput { Owner = null, UserName = null };
            }
            else
            {
                var output = new GetOwnerForEditOutput { Owner = ObjectMapper.Map<CreateOrEditOwnerDto>(ownerDto) };
                output.UserName = ownerDto?.Name?.ToString();
                return output;
            }
        }
        public async Task<GetOwnerForViewDto> GetOwnerForViewByUserId(long userId)
        {
            var owner = _ownerRepository.GetAll().Where(x => x.UserId == userId).FirstOrDefault();

            if (owner == null)
                return null;

            var output = new GetOwnerForViewDto { Owner = ObjectMapper.Map<OwnerDto>(owner) };

            var _lookupUser = await _lookup_userRepository.FirstOrDefaultAsync(output.Owner.UserId);
            output.UserName = _lookupUser?.Name?.ToString();

            return output;
        }
    }
}
