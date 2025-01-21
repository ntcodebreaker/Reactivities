// Class to expose general information about an exception.

namespace Application.Core
{
    public class AppException
    {
        public AppException(int statusCode, string message, string details = null)
        {
            StatusCode = statusCode;
            Details = details;
            Message = message;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
    }
}