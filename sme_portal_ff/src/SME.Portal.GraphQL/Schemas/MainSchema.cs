using Abp.Dependency;
using GraphQL;
using GraphQL.Types;
using SME.Portal.Queries.Container;

namespace SME.Portal.Schemas
{
    public class MainSchema : Schema, ITransientDependency
    {
        public MainSchema(IDependencyResolver resolver) :
            base(resolver)
        {
            Query = resolver.Resolve<QueryContainer>();
        }
    }
}