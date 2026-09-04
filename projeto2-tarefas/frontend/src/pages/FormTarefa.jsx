import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { get, post, put } from '../services/api'

export default function FormTarefa() {
  const { id, projetoId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    projetoId: projetoId || '',
    titulo: '',
    descricao: '',
    status: 'PENDENTE',
    prioridade: 'MEDIA',
    dataLimite: '',
  })

  useEffect(() => {
    if (!id) {
      setForm((prev) => ({
        ...prev,
        projetoId: projetoId || prev.projetoId || '',
      }))
      return
    }

    get(`/tarefas/${id}`)
      .then((tarefa) => {
        setForm({
          projetoId: tarefa.projetoId ?? projetoId ?? '',
          titulo: tarefa.titulo ?? '',
          descricao: tarefa.descricao ?? '',
          status: tarefa.status ?? 'PENDENTE',
          prioridade: tarefa.prioridade ?? 'MEDIA',
          dataLimite: tarefa.dataLimite ?? '',
        })
      })
      .catch((error) => {
        console.error('Erro ao carregar tarefa para edição:', error)
        alert(error.message || 'Não foi possível carregar a tarefa para edição.')
      })
  }, [id, projetoId])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      ...form,
      projetoId: Number(form.projetoId || projetoId || 0),
      ...(id ? { id: Number(id) } : {}),
    }

    const operacao = id
      ? put(`/tarefas/${id}`, payload)
      : post('/tarefas', payload)

    operacao
      .then(() => navigate(-1))
      .catch((error) => {
        console.error('Erro ao salvar tarefa:', error)
        alert(error.message || 'Não foi possível salvar a tarefa.')
      })
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Tarefas</p>
          <h1>{id ? 'Editar tarefa' : 'Nova tarefa'}</h1>
        </div>
      </header>

      <form className="card form-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field full">
            <label>Título</label>
            <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Digite o título da tarefa" />
          </div>

          <div className="field full">
            <label>Descrição</label>
            <textarea name="descricao" value={form.descricao} onChange={handleChange} rows="5" placeholder="Descreva os detalhes da tarefa" />
          </div>

          <div className="field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="CONCLUIDA">Concluída</option>
            </select>
          </div>

          <div className="field">
            <label>Prioridade</label>
            <select name="prioridade" value={form.prioridade} onChange={handleChange}>
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>

          <div className="field full">
            <label>Data limite</label>
            <input type="date" name="dataLimite" value={form.dataLimite || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="primary-button">Salvar</button>
        </div>
      </form>
    </div>
  )
}
