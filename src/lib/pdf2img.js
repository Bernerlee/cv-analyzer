import * as pdfjsLib from "pdfjs-dist";

// Point to the worker file we copied into /public
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export async function convertPdfToImage(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1); // only first page

    const viewport = page.getViewport({ scale: 2 }); // scale 2 = good quality
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    // Convert canvas to a File object
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const imageName = file.name.replace(/\.pdf$/i, ".png");
          const imageFile = new File([blob], imageName, { type: "image/png" });
          resolve({ file: imageFile, error: null });
        } else {
          resolve({ file: null, error: "Failed to create image from PDF" });
        }
      }, "image/png");
    });
  } catch (err) {
    return { file: null, error: `PDF conversion failed: ${err.message}` };
  }
}