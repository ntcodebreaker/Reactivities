/*
 * Interface that let implementers to provide
 * a username by the means of their choice.
 */
namespace Application.Interfaces
{
    public interface IUserAccessor
    {
        string GetUsername();
    }
}