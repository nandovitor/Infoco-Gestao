
import React, { useState, useEffect, FormEvent } from 'react';
import { Employee } from '../lib/types';
import { Icons } from '../lib/icons';
import Modal from './Modal';

const Funcionarios = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/funcionarios');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
      alert('Falha ao buscar funcionários.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setModalOpen(true);
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  }

  const handleDelete = async (id: number) => {
    if(window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await fetch(`/api/funcionarios?id=${id}`, { method: 'DELETE' });
        fetchEmployees();
      } catch (error) {
        console.error("Failed to delete employee", error);
        alert('Falha ao excluir funcionário.');
      }
    }
  }

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const url = selectedEmployee ? `/api/funcionarios?id=${selectedEmployee.id}` : '/api/funcionarios';
    const method = selectedEmployee ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao salvar funcionário.');
      }
      
      setModalOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Failed to save employee", error);
      alert((error as Error).message);
    }
  };

  if (isLoading) {
    return <div className="card"><h1>Gerenciar Funcionários</h1><p>Carregando...</p></div>;
  }

  return (
    <>
      <div className="page-header">
        <h1>Gerenciar Funcionários</h1>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Icons.add className="w-5 h-5" />
          Adicionar Funcionário
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.department}</td>
                  <td>{employee.email}</td>
                  <td>
                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={() => handleEdit(employee)}><Icons.edit className="w-5 h-5"/></button>
                        <button className="btn btn-danger" onClick={() => handleDelete(employee.id)}><Icons.delete className="w-5 h-5" /></button>
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
        title={selectedEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}
        footer={
            <>
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" form="employee-form" className="btn btn-primary">Salvar</button>
            </>
        }
      >
        <form id="employee-form" className="form-grid" onSubmit={handleSave}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="name">Nome Completo</label>
                <input type="text" id="name" name="name" defaultValue={selectedEmployee?.name} required />
            </div>
            <div className="form-group">
                <label htmlFor="role">Cargo</label>
                <input type="text" id="role" name="role" defaultValue={selectedEmployee?.role} required/>
            </div>
            <div className="form-group">
                <label htmlFor="department">Departamento</label>
                <input type="text" id="department" name="department" defaultValue={selectedEmployee?.department} required/>
            </div>
             <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" defaultValue={selectedEmployee?.email} required/>
            </div>
        </form>
      </Modal>
    </>
  );
};

export default Funcionarios;
