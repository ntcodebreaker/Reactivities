/*
 * Class to represent the pagination parameters of an activity collection.
 * This extension of PagingParams includes the predicates used to 
 * configure predefined filters for the activities.
 */
using Application.Core;

namespace Application.Activities
{
    public class ActivityParams : PagingParams
    {
        public bool IsGoing { get; set; }
        public bool IsHost { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}