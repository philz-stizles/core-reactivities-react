using AutoMapper;
using MediatR;
using Reactivities.Application.Errors;
using Reactivities.Persistence;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Reactivities.Application.Activities
{
    public class Edit
    {
        public class Command: IRequest {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly AppDbContext _context;
            private readonly IMapper _mapper;

            public Handler(AppDbContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var existingActivity = await _context.Activities.FindAsync(request.Id);
                    if (existingActivity == null)
                    {
                        throw new RestException(HttpStatusCode.NotFound, "Activity does not exist");
                    }

                    existingActivity.Title = request.Title ?? existingActivity.Title;
                    existingActivity.Description = request.Description ?? existingActivity.Description;
                    existingActivity.Category = request.Category ?? existingActivity.Category;
                    existingActivity.Date = request.Date ?? existingActivity.Date;
                    existingActivity.City = request.City ?? existingActivity.City;
                    existingActivity.Venue = request.Venue ?? existingActivity.Venue;

                    await _context.SaveChangesAsync();

                    return Unit.Value;
                }
                catch (Exception ex)
                {

                    throw new Exception(ex.Message);
                }
            }
        }
    }
}