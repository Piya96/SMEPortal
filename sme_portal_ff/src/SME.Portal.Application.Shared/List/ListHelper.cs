using SME.Portal.List.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace SME.Portal.List
{
    public class ListHelper
    {
        private List<ListItemDto> Lists { get; set; }
        public ListHelper(List<ListItemDto> listItems)
        {
            Lists = listItems;
        }

        public string NameFromId(string id)
        {
            return Lists.Find(x => x.ListId == id)?.Name;
        }
        public string NamesFromIds(string ids, string deliminator = ",")
        {
            if (!string.IsNullOrEmpty(ids))
            {
                char[] delim = { ',' };
                var names = new List<string>();
                foreach (string id in ids.Split(delim))
                {
                    names.Add(Lists.Find(x => x.ListId == id)?.Name);
                };
                return string.Join(deliminator, names);
            }
            else
            {
                return "";
            }
        }
    }
}
