import { useState } from "react";

export default function FileUploader({ onFileSelect }) {
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      alert("Please upload a PDF file only");
    }
  };

  return (
    <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition">
      <input
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input" className="cursor-pointer">
        <p className="text-gray-500 text-sm">
          {fileName ? `✅ ${fileName}` : "Click to upload your CV (PDF only)"}
        </p>
      </label>
    </div>
  );
}