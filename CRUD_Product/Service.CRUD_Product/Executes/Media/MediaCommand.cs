using DBContext.CURD_Product;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;


using static Service.CRUD_Product.MediaModel;

namespace Service.CRUD_Product
{
    public class MediaCommand
    {
        private readonly ApplicationDbContext _context;
        private readonly string _uploadRoot;

        public MediaCommand(ApplicationDbContext context)
        {
            _context = context;
            _uploadRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "media", "images");
        }

        public async Task SaveChunkAsync(string fileCode, IFormFile chunkFile, int chunkNumber)
        {
            // Thư mục tạm theo ngày
            string dateFolder = DateTime.Now.ToString("yyyy/MM/dd");
            string tempFolder = Path.Combine(_uploadRoot, "temp", dateFolder, fileCode);

            if (!Directory.Exists(tempFolder))
                Directory.CreateDirectory(tempFolder);

            string chunkPath = Path.Combine(tempFolder, $"{chunkNumber}.part");

            using (var stream = new FileStream(chunkPath, FileMode.Create))
            {
                await chunkFile.CopyToAsync(stream);
            }
        }

        public async Task<MediaFile> MergeChunksAsync(SaveChunkModel model)
        {
            string dateFolder = DateTime.Now.ToString("yyyy/MM/dd");
            string tempFolder = Path.Combine(_uploadRoot, "temp", dateFolder, model.FileCode);
            string finalFolder = Path.Combine(_uploadRoot, dateFolder);

            if (!Directory.Exists(finalFolder))
                Directory.CreateDirectory(finalFolder);

            string finalPath = Path.Combine(finalFolder, model.FileName);

            using (var fs = new FileStream(finalPath, FileMode.Create))
            {
                for (int i = 1; i <= model.Count; i++)
                {
                    string chunkPath = Path.Combine(tempFolder, $"{i}.part");

                    byte[] bytes = await File.ReadAllBytesAsync(chunkPath);
                    await fs.WriteAsync(bytes, 0, bytes.Length);
                    File.Delete(chunkPath);
                }
            }

            Directory.Delete(tempFolder, true);

            var info = new FileInfo(finalPath);
            var media = new MediaFile
            {
                FileCode = model.FileCode,
                FileName = model.FileName,
                FilePath = Path.Combine("images", dateFolder, model.FileName).Replace("\\", "/"),
                MimeType = Path.GetExtension(model.FileName),
                FileSize = info.Length,
                UploadDate = DateTime.Now,
                UploadedBy = 1
                
            };

            _context.MediaFiles.Add(media);
            await _context.SaveChangesAsync();

            return media;
        }

    }
}
