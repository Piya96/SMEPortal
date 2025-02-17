using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Editions;
using Abp.Application.Features;
using Abp.Domain.Repositories;

namespace SME.Portal.Editions
{
    public class EditionManager : AbpEditionManager
    {
        public const string DefaultEditionName = "Standard";

        public EditionManager(
            IRepository<Edition> editionRepository,
            IAbpZeroFeatureValueStore featureValueStore)
            : base(
                editionRepository,
                featureValueStore
            )
        {
        }

        public async Task<List<Edition>> GetAllAsync()
        {
            return await EditionRepository.GetAllListAsync();
        }

        public async Task<Edition> GetUpgradeEdition(int editionId)
        {
            var currentEdition = (SubscribableEdition)await EditionRepository.GetAsync(editionId);

            if (currentEdition.UpgradeEditionId.HasValue)
                return await EditionRepository.GetAsync(currentEdition.UpgradeEditionId.Value);

            return null;
        }
    }
}
