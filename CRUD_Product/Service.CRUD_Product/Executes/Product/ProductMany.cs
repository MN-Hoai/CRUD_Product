using System.Text.Json.Serialization;
using DBContext.CURD_Product;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Common;
using static Service.CURD_Product.ProductModel;

namespace Service.CURD_Product
{
    public class ProductMany
    {
        private readonly ApplicationDbContext _context;
        private const int PAGE_SIZE = 10;

        public ProductMany(ApplicationDbContext context)
        {
            _context = context;
        }



        #region Logic Function
        public async Task<ProductListResult> GetProducts(FilterListRequest filter)
        {
            IQueryable<Product> query = _context.Products
                .Include(p => p.ProductCategory)
                .Where(p => p.ProductCategory != null && p.Status == 1);

            // Tìm kiếm theo từ khóa
            if (!string.IsNullOrEmpty(filter.KeySearch))
            {
                string keyword = filter.KeySearch.Trim();
                string collate = "Vietnamese_CI_AI";

               
                bool isId = int.TryParse(keyword, out int id);

                query = query.Where(x =>
                    (isId && x.Id == id) || 
                    EF.Functions.Collate(x.Keywords, collate).Contains(keyword) ||
                    EF.Functions.Collate(x.Title, collate).Contains(keyword) ||
                    EF.Functions.Collate(x.ProductCategory.Title, collate).Contains(keyword) ||
                    EF.Functions.Collate(x.Description, collate).Contains(keyword)
                );
            }

        



            // Lọc theo danh mục
            if (filter.CategoryId.HasValue)
            {
                query = query.Where(p => p.ProductCategoryId == filter.CategoryId.Value);
            }

            // Lọc theo khoảng giá
            if (filter.PriceFrom.HasValue)
                query = query.Where(p => p.Price >= filter.PriceFrom.Value);

            if (filter.PriceTo.HasValue)
                query = query.Where(p => p.Price <= filter.PriceTo.Value);

            // Lọc theo số lượng
            if (filter.QuantityFrom.HasValue)
                query = query.Where(p => p.Quantity >= filter.QuantityFrom.Value);
            if (filter.QuantityTo.HasValue)
                query = query.Where(p => p.Quantity <= filter.QuantityTo.Value);

            // Lọc theo khoảng ngày tạo
            if (filter.CreateDateFrom.HasValue)
                query = query.Where(p => p.CreateTime >= filter.CreateDateFrom.Value);

            if (filter.CreateDateTo.HasValue)
                query = query.Where(p => p.CreateTime <= filter.CreateDateTo.Value);

            // Đếm tổng số bản ghi
            int totalRecords = await query.CountAsync();

            // Phân trang
            int page = filter.Page <= 0 ? 1 : filter.Page;
            int PAGE_SIZE = 10;

            // Lấy danh sách sản phẩm
            var products = await query
                .OrderByDescending(x => x.CreateTime)
                .Skip((page - 1) * PAGE_SIZE)
                .Take(PAGE_SIZE)
                .Select(p => new Product
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Avatar = p.Avatar,
                    Keywords = p.Keywords,
                    CreateTime = p.CreateTime,
                    ProductCategory = p.ProductCategory == null ? null : new ProductCategory
                    {
                        Id = p.ProductCategory.Id,
                        Title = p.ProductCategory.Title
                    }
                })
                .ToListAsync();

            // Trả về kết quả
            return new ProductListResult
            {
                Items = products,
                TotalRecords = totalRecords,
                CurrentPage = page,
                PageSize = PAGE_SIZE
            };
        }


      public async Task<List<ProductCategory>> GetAllCategories()
{
    var categories = await _context.ProductCategories
        .Where(c => c.Status == 1)
        .OrderBy(c => c.Title)
        .Select(c => new ProductCategory
        {
            Id = c.Id,
            Title = c.Title
        })
        .ToListAsync();

    return categories;
}


        #endregion

    }

}

