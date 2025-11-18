using FalloutBunkerManager;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
builder.Services.AddSingleton<DeviceNetwork>();

var app = builder.Build();

app.UseCors("AllowAll");
// app.UseHttpsRedirection();  <-- Disable this line for now
app.MapControllers();

app.Run();

