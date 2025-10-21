using System.Text.Json.Serialization;
using DBContext.CURD_Product;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.Common;

namespace Service.CURD_Product
{
    public class ProductModel
    { 
 

        #region Viewmodel 

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
        public class ProductViewModel
        {
            public int? Id { get; set; }                   
            public string? Title { get; set; }              
            public string? Description { get; set; }         
            public string? Avatar { get; set; }           
            public string? Content { get; set; }            
            public string? Keywords { get; set; }         
            public decimal? Price { get; set; }           
            public int? Quantity { get; set; }
            public int? Status { get; set; } = 1;             
            public DateTime? CreateTime { get; set; }  = DateTime.Now;
            public int? ProductCategoryId { get; set; }     
            public int? CreateBy { get; set; }               
            public int? UpdateBy { get; set; }           

            public string? CategoryName { get; set; }        
            public string? CreatedByName { get; set; }    
            public string? UpdatedByName { get; set; }     
        }

        public class FilterListRequest
        {
            public int Page { get; set; } = 1;
            public int? CategoryId { get; set; }
            public string? KeySearch { get; set; }
            public decimal? PriceFrom { get; set; }
            public decimal? PriceTo { get; set; }
            public int? QuantityFrom { get; set; }
            public int? QuantityTo { get; set; }
            public DateTime? CreateDateFrom { get; set; }
            public DateTime? CreateDateTo { get; set; }
        }

        #endregion



    }

}

