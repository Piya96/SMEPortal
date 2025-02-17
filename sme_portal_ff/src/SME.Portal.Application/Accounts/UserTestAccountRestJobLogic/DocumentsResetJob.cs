using Abp.Threading;
using SME.Portal.Documents;
using SME.Portal.Documents.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SME.Portal.Accounts.UserTestAccountRestJobLogic
{
    public class DocumentsResetJob
    {
        private readonly DocumentsAppServiceExt _documentsAppServiceExt;
        private List<GetDocumentForViewDto> _Documents;

        public DocumentsResetJob(DocumentsAppServiceExt documentsAppServiceExt)
        {
            _documentsAppServiceExt = documentsAppServiceExt;
        }

        public DocumentsResetJob GetDocuments(long userId)
        {
            var documents = AsyncHelper.RunSync(() => _documentsAppServiceExt.GetAllByUser(new GetAllDocumentsInput()
            {
                UserIdFilter = userId
            }));

            _Documents = documents.Items.ToList();

            return this;
        }

        public DocumentsResetJob DeleteDocuments()
        {
            foreach (var document in _Documents)
            {
                AsyncHelper.RunSync(() => _documentsAppServiceExt.HardDeleteDocumentAsync(document.Document.BinaryObjectId));
            }

            return this;
        }
    }
}
