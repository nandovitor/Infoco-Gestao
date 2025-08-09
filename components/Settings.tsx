import React from 'react';

const Settings = () => {
  return (
    <div>
      <div className="page-header">
        <h1>Configurações Gerais</h1>
      </div>

      <div className="card">
        <h2>Aparência do Sistema</h2>
        <p>Personalize a identidade visual do sistema.</p>
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <h4>Logo da Tela de Login</h4>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem'}}>
            <img src="https://i.imgur.com/K07g1Qh.png" alt="logo" style={{width: '60px', height: '60px', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '5px'}} />
            <button className="btn btn-secondary">Alterar Imagem</button>
            <button className="btn btn-primary">Salvar</button>
            <button className="btn btn-danger">Remover</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
                <h2>Integrações</h2>
                <p>Gerencie conexões com sistemas externos para troca de informações.</p>
            </div>
            <button className="btn btn-primary">Adicionar Integração</button>
        </div>
         <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--dark-gray-color)' }}>
            Nenhuma integração cadastrada.
        </div>
      </div>
      
       <div className="card">
        <h2>Permissões por Função</h2>
        <p>Controle o que cada função de usuário pode ver e fazer.</p>
         <div className="table-container" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Permissão</th>
                        <th>Diretor</th>
                        <th>Coordenador</th>
                        <th>Suporte</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Simplified for brevity */}
                    <tr><td>Visualizar Dashboard</td><td>✅</td><td>✅</td><td>✅</td></tr>
                    <tr><td>Gerenciar Base de Dados</td><td>✅</td><td>❌</td><td>❌</td></tr>
                    <tr><td>Gerenciar Funcionários</td><td>✅</td><td>✅</td><td>❌</td></tr>
                    <tr><td>Gerenciar Tarefas</td><td>✅</td><td>✅</td><td>✅</td></tr>
                    <tr><td>Gerenciar Financeiro e Municípios</td><td>✅</td><td>❌</td><td>❌</td></tr>
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};

export default Settings;
