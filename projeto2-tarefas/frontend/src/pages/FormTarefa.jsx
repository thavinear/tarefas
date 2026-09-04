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
    <div>
      <h1>{id ? 'Editar Tarefa' : 'Nova Tarefa'}</h1>
      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Titulo</label>
          <input name="titulo" value={form.titulo} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Descricao</label>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="PENDENTE">Pendente</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDA">Concluida</option>
          </select>
        </div>
        <div className="field">
          <label>Prioridade</label>
          <select name="prioridade" value={form.prioridade} onChange={handleChange}>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>
        <div className="field">
          <label>Data limite</label>
          <input type="date" name="dataLimite" value={form.dataLimite || ''} onChange={handleChange} />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
