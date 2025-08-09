import React from 'react';
import { tasks } from '../lib/data';

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string | number, color: string }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div className="stat-info">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  </div>
);

const Calendar = () => {
    // Basic calendar logic for demonstration
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    
    const eventDays = [8,9,10,11,15,16,17,18,25,26,31];

    return (
        <div className="calendar">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3>Julho 2025</h3>
                <div>&lt; &gt;</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>S</th><th>T</th><th>Q</th><th>Q</th><th>S</th><th>S</th><th>D</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {emptyDays.map(d => <td key={`e-${d}`}></td>)}
                        {monthDays.slice(0, 7 - firstDayOfMonth).map(day => (
                            <td key={day}><div className={`day ${day === currentDay ? 'today' : ''} ${eventDays.includes(day) ? 'event' : ''}`}>{day}</div></td>
                        ))}
                    </tr>
                     {/* Simplified row generation */}
                    <tr>
                        {monthDays.slice(7 - firstDayOfMonth, 14 - firstDayOfMonth).map(day => <td key={day}><div className={`day ${day === currentDay ? 'today' : ''} ${eventDays.includes(day) ? 'event' : ''}`}>{day}</div></td>)}
                    </tr>
                     <tr>
                        {monthDays.slice(14 - firstDayOfMonth, 21 - firstDayOfMonth).map(day => <td key={day}><div className={`day ${day === currentDay ? 'today' : ''} ${eventDays.includes(day) ? 'event' : ''}`}>{day}</div></td>)}
                    </tr>
                     <tr>
                        {monthDays.slice(21 - firstDayOfMonth, 28 - firstDayOfMonth).map(day => <td key={day}><div className={`day ${day === currentDay ? 'today' : ''} ${eventDays.includes(day) ? 'event' : ''}`}>{day}</div></td>)}
                    </tr>
                     <tr>
                        {monthDays.slice(28 - firstDayOfMonth).map(day => <td key={day}><div className={`day ${day === currentDay ? 'today' : ''} ${eventDays.includes(day) ? 'event' : ''}`}>{day}</div></td>)}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const NewsFeedItem = () => (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem'}}>
        <div style={{width: '48px', height: '48px', borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--light-gray-color)'}}></div>
        <div style={{ flex: 1}}>
            <div style={{height: '1rem', backgroundColor: 'var(--light-gray-color)', marginBottom: '0.5rem', width: '80%'}}></div>
            <div style={{height: '0.75rem', backgroundColor: 'var(--light-gray-color)', width: '60%'}}></div>
        </div>
    </div>
)

const Dashboard = () => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Concluída').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pendente').length;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      <div className="stats-grid">
        <StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3"/></svg>} title="Funcionários Ativos" value={5} color="#60a5fa" />
        <StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} title="Tarefas Totais" value={totalTasks} color="#a78bfa" />
        <StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} title="Tarefas Concluídas" value={completedTasks} color="#34d399" />
        <StatCard icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} title="Tarefas Pendentes" value={pendingTasks} color="#f59e0b" />
      </div>

      <div className="dashboard-grid">
         <div className="card">
            <h2>Calendário de Eventos</h2>
            <Calendar />
         </div>
         <div className="card">
            <h2>Feed de Notícias</h2>
            <p style={{color: 'var(--dark-gray-color)', marginTop: '-0.5rem', marginBottom: '1.5rem'}}>Últimas atualizações sobre licitações e órgãos de controle.</p>
            <NewsFeedItem />
            <NewsFeedItem />
            <NewsFeedItem />
            <NewsFeedItem />
            <NewsFeedItem />
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
