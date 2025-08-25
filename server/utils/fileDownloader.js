import axios from "axios";

export async function downloadFileBuffer(url) {
    const response = await axios.get(url, {
        responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
}
