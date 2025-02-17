using System.Collections.Generic;

namespace SME.Portal.Web.Areas.App.Models.Common.Partial
{
	public class PartialBase
	{
		public PartialBase()
		{
			Name = "";
			Label = "";
			Scope = "";
			Col = "col-xl-12";
			Info = null;
			SubText = "";
			Show = true;
		}

		// Used to generate name="", id="", and an id="" that is optionally used for custom form validation error messages.
		// Mandatory.
		public string Name { get; set; }
		// Used to label ( DIRECTLY ABOVE THE INPUT CONTROL ) the input in a user friendly, and descriptive way.
		// Optional. Defaults to empty string.
		// Highly recommended to set this to something so the user knows what they are clicking on.
		public string Label { get; set; }
		// Used to scope the Name in the event of multiple controls with the same name.
		// Optional. Defaults to "".
		public string Scope { get; set; }
		// Used to spcify the width of the column within which the radio group will be rendered.
		// Optional. Defaults to col-12.
		public string Col { get; set; }
		public string Info { get; set; }
		public string SubText { get; set; }
		public bool Show { get; set; }
	}

	public class Date_N_Top
	{
		public Date_N_Top()
		{
			Scope = "";
			Col = "col-xl-6";
			SubText = "";
		}

		public Date_N_Top(
			string name,
			string label
		) : base()
		{
			Name = name;
			Label = label;
		}
		// Used to scope the Name in the event of multiple controls with the same name.
		// Optional. Defaults to "".
		public string Scope { get; set; }
		// Used to generate name="", id="", and an id="" that is optionally used for custom form validation error messages.
		// Mandatory.
		public string Name { get; set; }
		// Used to label ( DIRECTLY ABOVE THE INPUT CONTROL ) the input in a user friendly, and descriptive way.
		// Optional. Defaults to empty string.
		// Highly recommended to set this to something so the user knows what they are clicking on.
		public string Label { get; set; }
		// Used to spcify the width of the column within which the radio group will be rendered.
		// Optional. Defaults to col-xl-12.
		public string Col { get; set; }
		public string SubText { get; set; }
	};

	public class Input_N_LT_RT : PartialBase
	{
		public Input_N_LT_RT()
			: base()
		{
			LeftText = null;
			RightText = null;
		}
		// Used along with a pre-pended, fixed text block before the input.
		// Optional.
		public string LeftText { get; set; }
		// Used along with a appended, fixed text block before the input.
		// Optional.
		public string RightText { get; set; }
	};

	public class Input_N_LS_RS : PartialBase
	{
		public Input_N_LS_RS()
			: base()
		{
			LeftSelect = null;
			RightSelect = null;
		}
		// Used along with a pre-pended, select dropdown before the input.
		// Optional.
		public string LeftSelect { get; set; }
		// Used along with a appended, select dropdown before the input.
		// Optional.
		public string RightSelect { get; set; }
	};

	public class InputWithRightIconButton : PartialBase
	{
		public InputWithRightIconButton()
			: base()
		{
			ButtonIcon = null;
			ButtonText = null;
			PlaceholderText = null;
		}
		// Optional placeholder text.
		public string PlaceholderText { get; set; }
		// Optional icon to the left of button text.
		public string ButtonIcon { get; set; }
		// Optional button text to the right of the icon.
		public string ButtonText { get; set; }
	};

	// Html control with label on the left and input control on the right with optional text block on left and / or right of the input control.
	// M : ColLeft. N : ColRight. LT : Text for left text block. RT : Text for right text block. Left : Label renders on the left.
	public class Input_MN_LT_RT_Left : PartialBase
	{
		public Input_MN_LT_RT_Left()
			: base()
		{
			ColLeft = "col-xl-6";
			ColRight = "col-xl-6";
			LeftText = null;
			RightText = null;
		}
		// Used to specify the width of the column on the left where the Label text will be rendered.
		// Optional. Defaults to col-xl-6.
		public string ColLeft { get; set; }
		// Used to specify the width of the column on the right where the input box will be rendered.
		// Optional. Defaults to col-xl-6.
		public string ColRight { get; set; }
		// Used along with a pre-pended, fixed text block before the input.
		// Optional.
		public string LeftText { get; set; }
		// Used along with a appended, fixed text block before the input.
		// Optional.
		public string RightText { get; set; }
	};

	public class Select_N_LT_RT : PartialBase
	{
		public Select_N_LT_RT()
			: base()
		{
			LeftText = null;
			RightText = null;
			Placeholder = null;
		}
		// Used along with a pre-pended, fixed text block before the input.
		// Optional.
		public string LeftText { get; set; }
		// Used along with a appended, fixed text block before the input.
		// Optional.
		public string RightText { get; set; }

		public string Placeholder { get; set; }
	};

	public class Radio_N_Top : PartialBase
	{
		public Radio_N_Top()
			: base()
		{
			Radio = new string[,] { { "Yes", "Yes" }, { "No", "No" } };
		}
		// Used to specify label and value for each individual radio button.
		// Optional. Defaults to [{"Yes", "Yes"}, {"No", "No"}].
		// Example. 3 Radio buttons would be defined as...[{"Yes", "Yes"}, {"No", "No"}, {"Maybe", "Maybe"}], noting that the actual
		// {label, value} values are up to the user and need not match that in the example.
		public string [,] Radio { get; set; }
	};

}
