using System;
using Abp.Application.Services.Dto;

namespace SME.Portal.Lenders.Dtos
{
    public class CommentDto : EntityDto
    {
        public DateTime CreationTime { get; set; }

        public string Text { get; set; }

        public int LenderId { get; set; }

        public long UserId { get; set; }


    }
}