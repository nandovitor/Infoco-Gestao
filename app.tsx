import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import Funcionarios from './components/Funcionarios';
import Tarefas from './components/Tarefas';
import Financeiro from './components/Financeiro';
import RecursosHumanos from './components/RecursosHumanos';
import ZohoMail from './components/ZohoMail';
import Settings from './components/Settings';
import InfoCoIA from './components/InfoCoIA';
import { Page, pages } from './lib/data';

const pageComponents: { [key in Page]: React.ComponentType } = {
  Dashboard,
  'Notas de Atualização': () => <div className="card"><h1>Notas de Atualização</h1><p>Página em construção.</p></div>,
  'Base de Dados': () => <div className="card"><h1>Base de Dados por Município</h1><p>Página em construção.</p></div>,
  'Funcionários': Funcionarios,
  Tarefas,
  Financeiro,
  'Recursos Humanos': RecursosHumanos,
  'ADM Infoco': () => <div className="card"><h1>ADM Infoco</h1><p>Página em construção.</p></div>,
  Patrimônio: () => <div className="card"><h1>Patrimônio da Empresa</h1><p>Página em construção.</p></div>,
  Municípios: () => <div className="card"><h1>Gerenciar Municípios</h1><p>Página em construção.</p></div>,
  Relatórios: () => <div className="card"><h1>Relatórios e Análises</h1><p>Página em construção.</p></div>,
  Usuários: () => <div className="card"><h1>Gerenciamento de Usuários</h1><p>Página em construção.</p></div>,
  'Email (Zoho)': ZohoMail,
  Configurações: Settings,
};

export const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPage = pages.find(p => p.id === hash);
      setCurrentPage(validPage ? (validPage.id as Page) : 'Dashboard');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const CurrentPageComponent = pageComponents[currentPage] || Dashboard;

  return (
    <>
      <TopNav currentPage={currentPage} />
      <main>
        <CurrentPageComponent />
      </main>
      <InfoCoIA />
    </>
  );
};