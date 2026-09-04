import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { get, del } from '../services/api'

const CORES_PRIORIDADE = {
  // BUG: cores trocadas -- ALTA deveria ser vermelho (urgente) e BAIXA verde (tranquilo),
  // mas aqui esta invertido.
  ALTA: '#16a34a',
  MEDIA: '#f59e0b',
  BAIXA: '#dc2626',
}

export default function DetalheProjeto() {
  const { id } = useParams()
  const [projeto, setProjeto] = useState(null)
  const [tarefas, setTarefas] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('TODAS')

  // BUG: array de dependencias vazio. Se o usuario for de um projeto pra outro
  // (ex: pela URL ou por outro link) sem recarregar a pagina inteira, os dados
  // do projeto anterior continuam na tela.
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

  if (!projeto) return <p>Carregando...</p>

  return (
    <div>
      <h1>{projeto.nome}</h1>
      <p>{projeto.descricao}</p>

      <div className="card">
        <label>Filtrar por status</label>
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
          <option value="TODAS">Todas</option>
          <option value="PENDENTE">Pendente</option>
          <option value="EM_ANDAMENTO">Em andamento</option>
          <option value="CONCLUIDA">Concluida</option>
        </select>
      </div>

      <Link to={`/projetos/${id}/tarefas/nova`}><button>Nova tarefa</button></Link>

      <div style={{ marginTop: 16 }}>
        {tarefasFiltradas.map((t) => (
          <div key={t.id} className="card" style={{ borderLeft: `6px solid ${CORES_PRIORIDADE[t.prioridade]}` }}>
            <strong>{t.titulo}</strong> — {t.status}
            <div>Prioridade: {t.prioridade}</div>
            <div>Prazo: {t.dataLimite}</div>
            <Link to={`/tarefas/${t.id}/editar`}>Editar</Link>{' '}
            <button className="danger" onClick={() => excluirTarefa(t.id)}>Excluir</button>
          </div>
        ))}
      </div>
    </div>
  )
}
