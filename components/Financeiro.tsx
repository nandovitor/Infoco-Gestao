
import React, { useState, useEffect } from 'react';
import { FinancialDetail } from '../lib/types';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const Financeiro = () => {
  const [financialDetails, setFinancialDetails] = useState<FinancialDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/financeiro');
        const data = await response.json();
        setFinancialDetails(data);
      } catch (error) {
        console.error("Failed to fetch financial details", error);
        alert('Falha ao buscar detalhes financeiros.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const totalPaid = financialDetails.reduce((acc, item) => acc + Number(item.paid), 0);
  const totalPending = financialDetails.reduce((acc, item) => acc + Number(item.pending), 0);
  const totalGeneral = totalPaid + totalPending;

  const maxChartValue = Math.max(...financialDetails.map(item => Number(item.paid)), 1);

  if (isLoading) {
    return <div className="card"><h1>Balanço Financeiro</h1><p>Carregando...</p></div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Balanço Financeiro</h1>
      </div>
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="card"><h3>Total Pago</h3><p style={{ color: 'var(--secondary-color)' }}>{formatCurrency(totalPaid)}</p></div>
        <div className="card"><h3>Total Pendente</h3><p style={{ color: 'var(--warning-color)' }}>{formatCurrency(totalPending)}</p></div>
        <div className="card"><h3>Balanço Geral</h3><p style={{ color: 'var(--primary-color)' }}>{formatCurrency(totalGeneral)}</p></div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Balanço por Município</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '250px', padding: '1rem', borderTop: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)'}}>
          {financialDetails.map(item => (
            <div key={item.municipio} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '0.25rem' }}>
                <div style={{display: 'flex', alignItems: 'flex-end', height: '100%'}}>
                    <div title={`Pago: ${formatCurrency(Number(item.paid))}`} style={{ width: '30px', backgroundColor: 'var(--secondary-color)', height: `${(Number(item.paid) / maxChartValue) * 90}%`, marginRight: '4px' }}></div>
                    <div title={`Pendente: ${formatCurrency(Number(item.pending))}`} style={{ width: '30px', backgroundColor: 'var(--warning-color)', height: `${(Number(item.pending) / maxChartValue) * 90}%` }}></div>
                </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--dark-gray-color)', marginTop: '0.5rem' }}>{item.municipio}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Detalhes Financeiros</h2>
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Município</th>
                <th style={{ color: 'var(--secondary-color)' }}>Valor Pago</th>
                <th style={{ color: 'var(--warning-color)' }}>Valor Pendente</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {financialDetails.map((item) => (
                <tr key={item.municipio}>
                  <td>{item.municipio}</td>
                  <td style={{ color: 'var(--secondary-color)', fontWeight: 500 }}>{formatCurrency(Number(item.paid))}</td>
                  <td style={{ color: 'var(--warning-color)', fontWeight: 500 }}>{formatCurrency(Number(item.pending))}</td>
                  <td>{formatCurrency(Number(item.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Financeiro;
