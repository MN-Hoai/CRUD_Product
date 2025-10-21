using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CRUD_Product
{
    public class MediaModel
    {
        public class SaveChunkModel
        {
            public string FileCode { get; set; }
            public string FileName { get; set; }
            public int Count { get; set; } // số chunk
        }
    }
}
