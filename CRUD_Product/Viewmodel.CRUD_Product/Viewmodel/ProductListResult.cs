using DBContext.CURD_Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Viewmodel.CRUD_Product
{
    public class ProductListResult
    {
        [JsonPropertyName("items")]
        public List<Product> Items { get; set; } = new();

        [JsonPropertyName("totalRecords")]
        public int TotalRecords { get; set; }

        [JsonPropertyName("currentPage")]
        public int CurrentPage { get; set; }

        [JsonPropertyName("pageSize")]
        public int PageSize { get; set; }
    }
}
