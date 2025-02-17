﻿using Xamarin.Forms.Internals;

namespace SME.Portal.Behaviors
{
    [Preserve(AllMembers = true)]
    public interface IAction
    {
        bool Execute(object sender, object parameter);
    }
}