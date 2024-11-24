import { UPLOAD_IMAGE } from "./types";
import axios from "axios";

export const uploadImage = (imageData) => async (dispatch) => {
    // Check if the imageData is not null or empty
    if (imageData.entries().next().value[1] !== null) {
        try {
            const response = await axios.post(
                `${axios.defaults.baseURL}/api/upload/image`, 
                imageData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Ensure this header for multipart requests
                    },
                    onUploadProgress: (progressEvent) => {
                        console.log("Uploading : " + ((progressEvent.loaded / progressEvent.total) * 100).toString() + "%");
                    }
                }
            );
            // Dispatch the UPLOAD_IMAGE action with the response data
            dispatch({
                type: UPLOAD_IMAGE,
                payload: response.data
            });
        } catch (error) {
            console.error("Error uploading image", error);
        }
    }
};
