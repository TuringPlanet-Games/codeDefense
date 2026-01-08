// ==========================================
// CodeDefense - 主应用入口
// ==========================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/common';
import { HomePage, TasksPage, LearningPage, GamePage } from './pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/learn" element={<LearningPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

// 临时设置页面
function SettingsPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>设置</h1>
      <p>设置页面正在开发中...</p>
    </div>
  );
}

export default App;
