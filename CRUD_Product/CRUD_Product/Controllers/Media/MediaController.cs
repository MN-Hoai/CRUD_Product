using Microsoft.AspNetCore.Mvc;
using Service.CRUD_Product;
using static Service.CRUD_Product.MediaModel;

namespace CRUD_Product.Controllers
{
    public class MediaController : Controller
    {

        private readonly MediaCommand _mediaCommand;

        public MediaController(MediaCommand mediaCommand)
        {
            _mediaCommand = mediaCommand;
        }

        [HttpPost("/media/upload-chunk")]
        public async Task<IActionResult> UploadChunk(string fileCode, int chunkNumber, IFormFile file)
        {
            if (file == null)
                return BadRequest("Không có file chunk nào.");

            await _mediaCommand.SaveChunkAsync(fileCode, file, chunkNumber);
            return Ok(new { success = true, chunk = chunkNumber });
        }

        // Khi upload xong hết, gọi API merge
        [HttpPost("/media/merge-chunks")]
        public async Task<IActionResult> MergeChunks([FromBody] SaveChunkModel model)
        {
            var media = await _mediaCommand.MergeChunksAsync(model);
            return Ok(new { success = true, media });
        }



    }
}
