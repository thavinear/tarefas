import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { get, post } from '../services/api'

export default function Projetos() {
  const [projetos, setProjetos] = useState([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    carregar()
  }, [])

  function carregar() {
    get('/projetos').then(setProjetos)
  }

  function criar(e) {
    e.preventDefault()
    post('/projetos', { nome, descricao }).then(() => {
      setNome('')
      setDescricao('')
      carregar()
    })
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1>Projetos</h1>
        </div>
        <p className="page-subtitle">Centralize e acompanhe os projetos do time em um único lugar.</p>
      </header>

      <form className="card form-panel" onSubmit={criar}>
        <div className="panel-headline">
          <h3>Novo projeto</h3>
        </div>

        <div className="form-grid">
          <div className="field full">
            <label>Nome do projeto</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Redesign da operação" />
          </div>

          <div className="field full">
            <label>Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="4" placeholder="Descreva o objetivo e o escopo do projeto" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">Criar projeto</button>
        </div>
      </form>

      <section className="projects-section">
        <div className="section-header">
          <h3>Projetos cadastrados</h3>
        </div>

        {projetos.length === 0 ? (
          <div className="empty-state">Ainda não há projetos cadastrados.</div>
        ) : (
          <div className="projects-grid">
            {projetos.map((p) => (
              <article className="project-card card" key={p.id}>
                <div className="project-card-header">
                  <span className="project-tag">Projeto</span>
                </div>
                <h3>{p.nome}</h3>
                <p>{p.descricao || 'Sem descrição cadastrada.'}</p>
                <Link to={`/projetos/${p.id}`} className="project-link">
                  Abrir projeto
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
