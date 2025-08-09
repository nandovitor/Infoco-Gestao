
import React, { useState, useEffect } from 'react';
import { Expense } from '../lib/types';
import { Icons } from '../lib/icons';
import Modal from './Modal';

type Tab = 'Despesas' | 'Folha de Pagamento' | 'Férias e Ausências';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const RecursosHumanos = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Despesas');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/despesas');
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
            alert('Falha ao buscar despesas.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'Despesas') {
            fetchExpenses();
        }
    }, [activeTab]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
            try {
                await fetch(`/api/despesas?id=${id}`, { method: 'DELETE' });
                fetchExpenses();
            } catch (error) {
                console.error("Failed to delete expense", error);
                alert('Falha ao excluir despesa.');
            }
        }
    }

    return (
        <div>
            <div className="page-header">
                <h1>Recursos Humanos</h1>
            </div>
            <div className="tabs">
                <div className={`tab ${activeTab === 'Despesas' ? 'active' : ''}`} onClick={() => setActiveTab('Despesas')}>Despesas</div>
                <div className={`tab ${activeTab === 'Folha de Pagamento' ? 'active' : ''}`} onClick={() => setActiveTab('Folha de Pagamento')}>Folha de Pagamento</div>
                <div className={`tab ${activeTab === 'Férias e Ausências' ? 'active' : ''}`} onClick={() => setActiveTab('Férias e Ausências')}>Férias e Ausências</div>
            </div>

            {activeTab === 'Despesas' && (
                <div className="card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                        <h2>Gerenciar Despesas de Funcionários</h2>
                        <button className="btn btn-primary"><Icons.add className="w-5 h-5" /> Adicionar Lançamento</button>
                    </div>
                     {isLoading ? <p>Carregando despesas...</p> : (
                        <div className="table-container">
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th>Funcionário</th>
                                        <th>Descrição</th>
                                        <th>Tipo</th>
                                        <th>Valor</th>
                                        <th>Data</th>
                                        <th>Status</th>
                                        <th>Nota Fiscal</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map(expense => (
                                        <tr key={expense.id}>
                                            <td>{expense.employeeName}</td>
                                            <td>{expense.description}</td>
                                            <td>{expense.type}</td>
                                            <td>{formatCurrency(Number(expense.value))}</td>
                                            <td>{new Date(expense.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                            <td><span className={`status-badge ${expense.status === 'Pago' ? 'status-green' : 'status-yellow'}`}>{expense.status}</span></td>
                                            <td>{expense.invoiceUrl ? <a href={expense.invoiceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Ver</a> : 'N/A'}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn btn-secondary" title="Editar (Não implementado)"><Icons.edit className="w-5 h-5"/></button>
                                                    <button className="btn btn-danger" onClick={() => handleDelete(expense.id)}><Icons.delete className="w-5 h-5"/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
             {activeTab !== 'Despesas' && (
                <div className="card">
                    <h2>{activeTab}</h2>
                    <p>Página em construção.</p>
                </div>
             )}
        </div>
    );
}

export default RecursosHumanos;
