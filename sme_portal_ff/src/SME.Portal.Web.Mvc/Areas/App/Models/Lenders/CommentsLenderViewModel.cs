using SME.Portal.Lenders.Dtos;

using Abp.Extensions;
using System.Collections.Generic;

namespace SME.Portal.Web.Areas.App.Models.Lenders
{
    public class CommentsLenderModalViewModel
    {
        public CommentDto Comment { get; set; }

        public List<GetLenderCommentForViewDto> Comments { get; set; }

        public bool IsEditMode => false;

    }
}