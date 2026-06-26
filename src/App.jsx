import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Results from "./pages/Results";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/:id"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
