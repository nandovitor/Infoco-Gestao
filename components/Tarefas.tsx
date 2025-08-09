
import React, { useState, useEffect, FormEvent } from 'react';
import { Employee, Task, TaskStatus } from '../lib/types';
import { Icons } from '../lib/icons';
import Modal from './Modal';

const statusClasses: { [key in TaskStatus]: string } = {
  'Concluída': 'status-green',
  'Em Andamento': 'status-yellow',
  'Pendente': 'status-red',
};

const Tarefas = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, employeesRes] = await Promise.all([
        fetch('/api/tarefas'),
        fetch('/api/funcionarios'),
      ]);
      const tasksData = await tasksRes.json();
      const employeesData = await employeesRes.json();
      setTasks(tasksData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      alert('Falha ao buscar dados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await fetch(`/api/tarefas?id=${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error("Failed to delete task", error);
        alert('Falha ao excluir tarefa.');
      }
    }
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      employeeId: formData.get('employeeId'),
      task: formData.get('task'),
      date: formData.get('date'),
      hours: Number(formData.get('hours')),
      status: formData.get('status'),
    };

    const url = selectedTask ? `/api/tarefas?id=${selectedTask.id}` : '/api/tarefas';
    const method = selectedTask ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar tarefa.');
      }

      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save task", error);
      alert((error as Error).message);
    }
  };

  if (isLoading) {
    return <div className="card"><h1>Gerenciar Tarefas</h1><p>Carregando...</p></div>;
  }

  return (
    <>
      <div className="page-header">
        <h1>Gerenciar Tarefas</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Icons.add className="w-5 h-5" />
          Registrar Tarefa
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <select className="form-group" style={{ flex: 1 }}><option>Todos Funcionários</option></select>
          <select className="form-group" style={{ flex: 1 }}><option>Todos Status</option></select>
          <input type="date" className="form-group" style={{ flex: 1 }} />
        </div>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>Tarefa</th>
                <th>Data</th>
                <th>Horas</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.employeeName}</td>
                  <td>{task.task}</td>
                  <td>{new Date(task.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                  <td>{task.hours}h</td>
                  <td><span className={`status-badge ${statusClasses[task.status]}`}>{task.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-secondary" onClick={() => handleEdit(task)}><Icons.edit className="w-5 h-5" /></button>
                      <button className="btn btn-danger" onClick={() => handleDelete(task.id)}><Icons.delete className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTask ? 'Editar Tarefa' : 'Registrar Tarefa'}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
            <button type="submit" form="task-form" className="btn btn-primary">Salvar</button>
          </>
        }
      >
        <form id="task-form" className="form-grid" onSubmit={handleSave}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="employeeId">Funcionário</label>
            <select id="employeeId" name="employeeId" defaultValue={selectedTask?.employeeId} required>
              <option value="">Selecione um funcionário</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="task">Descrição da Tarefa</label>
            <input type="text" id="task" name="task" defaultValue={selectedTask?.task} required />
          </div>
          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input type="date" id="date" name="date" defaultValue={selectedTask?.date.substring(0, 10)} required />
          </div>
          <div className="form-group">
            <label htmlFor="hours">Horas</label>
            <input type="number" step="0.5" id="hours" name="hours" defaultValue={selectedTask?.hours} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={selectedTask?.status} required>
              <option>Pendente</option>
              <option>Em Andamento</option>
              <option>Concluída</option>
            </select>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Tarefas;
