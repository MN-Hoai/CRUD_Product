class ApiClient {
    constructor(baseUrl = "") {
        this.baseUrl = baseUrl;
    }

    // Xây URL với query string
    buildUrl(url, params = null) {
        if (!params) return this.baseUrl + url;
        const query = $.param(params);
        return `${this.baseUrl + url}?${query}`;
    }

    // Hàm request chuẩn async/await
    async request(url, options = {}) {
        const fullUrl = this.buildUrl(url, options.params);

        try {
            const response = await $.ajax({
                url: fullUrl,
                type: options.method || "GET",
                data: options.data ? JSON.stringify(options.data) : null,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });

            if (!response.success) {
                toastr.warning(response.message || "Có lỗi xảy ra");
            }

            return response; 
        } catch (err) {
           // toastr.error("Không thể kết nối đến server!", "Lỗi");
            return { success: false, message: "Không thể kết nối đến server." };
        }
    }

    // Các phương thức cơ bản
    get(url, params = null) {
        return this.request(url, { method: "GET", params });
    }

    post(url, data, params = null) {
        return this.request(url, { method: "POST", data, params });
    }

    put(url, data, params = null) {
        return this.request(url, { method: "PUT", data, params });
    }

    delete(url, params = null) {
        return this.request(url, { method: "DELETE", params });
    }
}

// Khởi tạo ApiClient dùng toàn hệ thống
const apiClient = new ApiClient();
