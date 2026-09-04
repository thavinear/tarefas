import { NavLink, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Projetos from './pages/Projetos.jsx'
import DetalheProjeto from './pages/DetalheProjeto.jsx'
import FormTarefa from './pages/FormTarefa.jsx'

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">T</div>
          <div>
            <span className="brand-name">Tarefas</span>
            <small>Gestão</small>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/projetos"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Projetos
          </NavLink>
        </nav>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Sistema</p>
            <h2>Operações</h2>
          </div>
        </header>

        <main className="page-shell">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projetos" element={<Projetos />} />
            <Route path="/projetos/:id" element={<DetalheProjeto />} />
            <Route path="/projetos/:projetoId/tarefas/nova" element={<FormTarefa />} />
            <Route path="/tarefas/:id/editar" element={<FormTarefa />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
