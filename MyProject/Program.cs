using Vite.AspNetCore;
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);


builder.Services.AddViteServices(options =>
{
    options.Server.PackageDirectory = "./";
    options.Server.AutoRun = true;
    options.Server.Https = true;
});

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();


app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

if (app.Environment.IsDevelopment())
{
    app.UseViteDevelopmentServer(true);
}

await app.RunAsync();
