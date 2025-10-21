using System.Text.Json.Serialization;
using DBContext.CURD_Product;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Common;

namespace Service.CURD_Product
{
    public class ProductOne
    {
        private readonly ApplicationDbContext _context;
        private const int PAGE_SIZE = 10;

        public ProductOne(ApplicationDbContext context)
        {
            _context = context;
        }


        #region Logic Function

        public async Task<Product?> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductCategory)
                .FirstOrDefaultAsync(p => p.Id == id && p.Status == 1);

            return product;
        }

      
        #endregion

    }

}

