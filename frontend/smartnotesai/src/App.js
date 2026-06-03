import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNotes = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/api/generate",
        {
          notes,
        }
      );

      setResult(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>📚 Smart  AI</h1>

      <textarea
        placeholder="Enter your notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={generateNotes}>
        {loading ? "Generating..." : "Generate Study Material"}
      </button>

      {result && (
        <div className="result">
          <h2>Generated Content</h2>

          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;