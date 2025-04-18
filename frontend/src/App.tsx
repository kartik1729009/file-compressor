import { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState("compress");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select a file");
      return;
    }

    // Detect file type (simple version)
    const fileType = file.name.endsWith(".pdf") ? "Pdf" : 
                    file.name.endsWith(".docx") ? "Docs" : 
                    null;

    if (!fileType) {
      setError("Only PDF and DOCX files are supported");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("level", compressionLevel);
    formData.append("fileType", fileType);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/compress", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `compressed_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
  console.error("Compression error:", err);
  setError(
    axios.isAxiosError(err) 
      ? err.response?.data?.message || err.message
      : "Compression failed"
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>File Compression</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
          accept=".pdf,.docx"
        />
        
        <select 
          value={compressionLevel}
          onChange={(e) => setCompressionLevel(e.target.value)}
        >
          <option value="compress">Normal Compression</option>
          <option value="superCompress">Strong Compression</option>
          <option value="ultraCompress">Maximum Compression</option>
        </select>

        <button type="submit" disabled={loading || !file}>
          {loading ? "Processing..." : "Compress File"}
        </button>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}

export default FileUpload;