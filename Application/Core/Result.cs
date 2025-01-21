/*
 * Wrapper class to return responses from Application layer to be
 * handled by API code in the form of <<Action Results>>
 * The result can also be intepreted by a console application or 
 * any other type of client.
 */

namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T Value { get; set; }
        public string Error { get; set; }

        public static Result<T> Success(T value) 
            => new Result<T> { IsSuccess = true, Value = value };

        public static Result<T> Failure(string error) 
            => new Result<T> { IsSuccess = false, Error = error };
    }
}