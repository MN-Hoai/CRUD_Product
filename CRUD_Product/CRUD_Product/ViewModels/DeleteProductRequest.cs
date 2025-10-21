namespace CRUD_Product.ViewModels
{
    public class DeleteProductRequest
    {
        public int? Id { get; set; } = 0;
        public List<int>? Ids { get; set; }
    }
}
