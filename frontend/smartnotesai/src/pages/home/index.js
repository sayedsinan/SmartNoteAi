import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

// The main App component — this is the root of our entire application
function App() {

  // ---------- STATE ----------
  // State variables store data that can change over time.
  // When state changes, React automatically re-renders the component.

  const [notes, setNotes] = useState("");         // What the user types in the textarea
  const [result, setResult] = useState("");       // The AI-generated study material
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);       // The AI-generated study material
  const [loading, setLoading] = useState(false);  // true = show loading spinner, false = normal
  const [history, setHistory] = useState([]);      // List of all saved notes from the database
  const [activeId, setActiveId] = useState(null); // The ID of the note currently being viewed


  // ---------- ON PAGE LOAD ----------
  // useEffect with an empty array [] runs once when the component first appears on screen.
  // We use it to load all saved notes from the server when the app starts.

  useEffect(() => {
    fetchNotes();
  }, []);


  // ---------- FETCH ALL NOTES ----------
  // This function calls our backend API to get the list of all saved notes.
  // It runs on page load and also after saving or deleting a note.

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/notes");

      // response.data.data is the array of notes returned by the API
      setHistory(response.data.data);

    } catch (error) {
      console.error("Could not load notes:", error);
    }
  };


  // ---------- GENERATE STUDY MATERIAL ----------
  // Sends the user's raw notes to the backend, which calls the AI (Gemini).
  // The AI returns organized study material, which we store in `result`.

  const generateNotes = async () => {

    // Don't do anything if the textarea is empty
    if (!notes.trim()) {
      alert("Please enter some notes first!");
      return;
    }

    try {
      setLoading(true); // Show the loading state on the button

      const response = await axios.post("http://localhost:3000/api/generate", {
        notes: notes, // Send the notes to the backend
      });

      // Store the AI response so it shows up on screen
      setQuiz(response.data.data);
      setAnswers({});
      setScore(0);

    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate study material. Please try again.");
    } finally {
      setLoading(false); // Always hide the loading state when done
    }
  };


  // ---------- SAVE A NOTE ----------
  // Saves both the original notes and the AI-generated content to the database.
  // After saving, we refresh the sidebar list to show the new note.

  const saveNotes = async () => {

    // Can't save if there's no generated content yet
    if (!result) {
      alert("Please generate study material first!");
      return;
    }

    try {
      setLoading(true);

      // Build the object we want to send to the API
      const payload = {
        title: notes.substring(0, 15) + (notes.length > 15 ? "..." : ""), // First 15 chars as title
        original_notes: notes,
        generated_content: result,
        difficulty_level: "college",
      };

      const response = await axios.post("http://localhost:3000/api/notes", payload);

      // Update the active note ID so it highlights in the sidebar
      setActiveId(response.data.data?.id);

      // Reload the sidebar list to include the new note
      await fetchNotes();

      alert("Note saved successfully!");

    } catch (error) {
      console.error("Save failed:", error);
      alert(error.response?.data?.message || "Failed to save note.");
    } finally {
      setLoading(false);
    }
  };


  // ---------- LOAD A NOTE ----------
  // When the user clicks a note in the sidebar, fetch its full content and display it.

  const loadNote = async (item) => {
    try {
      setLoading(true);

      const response = await axios.get(`http://localhost:3000/api/notes/${item.id}`);
      const note = response.data.data;

      // Fill the textarea and result area with the loaded note's content
      setNotes(note.original_notes);
      setResult(note.generated_content);
      setActiveId(item.id); // Highlight this note in the sidebar

    } catch (error) {
      console.error("Load failed:", error);
      alert("Failed to load note.");
    } finally {
      setLoading(false);
    }
  };


  // ---------- DELETE A NOTE ----------
  // Deletes a note from the database and removes it from the sidebar.
  // If the deleted note is currently open, clear the editor too.

  const deleteNote = async (id, event) => {
    // stopPropagation prevents the click from also triggering loadNote on the parent div
    event.stopPropagation();

    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    try {
      setLoading(true);

      await axios.delete(`http://localhost:3000/api/notes/${id}`);

      // Remove the deleted note from the sidebar list
      setHistory((prevHistory) => prevHistory.filter((note) => note.id !== id));

      // If the deleted note was open, clear the editor
      if (activeId === id) {
        setNotes("");
        setResult("");
        setActiveId(null);
      }

      alert("Note deleted.");

    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete note.");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionIndex, selectedOption) => {

    if (answers[questionIndex]) return;

    const correct =
      quiz.mcqs[questionIndex].answer === selectedOption;

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };


  // ---------- CLEAR EDITOR ----------
  // Resets the editor so the user can start a new note from scratch.

  const clearEditor = () => {
    setNotes("");
    setResult("");
    setActiveId(null);
  };


  // ---------- RENDER (JSX) ----------
  // This is what actually appears on the screen.
  // JSX looks like HTML but it's JavaScript — it describes the UI.

  return (
    <div className="layout">

      {/* ===== SIDEBAR ===== */}
      {/* Shows the app name at the top and a list of saved notes below */}
      <aside className="sidebar">

        {/* App name / workspace header */}
        <div className="sidebar-header">
          <div className="workspace-label">
            <div className="workspace-icon">✦</div>
            <span className="workspace-name">Smart Notes</span>
          </div>
        </div>

        {/* List of saved notes */}
        <div className="sidebar-section">

          {/* Button to start a fresh note */}
          <button className="new-note-btn" onClick={clearEditor}>
            + New note
          </button>

          <div className="section-label">Saved Notes</div>

          {/* If there are no saved notes, show a message */}
          {history.length === 0 ? (
            <p className="empty-state-sidebar">No saved notes yet</p>
          ) : (
            // Otherwise, loop through each note and show it as a sidebar item
            history.map((item) => (
              <div
                key={item.id}
                // Highlight the currently active note with the "active" CSS class
                className={`note-item ${activeId === item.id ? "active" : ""}`}
                onClick={() => loadNote(item)}
              >
                <span className="note-icon">📄</span>
                <span className="note-title">{item.title || "Untitled"}</span>

                {/* Delete button — only appears when you hover over the note */}
                <button
                  className="note-delete"
                  onClick={(e) => deleteNote(item.id, e)}
                  title="Delete this note"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </aside>


      {/* ===== MAIN CONTENT ===== */}
      <main className="main">

        {/* Top navigation bar */}
        <div className="topbar">
          <div className="breadcrumb">
            Smart Notes <span>›</span>
            <span>{notes ? notes.substring(0, 30) : "New Note"}</span>
          </div>
        </div>

        {/* Editor area where the user types and sees results */}
        <div className="editor-area">

          {/* Notes input section */}
          <div className="content-label">✎ Your Notes</div>

          <textarea
            className="notes-textarea"
            placeholder="Type or paste your notes here... the AI will turn them into study material."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Action buttons */}
          <div className="action-row">

            {/* Generate button — sends notes to the AI */}
            <button
              className="btn-primary"
              onClick={generateNotes}
              disabled={loading}
            >
              {loading ? "Generating..." : "✦ Generate Study Material"}
            </button>

            {/* Save button — only shows after content has been generated */}
            {result && (
              <button
                className="btn-save"
                onClick={saveNotes}
                disabled={loading}
              >
                {loading ? "Saving..." : "↓ Save Note"}
              </button>
            )}

            {/* Clear button — resets everything */}
            <button
              className="btn-secondary"
              onClick={clearEditor}
              disabled={loading}
            >
              Clear
            </button>
          </div>

          {/* AI-generated result — only shows after generation */}
          {result && (
            <div className="result-block">
              <div className="result-header">
                <div className="result-badge">✦ AI Generated</div>
              </div>
              {/* pre tag preserves line breaks and spacing from the AI response */}
              {quiz && (
                <div className="quiz-container">

                  <h2>{quiz.topic}</h2>

                  {quiz.mcqs.map((mcq, index) => (
                    <div key={index} className="question-card">

                      <h3>
                        {index + 1}. {mcq.question}
                      </h3>

                      {mcq.options.map((option, optionIndex) => {

                        const selected =
                          answers[index] === option;

                        const isCorrect =
                          option === mcq.answer;

                        return (
                          <button
                            key={optionIndex}
                            className={`option-btn
                              ${
                                selected && isCorrect
                                  ? "correct"
                                  : ""
                              }
                              ${
                                selected && !isCorrect
                                  ? "wrong"
                                  : ""
                              }
                            `}
                            onClick={() =>
                              selectAnswer(index, option)
                            }
                          >
                            {option}
                          </button>
                        );
                      })}

                      {answers[index] && (
                        <div className="answer-result">

                          {answers[index] === mcq.answer ? (
                            <p>✅ Correct</p>
                          ) : (
                            <p>
                              ❌ Wrong <br />
                              Correct Answer:
                              <strong> {mcq.answer}</strong>
                            </p>
                          )}

                        </div>
                      )}

                    </div>
                  ))}

                  <div className="score-card">
                    Score: {score} / {quiz.mcqs.length}
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

export default App;