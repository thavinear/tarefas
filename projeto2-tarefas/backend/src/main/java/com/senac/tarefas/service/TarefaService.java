package com.senac.tarefas.service;

import com.senac.tarefas.model.StatusTarefa;
import com.senac.tarefas.model.Tarefa;
import com.senac.tarefas.repository.TarefaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TarefaService {

    private final TarefaRepository tarefaRepository;

    public TarefaService(TarefaRepository tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    public List<Tarefa> listarTodas() {
        return tarefaRepository.findAll();
    }

    public List<Tarefa> listarPorProjeto(Long projetoId) {
        return tarefaRepository.findByProjetoId(projetoId);
    }

    public Tarefa buscarPorId(Long id) {
        return tarefaRepository.findById(id).orElseThrow();
    }

    public Tarefa criar(Tarefa tarefa) {
        if (tarefa.getStatus() == null) {
            tarefa.setStatus(StatusTarefa.PENDENTE);
        }
        return tarefaRepository.save(tarefa);
    }

    public Tarefa atualizar(Long idDaUrl, Tarefa dados) {
        Tarefa tarefa = buscarPorId(idDaUrl);
        tarefa.setTitulo(dados.getTitulo());
        tarefa.setDescricao(dados.getDescricao());
        tarefa.setStatus(dados.getStatus());
        tarefa.setPrioridade(dados.getPrioridade());
        tarefa.setDataLimite(dados.getDataLimite());
        if (dados.getProjetoId() != null) {
            tarefa.setProjetoId(dados.getProjetoId());
        }
        return tarefaRepository.save(tarefa);
    }

    public void excluir(Long id) {
        tarefaRepository.deleteById(id);
    }

    public List<Tarefa> listarAtrasadas() {
        // BUG: nao filtra por status. Uma tarefa CONCLUIDA cuja dataLimite ja passou
        // continua aparecendo pra sempre como "atrasada", mesmo ja tendo sido feita.
        return tarefaRepository.findAll().stream()
                .filter(t -> t.getDataLimite() != null && t.getDataLimite().isBefore(LocalDate.now()))
                .collect(Collectors.toList());
    }

    public List<Tarefa> listarPorPrioridade() {
        // BUG: Comparator.comparing usa a ordem alfabetica do nome do enum
        // (ALTA, BAIXA, MEDIA), nao a ordem de importancia real (ALTA > MEDIA > BAIXA).
        return tarefaRepository.findAll().stream()
                .sorted(Comparator.comparing(t -> t.getPrioridade().name()))
                .collect(Collectors.toList());
    }
}
