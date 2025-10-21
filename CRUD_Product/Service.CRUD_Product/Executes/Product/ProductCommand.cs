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
    public class ProductCommand
    {
        private readonly ApplicationDbContext _context;
        private const int PAGE_SIZE = 10;

        public ProductCommand(ApplicationDbContext context)
        {
            _context = context;
        }

        #region Logic Function

        public async Task<bool> DeleteProductById(int? id, List<int>? ids)
        {
            // Trường hợp xóa 1 sản phẩm
            if (id.HasValue && id != 0)
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
                if (product == null)
                    return false;

                product.Status = -1;
                _context.Products.Update(product);
                await _context.SaveChangesAsync();
                return true;
            }

            // Trường hợp xóa nhiều sản phẩm
            if ((id == null || id == 0) && ids != null && ids.Count > 0)
            {
                foreach (var i in ids)
                {
                    var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == i);
                    if (product != null)
                    {
                        product.Status = -1;
                        _context.Products.Update(product);
                    }
                }

                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }


        public async Task<bool> SaveProductService(ProductViewModel? model)
        {
            // Kiểm tra dữ liệu đầu vào
            if (model == null || string.IsNullOrWhiteSpace(model.Title))
                return false;


            ProductCategory category = null;

            // Nếu có ID thì tìm theo ID
            if (model.ProductCategoryId.HasValue && model.ProductCategoryId > 0)
            {
                category = await _context.ProductCategories
                    .FirstOrDefaultAsync(c => c.Id == model.ProductCategoryId);
            }

            if (category == null && !string.IsNullOrWhiteSpace(model.CategoryName))
            {
                string normalizedName = model.CategoryName.Trim().ToLower();
                category = await _context.ProductCategories
                    .FirstOrDefaultAsync(c => c.Title.ToLower() == normalizedName);
            }
            if (category == null)
            {
                category = new ProductCategory
                {
                    Title = model.CategoryName?.Trim() ?? "Chưa phân loại",
                    Status = 1
                };

                _context.ProductCategories.Add(category);
                await _context.SaveChangesAsync(); // ⚠ cần SaveChanges để có Id sinh ra từ DB
            }

            // --- Tạo hoặc cập nhật sản phẩm ---
            Product product;

            if (model.Id > 0)
            {
                // Cập nhật sản phẩm
                product = await _context.Products.FindAsync(model.Id);
                if (product == null)
                    return false;

                product.Title = model.Title;
                product.Description = model.Description;
                product.Avatar = model.Avatar;
                product.Content = model.Content;
                product.Keywords = model.Keywords;
                product.Price = model.Price ?? 0;
                product.Quantity = model.Quantity ?? 0;
                product.Status = model.Status ?? 1;


                product.ProductCategoryId = category.Id;

                _context.Products.Update(product);
            }
            else
            {
                // Thêm mới sản phẩm
                product = new Product
                {
                    Title = model.Title,
                    Description = model.Description,
                    Avatar = model.Avatar ?? "",
                    Content = model.Content ?? "",
                    Keywords = model.Keywords ?? "",
                    Price = model.Price ?? 0,
                    Quantity = model.Quantity ?? 0,
                    Status = model.Status ?? 1,
                    ProductCategoryId = category.Id,
                    CreateTime = DateTime.Now
                };

                await _context.Products.AddAsync(product);
            }

            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        #endregion

    }

}

