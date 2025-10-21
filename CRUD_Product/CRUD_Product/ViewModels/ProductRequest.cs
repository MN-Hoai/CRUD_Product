namespace CRUD_Product.ViewModels
{
    using System.Text.Json.Serialization;

    public class ProductRequest
    {
        [JsonPropertyName("ProductId")]
        public int ProductId { get; set; }

        [JsonPropertyName("ProductName")]
        public string? ProductName { get; set; }

        [JsonPropertyName("Category")]
        public string? Category { get; set; }

        [JsonPropertyName("ProductPrice")]
        public double ProductPrice { get; set; }

        [JsonPropertyName("ProductDescription")]
        public string? ProductDescription { get; set; }
    }

}
