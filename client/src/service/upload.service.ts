import imageCompression from "browser-image-compression";
import env from "@/config/env"

export interface UploadImageResponse {
    publicId: string;
    imageUrl: string;
}

export async function uploadImage(
    file: File
): Promise<UploadImageResponse> {
    const compressedFile =
        file.size > 500 * 1024
            ? await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1920,
                initialQuality: 0.8,
                useWebWorker: true,
            })
            : file;

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("upload_preset", env.CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );
    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error?.message ?? "فشل رفع الصورة");
    }
    const data = await response.json();
    return {
        publicId: data.public_id,
        imageUrl: data.secure_url,
    };
}