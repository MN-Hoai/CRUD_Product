$(function () {
    // Khởi động trang
    loadCategories("#categoryFilter");
    loadProducts(1);
   
  
    $("#btnSearch").on("click", function () {

      
        applyFilters(1);
    });
    $("#btnReset").on("click", resetFilters);
    $("#keyword").on("keypress", function () {
    
        const timer = setTimeout(applyFilters(1), 500);
        $(this).data("timer", timer);
    });

    // Khi thay đổi danh mục, giá, ngày hoặc số lượng
    $("#categoryFilter, #priceFrom, #priceTo, #createDateFrom, #createDateTo").on("change", function () {
      
        applyFilters(1);
    });

    // Khi nhập số lượng (Từ - Đến)
    $("#quantityFrom, #quantityTo").on("input", function () {
        clearTimeout($(this).data("timer"));
        
        const timer = setTimeout(applyFilters(1), 500);
        $(this).data("timer", timer);
    });



    // Xem chi tiết sản phẩm
    $(document).on("click", ".btn-view",  function () {
        const id = $(this).data("id");
        onViewProduct(id);
    });

    //Khi thay đổi danh mục trong pop-up
    $("#categoryFilterOption-v, #categoryFilterOption").on("change", function () {

        const viewData = $("#categoryFilterOption-v").val();
        const EditData = $("#categoryFilterOption").val();
      
        $("#productCategory-v").val(viewData);
        $("#productCategory").val(EditData);
    });





    //Thêm sản phẩm 
    $("#btnAdd").on("click", function () {
        resetProductModal("Thêm sản phẩm mới", true, "Lưu mới", false);
    });

    // Sửa sản phẩm
    $(document).on("click", ".btn-edit",  function () {
        const id = $(this).data("id");
        onEditView(id);
        
      
    });

    // Xóa sản phẩm
    $(document).on("click", ".btn-delete",  function () {
        const id = $(this).data("id");
        onDeleteProduct(id);
    });

    // Lưu chỉnh sửa
    $("#btnSaveEdit").on("click", function () {
        const data = {
            Id: Number($("#productId").val()) || 0,
            ProductCategoryId: Number($("#productCategoryId").val()) || 0,
            Title: ($("#productTitle").val() || "").trim(),
            CategoryName: ($("#productCategory").val() || "").trim(),
            Price: parseFloat($("#productPrice").val()) || 0,
            Quantity: Number($("#productQuantity").val()) || 0,
            Keywords: ($("#productKeywords").val() || "").trim(),
            Description: ($("#productDescription").val() || "").trim(),
          //  ProductAvatar: ($("#productAvatar").attr("src") || "").trim()
        };
      
            AddAndEditProduct(data);
   
    });
    const $input = $("#keyword");
    const $status = $("#statusText");

    // Kiểm tra hỗ trợ
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        $status.text("Trình duyệt không hỗ trợ Web Speech API (dùng Chrome/Edge).");
        $btn.prop("disabled", true).css("opacity", 0.6);
        return;
    }

    let recognition = null;
    let recording = false;

    function startRecognition() {
        recognition = new SpeechRecognition();
        recognition.lang = "vi-VN";
        recognition.interimResults = true; // hiển thị kết quả tạm thời khi nói
        recognition.continuous = false; // dừng khi người nói tạm ngừng; muốn nghe liên tục set true

        recognition.onstart = function () {
            recording = true;
            $btn.addClass("recording");
            $status.text("Đang nghe... (nói để chuyển thành văn bản)");
        };

        recognition.onresult = function (event) {
            // Lấy transcript: có thể có nhiều kết quả, ta ghép interim và final
            let interim = "";
            let final = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }

            // Hiển thị interim nếu có, ưu tiên final
            if (final.trim().length > 0) {
                $input.val(final);
              
            
                const timer = setTimeout(applyFilters(1), 500);
                $(this).data("timer", timer);
            } else if (interim.trim().length > 0) {
                $input.val(interim);
                $status.text("Nhận tạm thời...");
            }
        };

        recognition.onerror = function (event) {
            console.warn("Recognition error:", event.error);
            if (event.error === "no-speech") {
                $status.text("Không nghe thấy giọng nói — thử nói to hơn.");
            } else if (event.error === "not-allowed" || event.error === "permission-denied") {
                $status.text("Quyền micro bị chặn. Kiểm tra quyền trình duyệt.");
            } else {
                $status.text("Lỗi nhận dạng: " + event.error);
            }
        };

        recognition.onend = function () {
            // Khi dừng, tắt hiệu ứng
            recording = false;
            $btn.removeClass("recording");
        };

        try {
            recognition.start();
        } catch (err) {
            // Trường hợp gọi start nhiều lần
            console.error("Start error:", err);
        }
    }

    function stopRecognition() {
        if (recognition) {
            recognition.stop();
            // onend sẽ xử lý việc tắt class
        }
    }

    // Bấm để bật/tắt
    $("#btnVoice").on("click", function () {
     
        if (!recording) {
            startRecognition();
            
        } else {
            stopRecognition();
        }
    });
    $("#keyword").on("input", function () {
        applyFilters(1);
      
    })
    // Tùy chọn: nhấn Esc để dừng
    $(document).on("keydown", function (e) {
        if (e.key === "Escape" && recording) {
            stopRecognition();
        }
    });
  //Khi đóng pop-up thì load dữ liệu mới giữ trang hiện tại
    $('#productModal').on('hidden.bs.modal', function () {
        var page = getCurrentPage();
      
        applyFilters(page)
    });

    // Nút gọi xóa nhiều sản phẩm
    $("#btnDeletes").on("click", function () {
        let selectedIds = [];

        $(".item-check:checked").each(function () {
            selectedIds.push($(this).data("id"));
        });
       
        if (selectedIds.length === 0) {
       
            return;
        }
        onDeleteProduct(0, selectedIds);
       
    });

    // Hiển thị nút xóa nhiều sản phẩm

    // Khi người dùng check/uncheck "Chọn tất cả"
    $("#checkAll").on("change", function () {
        let isChecked = $(this).is(":checked");
        $(".item-check").prop("checked", isChecked);
        toggleDeleteButton();
    });

    // Khi người dùng check từng item
    $(document).on("change", ".item-check", function () {
        let allChecked = $(".item-check").length === $(".item-check:checked").length;
        $("#checkAll").prop("checked", allChecked);

        toggleDeleteButton();
    });

    // Hàm bật/tắt nút xóa
    function toggleDeleteButton() {
        let checkedCount = $(".item-check:checked").length;
        if (checkedCount > 0) {
            $("#btnDeletes").removeClass("d-none").fadeIn(150);
        } else {
            $("#btnDeletes").fadeOut(150, function () {
                $(this).addClass("d-none");
            });
        }
    }
    $(document).on("change", ".form-check-input", function () {
        let checkedCount = $(".form-check-input.item-check:checked").length;
        if (checkedCount > 0) {
            $("#btnDeletes").removeClass("d-none").fadeIn(150);
        } else {
            $("#btnDeletes").fadeOut(150, function () {
                $(this).addClass("d-none");
            });
        }
    });
    // ----------------------------------
});

// Hàm load sản phẩm theo bộ lọc
function loadProducts(filters) {
    $.ajax({
        url: '/api/product',
        type: 'GET',
        data: filters ,
        success: function (res) {
            if (res.success) {
             
                renderProducts(res.data.items);
                renderPagination(
                    res.data.currentPage,
                    res.data.totalRecords,
                    res.data.pageSize,
                    res.data.categoryId,
                    res.data.keySearch,
                    res.data.priceFrom,
                    res.data.priceTo,
                    res.data.quantityFrom,
                    res.data.quantityTo,
                    res.data.createDateFrom,
                     res.data.createDateTo
                );
            } else {
                toastr.warning("Không có dữ liệu!");
                $("#productList").html(`
                    <tr>
                        <td colspan="6" class="text-center text-muted py-3">
                            Không có dữ liệu!
                        </td>
                    </tr>
                `);
            }
        },
        error: function (xhr) {
            toastr.error("Lỗi server: " + xhr.status);
            
        }
    });
}


// Hàm load danh mục sản phẩm
function loadCategories(categoryFilter) {
    $.ajax({
        url: '/api/category',
        type: 'GET',
        success: function (res) {
            if (res.success && res.data) {
                renderCategories(res, categoryFilter);
            }
        },
        error: function () {
            toastr.warning("Không thể tải danh mục!");
        }
    });
}

// Hiển thị danh sách sản phẩm
function renderProducts(items) {
    if (!items || items.length === 0) {
        $("#productList").html('<tr><td colspan="7" class="text-center text-muted py-3">Không có sản phẩm nào.</td></tr>');
        return;
    }

    let html = "";
    items.forEach((p, i) => {
        html += `
        <tr>
            <td>
                <input class="form-check-input item-check" type="checkbox" data-id="${p.id}">
            </td>
            <td>${p.id}</td>
           <td>
              <img
                src="${p.avatar ? p.avatar : '/media/images/products/default-product.jpg'}" 
                alt="${p.name}" 
                class="img-thumbnail" 
                style="width: 60px; height: 60px; object-fit: cover;"
              />
            </td>
            <td style="white-space: normal; word-wrap: break-word;">${p.title}</td>
            <td style="white-space: normal; word-wrap: break-word;">${p.productCategory?.title ?? 'Không có'}</td>
            <td style="white-space: normal; word-wrap: break-word;">${(p.price ?? 0).toLocaleString()} ₫</td>
            <td style="white-space: normal; word-wrap: break-word;">${p.quantity ?? 0} </td>
            <td style="white-space: normal; word-wrap: break-word;">${p.keywords ?? 'Không có'}</td>
            <td style="white-space: normal; word-wrap: break-word;">${new Date(p.createTime).toLocaleDateString('vi-VN')}</td>
            <td class="text-center">
                <button class="btn btn-outline-info btn-view" data-id="${p.id}">
                    <i class="bi bi-eye"></i> Xem
                </button>
                <button class="btn btn-outline-warning btn-edit" data-id="${p.id}">
                    <i class="bi bi-pencil"></i> Sửa
                </button>
                <button class="btn btn-outline-danger btn-delete" data-id="${p.id}">
                    <i class="bi bi-trash"></i> Xóa
                </button>
            </td>
        </tr>`;
    });

    $("#productList").html(html);
}

// Hiển thị phân trang (đủ tham số lọc)
function renderPagination(
    current,
    total,
    pageSize,
    categoryId,
    keySearch,
    priceFrom,
    priceTo,
    quantityFrom,
    quantityTo,
    createDateFrom,
    createDateTo
) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) {
        $("#pagination").html("");
        return;
    }

    let html = `<div class="btn-group" role="group" aria-label="Pagination">`;

    // Nút Previous
    html += `
        <input type="radio" class="btn-check" name="page" id="prevPage" autocomplete="off" ${(current === 1) ? "disabled" : ""}>
        <label class="btn btn-outline-primary" for="prevPage" 
            data-page="${current - 1}"
            data-category="${categoryId || ''}"
            data-key="${keySearch || ''}"
            data-pricefrom="${priceFrom || ''}"
            data-priceto="${priceTo || ''}"
            data-quantityFrom="${quantityFrom || ''}"
            data-quantityTo="${quantityTo || ''}"
            data-datefrom="${createDateFrom || ''}"
            data-dateto="${createDateTo || ''}">
            &laquo;
        </label>
    `;

    const maxVisible = 5;
    let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Trang đầu tiên
    if (startPage > 1) {
        html += `
            <input type="radio" class="btn-check" name="page" id="page1" autocomplete="off">
            <label class="btn btn-outline-primary" for="page1" 
                data-page="1"
                data-category="${categoryId || ''}"
                data-key="${keySearch || ''}"
                data-pricefrom="${priceFrom || ''}"
                data-priceto="${priceTo || ''}"
                data-quantityFrom="${quantityFrom || ''}"
            data-quantityTo="${quantityTo || ''}"
                data-datefrom="${createDateFrom || ''}"
                data-dateto="${createDateTo || ''}">
                1
            </label>
            <span class="btn btn-light disabled">...</span>
        `;
    }

    // Các trang giữa
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <input type="radio" class="btn-check" name="page" id="page${i}" autocomplete="off" ${(i === current) ? "checked" : ""}>
            <label class="btn btn-outline-primary ${i === current ? 'active' : ''}" 
                for="page${i}" 
                data-page="${i}"
                data-category="${categoryId || ''}"
                data-key="${keySearch || ''}"
                data-pricefrom="${priceFrom || ''}"
                data-priceto="${priceTo || ''}"
               data-quantityFrom="${quantityFrom || ''}"
            data-quantityTo="${quantityTo || ''}"
                data-datefrom="${createDateFrom || ''}"
                data-dateto="${createDateTo || ''}">
                ${i}
            </label>
        `;
    }

    // Trang cuối cùng
    if (endPage < totalPages) {
        html += `
            <span class="btn btn-light disabled">...</span>
            <input type="radio" class="btn-check" name="page" id="page${totalPages}" autocomplete="off">
            <label class="btn btn-outline-primary" for="page${totalPages}"
                data-page="${totalPages}"
                data-category="${categoryId || ''}"
                data-key="${keySearch || ''}"
                data-pricefrom="${priceFrom || ''}"
                data-priceto="${priceTo || ''}"
                data-quantityFrom="${quantityFrom || ''}"
            data-quantityTo="${quantityTo || ''}"
                data-datefrom="${createDateFrom || ''}"
                data-dateto="${createDateTo || ''}">
                ${totalPages}
            </label>
        `;
    }

    // Nút Next
    html += `
        <input type="radio" class="btn-check" name="page" id="nextPage" autocomplete="off" ${(current === totalPages) ? "disabled" : ""}>
        <label class="btn btn-outline-primary" for="nextPage" 
            data-page="${current + 1}"
            data-category="${categoryId || ''}"
            data-key="${keySearch || ''}"
            data-pricefrom="${priceFrom || ''}"
            data-priceto="${priceTo || ''}"
            data-quantityFrom="${quantityFrom || ''}"
            data-quantityTo="${quantityTo || ''}"
            data-datefrom="${createDateFrom || ''}"
            data-dateto="${createDateTo || ''}">
            &raquo;
        </label>
    `;

    html += `</div>`;
    $("#pagination").html(html);

    // Bắt sự kiện click chuyển trang
    $("#pagination").off("click", ".btn:not(.disabled)").on("click", ".btn:not(.disabled)", function () {
        const page = $(this).data("page");
        applyFilters(page);

      
      
    });
}


//Hàm hiển thị catagories
function renderCategories(res, id) {
    const select = $(id);
    select.empty();
    select.append('<option value="">Tất cả danh mục</option>');

    if (res && res.data && Array.isArray(res.data)) {
        res.data.forEach(cat => {
            select.append(`<option value="${cat.title}" data-id="${cat.id}">${cat.title}</option>`);
        });
    }
}

// Xóa sản phẩm
async function onDeleteProduct(id = 0, ids = []) {
    if (!confirm("Bạn có chắc muốn xóa không?")) return;

    try {
        const res = await $.ajax({
            url: `/api/product/delete`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ id, ids }),
        });

        if (res.success) {
            const page = getCurrentPage();
            loadProducts('', '', page);
            toastr.success("Xóa sản phẩm thành công!");
        } else {
            toastr.warning(res.message || "Không thể xóa sản phẩm!");
        }
    } catch (err) {
        console.error(err);
        toastr.error("Không kết nối được server!");
    }
   
}

// Tải chi tiết sản phẩm
async function loadDetailProduct(id, mode) {
  
    try {
        const res = await $.ajax({
            url: `/api/product/view/${id}`,
            type: "GET",
            dataType: "json"
        });
     
        if (res.success && res.data) {
            const p = res.data;
        
            if (mode) {
                $("#productId-v").val(p.id);
                $("#productCategoryId-v").val(p.productCategory?.id || "");
                $("#productTitle-v").val(p.title);
                $("#productCategory-v").val(p.productCategory?.title || "");
                $("#productPrice-v").val(p.price);
                $("#productQuantity-v").val(p.quantity);
                $("#productKeywords-v").val(p.keywords);
                $("#productDescription-v").val(p.description);
                $("#productCreateTime").val(p.createTime);
                let imageUrl = p.avatar && p.avatar.trim() !== ''
                    ? p.avatar
                    : '/media/images/products/default-product.jpg';
                $('#productAvatar').attr('src', imageUrl);
            }

            $("#productId").val(p.id);
            $("#productCategoryId").val(p.productCategory?.id || "");
            $("#productTitle").val(p.title);
            $("#productCategory").val(p.productCategory?.title || "");
            $("#productPrice").val(p.price);
            $("#productQuantity").val(p.quantity);
            $("#productKeywords").val(p.keywords);
            $("#productDescription").val(p.description);
            $("#productCreateTime").val(p.createTime);
            let imageUrl = p.avatar && p.avatar.trim() !== ''
                ? p.avatar
                : '/media/images/products/default-product.jpg';
            $('#productAvatar-v').attr('src', imageUrl);
          
           
          
        } else {
            toastr.warning(res.message || "Không tìm thấy sản phẩm!");
        }
    } catch (err) {
        console.error("❌ Lỗi khi xem sản phẩm:", err);
        toastr.error("Không thể kết nối đến server!");
    }
}

// Lưu thay đổi và tạo mới sản phẩm
async function AddAndEditProduct(data) {
    $.ajax({
        url: '/api/product/save',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: function (res) {
            if (res.success) {
                toastr.success("Lưu dữ liệu thành công");
                loadCategories("#categoryFilter");
            } else {
                toastr.warning("Server trả về lỗi: " + res.message);
            }
        },
        error: function (xhr) {
            console.error("Lỗi AJAX:", xhr.responseText);
            toastr.warning("Không kết nối được server!");
        }
    });
  
}



//Hàm call back
function onViewProduct(id) {
    loadDetailProduct(id, "view");
    loadCategories("#categoryFilterOption-v")
    resetProductModal("Chi tiết sản phẩm", false, "", true);
}

function onEditView(id) {
    loadDetailProduct(id);
    resetProductModal("Chỉnh sửa sản phẩm", true, "Lưu mới", false);
  
}
function applyFilters(page = 1) {
    const filters = getFilterData();
    filters.page = page; 
    loadProducts(filters);
}


// Hàm trợ giúp lấy dữ liệu
function getCurrentPage() {
    const currentLabel = $("label[data-page].active, label[data-page].checked");
    return currentLabel.data("page") || 1;
}
function resetProductModal(title, showSaveBtn, saveText = "Lưu", isReadOnly = false) {
    $("#productModal form")[0]?.reset();
    $(".is-invalid").removeClass("is-invalid");
    $(".text-danger").text("");

    // Bật hoặc tắt readonly / disabled cho input, textarea, select
    $("#productModal input, #productModal textarea, #productModal select")
        .prop("readonly", isReadOnly)
        .prop("disabled", isReadOnly);

    $("#modalTitle").text(title);

    if (showSaveBtn) {
        $("#btnSaveEdit").removeClass("d-none").text(saveText);
    } else {
        $("#btnSaveEdit").addClass("d-none");
    }

    if (isReadOnly) {
        $("#modalTitle-v").text(title);
        $("#productModalView input, #productModalView textarea, #productModalView select")
            .prop("readonly", isReadOnly)
            .prop("disabled", isReadOnly);
        const modalView = new bootstrap.Modal(document.getElementById("productModalView"));
        modalView.show();
        return; 
    }
  
    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    loadCategories("#categoryFilterOption");
    modal.show();
}


function validateProductForm() {
    const form = document.getElementById('productForm');
    const title = document.getElementById('productTitle');
    const price = document.getElementById('productPrice');
    const categorySelect = document.getElementById('categoryFilterOption');
    const categoryInput = document.getElementById('productCategory');
    const categoryError = document.getElementById('categoryError');

    let isValid = true;

    // Reset lỗi trước
    form.classList.remove('was-validated');
    categoryError.style.display = "none";

    // Kiểm tra tên sản phẩm
    if (title.value.trim() === "") {
        title.classList.add('is-invalid');
        isValid = false;
    } else {
        title.classList.remove('is-invalid');
    }

    // Kiểm tra giá
    if (price.value.trim() === "" || parseFloat(price.value) <= 0) {
        price.classList.add('is-invalid');
        isValid = false;
    } else {
        price.classList.remove('is-invalid');
    }

    // Kiểm tra danh mục (chọn hoặc nhập)
    if (categorySelect.value.trim() === "" && categoryInput.value.trim() === "") {
        categoryError.style.display = "block";
        isValid = false;
    } else {
        categoryError.style.display = "none";
    }

    // Hiển thị style Bootstrap khi lỗi
    form.classList.add('was-validated');

    return isValid;
}

function getFilterData() {
    return {
        page: getCurrentPage(),
      
        categoryId: $("#categoryFilter").val(),
        keySearch: $("#keyword").val().trim(),
        priceFrom: $("#priceFrom").val(),
        priceTo: $("#priceTo").val(),
        quantityFrom: $("#quantityFrom").val(),
        quantityTo: $("#quantityTo").val(),
        createDateFrom: $("#createDateFrom").val(),
        createDateTo: $("#createDateTo").val()
    };
}

function resetFilters() {
    $("#keyword").val("");
    $("#categoryFilter").val("");
    $("#priceFrom").val("");
    $("#priceTo").val("");
    $("#quantityFrom").val("");
    $("#quantityTo").val("");
    $("#createDateFrom").val("");
    $("#createDateTo").val("");

    loadProducts(); 
}