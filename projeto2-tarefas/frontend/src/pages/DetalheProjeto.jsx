import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { get, del } from '../services/api'

const STATUS_LABELS = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
}

const PRIORIDADE_LABELS = {
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa',
}

function formatarData(data) {
  if (!data) return 'Sem prazo'

  const parsed = new Date(data)
  if (Number.isNaN(parsed.getTime())) return data

  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function DetalheProjeto() {
  const { id } = useParams()
  const [projeto, setProjeto] = useState(null)
  const [tarefas, setTarefas] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('TODAS')

  useEffect(() => {
    if (!id) return

    get(`/projetos/${id}`).then(setProjeto)
    get(`/tarefas?projetoId=${id}`).then(setTarefas)
  }, [id])

  function excluirTarefa(tarefaId) {
    del(`/tarefas/${tarefaId}`).then(() => {
      get(`/tarefas?projetoId=${id}`).then(setTarefas)
    })
  }

  const tarefasFiltradas =
    filtroStatus === 'TODAS'
      ? tarefas
      : tarefas.filter((t) => t.status === filtroStatus)

  if (!projeto) return <div className="loading-state">Carregando projeto...</div>

  return (
    <div className="page">
      <header className="project-header card">
        <div>
          <p className="eyebrow">Projeto</p>
          <h1>{projeto.nome}</h1>
          <p className="project-description">{projeto.descricao || 'Sem descrição cadastrada.'}</p>
        </div>

        <div className="project-summary">
          <div className="summary-stat">
            <span>Total</span>
            <strong>{tarefas.length}</strong>
          </div>
          <Link to={`/projetos/${id}/tarefas/nova`} className="primary-button">
            Nova tarefa
          </Link>
        </div>
      </header>

      <section className="card task-toolbar">
        <div className="field compact-field">
          <label>Filtrar por status</label>
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="TODAS">Todas</option>
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDA">Concluída</option>
          </select>
        </div>
      </section>

      <section className="task-list">
        {tarefasFiltradas.length === 0 ? (
          <div className="empty-state">Nenhuma tarefa encontrada para este filtro.</div>
        ) : (
          tarefasFiltradas.map((t) => (
            <article key={t.id} className="task-item">
              <div className="task-content">
                <div className="task-item-header">
                  <h3 className="task-title">{t.titulo}</h3>
                  <div className="task-badges">
                    <span className={`status-badge status-${String(t.status).toLowerCase().replace(/_/g, '-')}`}>
                      {STATUS_LABELS[t.status] || t.status}
                    </span>
                    <span className={`status-badge priority-${String(t.prioridade).toLowerCase()}`}>
                      {PRIORIDADE_LABELS[t.prioridade] || t.prioridade}
                    </span>
                  </div>
                </div>

                <p className="task-description">{t.descricao || 'Sem descrição cadastrada.'}</p>

                <div className="task-meta">
                  <span>Prazo: {formatarData(t.dataLimite)}</span>
                </div>
              </div>

              <div className="task-actions">
                <Link to={`/tarefas/${t.id}/editar`} className="secondary-button">
                  Editar
                </Link>
                <button className="danger-button" onClick={() => excluirTarefa(t.id)}>
                  Excluir
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}
