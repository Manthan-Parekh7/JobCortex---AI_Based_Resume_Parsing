import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractTextFromPDF(buffer) {
    return (await pdfParse(buffer)).text;
}

export async function extractTextFromDocx(buffer) {
    return (await mammoth.extractRawText({ buffer })).value;
}
