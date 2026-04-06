import { BrowserRouter, Route, Routes } from 'react-router';
import { ConceptViewer } from './components/ConceptViewer';
import { HomePage } from './components/HomePage';
import { NotFound } from './components/NotFound';
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
