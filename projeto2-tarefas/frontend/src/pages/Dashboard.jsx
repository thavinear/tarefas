import { useEffect, useState } from 'react'
import { get } from '../services/api'

const STATUS_LABELS = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
}

export default function Dashboard() {
  const [tarefas, setTarefas] = useState([])

  useEffect(() => {
    get('/tarefas').then(setTarefas)
  }, [])

  const pendentes = tarefas.filter((t) => t.status === 'PENDENTE').length
  const emAndamento = tarefas.filter((t) => t.status === 'EM_ANDAMENTO').length
  const concluidas = tarefas.filter((t) => t.status === 'CONCLUIDA').length
  const total = tarefas.length
  const percentualConclusao = total ? Math.round((concluidas / total) * 100) : 0

  const cards = [
    {
      label: 'Total de tarefas',
      value: total,
      hint: 'Ativas no sistema',
      tone: 'primary',
    },
    {
      label: 'Pendentes',
      value: pendentes,
      hint: 'Aguardando início',
      tone: 'neutral',
    },
    {
      label: 'Em andamento',
      value: emAndamento,
      hint: 'Em execução',
      tone: 'warning',
    },
    {
      label: 'Concluídas',
      value: concluidas,
      hint: 'Finalizadas',
      tone: 'success',
    },
  ]

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Visão geral</p>
          <h1>Dashboard</h1>
        </div>
        <p className="page-subtitle">Acompanhamento das tarefas em execução e do progresso do time.</p>
      </header>

      <section className="stats-grid">
        {cards.map((card) => (
          <article key={card.label} className={`stat-card tone-${card.tone}`}>
            <span className="stat-label">{card.label}</span>
            <strong className="stat-value">{card.value}</strong>
            <span className="stat-hint">{card.hint}</span>
          </article>
        ))}
      </section>

      <section className="summary-panel card">
        <div className="summary-header">
          <div>
            <p className="eyebrow">Resumo</p>
            <h3>Progresso geral</h3>
          </div>
          <span className="summary-pill">{percentualConclusao}% concluído</span>
        </div>

        <div className="progress-bar" aria-label="Progresso geral das tarefas">
          <div className="progress-fill" style={{ width: `${percentualConclusao}%` }} />
        </div>

        <div className="status-breakdown">
          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const count = tarefas.filter((t) => t.status === status).length
            const percent = total ? Math.round((count / total) * 100) : 0

            return (
              <div key={status} className="breakdown-item">
                <div className="breakdown-topline">
                  <span className={`status-badge status-${status.toLowerCase().replace(/_/g, '-')}`}>
                    {label}
                  </span>
                  <strong>{count}</strong>
                </div>
                <div className="mini-progress">
                  <span style={{ width: `${percent}%` }} />
                </div>
                <small>{percent}% do total</small>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
