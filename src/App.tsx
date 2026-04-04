import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConceptViewer } from './components/ConceptViewer';
import { HomePage } from './components/HomePage';
import { ThemeProvider } from './lib/theme';

// Import concept registry (auto-registers all concepts)
import './concepts';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn/:conceptId" element={<ConceptViewer />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
