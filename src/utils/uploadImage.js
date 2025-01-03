import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();

  //APPEND IMAGE FILE TO FORM DATA
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post("/image-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data //RETURN RESPONSE DATA
  } catch (error) {
    console.error('Error uploading the image',error);
    throw error //RETHROW ERROR FOR HANDLING
  }
};

export default uploadImage
