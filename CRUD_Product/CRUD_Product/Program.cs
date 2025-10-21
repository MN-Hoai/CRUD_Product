using DBContext.CURD_Product;
using Microsoft.EntityFrameworkCore;
using Service.CURD_Product;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ------------------ Add services to the container ------------------

builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true; 
    });

// Đăng ký DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký service xử lý logic sản phẩm
builder.Services.AddScoped<ProductCommand>();
builder.Services.AddScoped<ProductMany>();
builder.Services.AddScoped<ProductModel>();
builder.Services.AddScoped<ProductOne>();

// ---------------------------------------------------------------
var app = builder.Build();

// Cấu hình middleware pipeline


// ---------------- Configure the HTTP request pipeline ----------------
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// ✅ Cấu hình route mặc định
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Product}/{action=List}/{id?}");

app.Run();
