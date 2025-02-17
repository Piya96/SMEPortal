using SME.Portal.HubSpot.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SME.Portal.HubSpot
{
    public interface IHubSpotIntegrationService
    {
        string CreateEditEntity(HubSpotEventTriggerDto data);
    }
}
