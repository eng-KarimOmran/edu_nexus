const isDevelopment = import.meta.env.VITE_APP_ENV === "development";

const env = {
    BASE_URL: isDevelopment
        ? import.meta.env.VITE_BASE_URL_DEVELOPER
        : import.meta.env.VITE_BASE_URL,

    APP_ENV: import.meta.env.VITE_APP_ENV,

    CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

export default env;