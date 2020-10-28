import http from "../plugins/http-common";

class SendFormService {
    upload(name, desc, runtime, file, onUploadProgress) {
        let formData = new FormData();

        formData.append("appName", name);
        formData.append("appDesc", desc);
        formData.append("appRuntime", runtime);
        formData.append("csv", file);

        return http.post("/api/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        });
    }
}

export default new SendFormService();
