namespace SME.Portal.Common.Dtos
{
	public enum ResultEnum
	{
		Success = 0,
		Warning = 1,
		Fail = 2,
		Exception = 3
	}

	public class ResultDto<T>
	{
		public ResultEnum Result { get; set; }
		public string Message { get; set; }
		public T Data { get; set; }
	}
}
