import { useState } from "react";
import axios from "axios";
import "./style.css";

function App() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  // State to store the history of generated items
  const [history, setHistory] = useState([]);

  const generateNotes = async () => {
    if (!notes.trim()) return alert("Please enter some notes first!");

    try {
      setLoading(true);

      const response = await axios.post(
        "https://acela.proxy.rlwy.net:10774/api/generate",
        { notes }
      );

      const generatedData = response.data.data;
      setResult(generatedData);

      // Create a new history item
      const newHistoryItem = {
        id: Date.now(), // Unique ID
        title: notes.substring(0, 25) + (notes.length > 25 ? "..." : ""), // Snip input for title
        prompt: notes,
        content: generatedData,
      };

      // Add it to the top of the history list
      setHistory((prevHistory) => [newHistoryItem, ...prevHistory]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate notes");
    } finally {
      setLoading(false);
    }
  };

  // Function to load an older note when clicked from the sidebar
  const loadHistoryItem = (item) => {
    setNotes(item.prompt);
    setResult(item.content);
  };

  return (
    <div className="app-layout">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <h2>History</h2>
        {history.length === 0 ? (
          <p className="empty-history">No history yet</p>
        ) : (
          <ul className="history-list">
            {history.map((item) => (
              <li key={item.id} onClick={() => loadHistoryItem(item)}>
                <strong>{item.title}</strong>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="main-content">
        <div className="container">
          <h1>Smart Notes AI</h1>

          <textarea
            placeholder="Enter your notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button onClick={generateNotes} disabled={loading}>
            {loading ? "Generating..." : "Generate Study Material"}
          </button>

          {result && (
            <div className="result">
              <h2>Generated Content</h2>
              <pre>{result}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;