using Azure.Core;
using CRUD_Product.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Service.CURD_Product;
using System.Net.WebSockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using static Service.CURD_Product.ProductModel;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CRUD_Product.Controllers
{
    public class ProductController : Controller
    {
        private readonly ProductCommand _productCommand;
        private readonly ProductMany _productMany;
        private readonly ProductOne _productOne;

        public ProductController(ProductCommand productCommand, ProductMany productMany, ProductOne productOne)
        {
            _productCommand = productCommand;
            _productMany = productMany;
            _productOne = productOne;
        }


        public IActionResult List()
        {
            return View();
        }
        public IActionResult _PopupEditAdd()
        {
            return PartialView("_PopupEditAdd");
        }
        public IActionResult _PopupView()
        {
            return PartialView("_PopupView");
        }

        #region API Funtion
        //hàm lấy sản phẩm theo bộ lọc
        [HttpGet]
        [Route("api/product")]
        public async Task<IActionResult> GetProducts([FromQuery] FilterListRequest request)
        {
            try
            {
                var filter = new FilterListRequest
                {
                    Page = request.Page,
                    CategoryId = request.CategoryId,
                    KeySearch = request.KeySearch,
                    PriceFrom = request.PriceFrom,
                    PriceTo = request.PriceTo,
                    QuantityFrom = request.QuantityFrom,
                    QuantityTo = request.QuantityTo,
                    CreateDateFrom = request.CreateDateFrom,
                    CreateDateTo = request.CreateDateTo,
                };

                var results = await _productMany.GetProducts(filter);

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách sản phẩm thành công",
                    data = new
                    {
                        items = results.Items,
                        currentPage = results.CurrentPage,
                        pageSize = results.PageSize,
                        totalRecords = results.TotalRecords
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }



        // hàm lấy danh mục sản phẩm
        [HttpGet]
        [Route("api/category")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _productMany.GetAllCategories();
            return Ok(new { success = true, message = "Lấy danh mục thành công", data = categories });
        }

        //Hàm lấy chi tiết một sản phẩm theo ID
        [HttpGet]
        [Route("api/product/view/{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var result = await _productOne.GetProductById(id);
            if (result == null)
                return BadRequest(new { success = false, message = "Không có dữ liệu" });

            return Ok(
                new
                {

                    success = true,
                    message = "Lấy sản phẩm thành công",
                    data = result
                });

        }

        //Hàm chỉnh sửa và tạo mới sản phẩm
        [HttpPost]
        [Route("api/product/save")]
        public async Task<IActionResult> SaveProduct([FromBody] ProductViewModel? request)
        {
            // 1️ Kiểm tra null từ request
            if (request == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Không có dữ liệu được gửi lên"
                });
            }

            // 2️ Kiểm tra dữ liệu model có hợp lệ không
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Dữ liệu không hợp lệ",
                    errors = ModelState.Values
                                       .SelectMany(v => v.Errors)
                                       .Select(e => e.ErrorMessage)
                });
            }

            var viewModel = new ProductViewModel
            {
                Id = request.Id,
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                ProductCategoryId = request.ProductCategoryId,
                Quantity = request.Quantity,
                CategoryName = request.CategoryName,
              //  Avatar = request.Avatar,
                Keywords = request.Keywords,

                
            };

            try
            {
                var result = await _productCommand.SaveProductService(viewModel);


                if (result)
                {
                    string action = request.Id > 0 ? "Cập nhật" : "Thêm mới";
                    return Ok(new
                    {
                        success = true,
                        message = $"{action} sản phẩm thành công"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Không có thay đổi thông tin sản phẩm"
                    });
                }
            }
            catch (Exception)
            {

                return StatusCode(500, new { success = false, message = "Lỗi kết nối server" });
            }
        }

        //Hàm xóa sản phẩm
        [HttpPost("api/product/delete")]
        public async Task<IActionResult> DeleteProduct([FromBody] DeleteProductRequest request)
        {
            try
            {
                var result = await _productCommand.DeleteProductById(request.Id, request.Ids);

                if (result)
                    return Ok(new { success = true, message = "Xóa sản phẩm thành công" });

                return BadRequest(new { success = false, message = "Xóa sản phẩm không thành công" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { success = false, message = "Lỗi kết nối server" });
            }
        }
        #endregion

    }
}
