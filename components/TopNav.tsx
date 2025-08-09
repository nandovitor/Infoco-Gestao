import React, { useState } from 'react';
import { Page, pages } from '../lib/data';
import { Icons } from '../lib/icons';

const NavLink: React.FC<{ page: any; currentPage: Page }> = ({ page, currentPage }) => {
  const Icon = Icons[page.icon as keyof typeof Icons] || Icons.dashboard;
  const hasSubItems = page.subItems && page.subItems.length > 0;
  const isActive = currentPage === page.id || (hasSubItems && page.subItems.some((sub:any) => sub.id === currentPage));

  if (hasSubItems) {
    return (
      <li className="nav-item">
        <span className={`nav-link ${isActive ? 'active' : ''}`}>
          <Icon className="w-5 h-5" />
          <span>{page.label}</span>
        </span>
        <ul className="dropdown-menu">
          {page.subItems.map((subItem: any) => (
            <li key={subItem.id}>
              <a href={`#${subItem.id}`} className="dropdown-item">{subItem.label}</a>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="nav-item">
      <a href={`#${page.id}`} className={`nav-link ${isActive ? 'active' : ''}`}>
        <Icon className="w-5 h-5" />
        <span>{page.label}</span>
      </a>
    </li>
  );
};

const TopNav = ({ currentPage, onLogout }: { currentPage: Page; onLogout: () => void; }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);

    return (
        <header className="top-nav">
            <div className="nav-left">
                <a href="#Dashboard" className="nav-logo">INFOCO</a>
            </div>
            <div className="nav-center">
                 <ul className="nav-menu">
                    {pages.map(page => <NavLink key={page.id} page={page} currentPage={currentPage} />)}
                </ul>
            </div>
            <div className="nav-right">
                <button className="nav-link" style={{position: 'relative', background: 'transparent'}}>
                    <Icons.notification className="w-6 h-6" />
                    <span style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', backgroundColor: 'var(--danger-color)', color: 'white', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                </button>
                <div className="nav-user-profile" onClick={() => setProfileOpen(!isProfileOpen)}>
                    <img src="https://i.pravatar.cc/150?u=admin" alt="User Avatar" className="user-avatar" />
                    <div className="user-info">
                        <span className="user-name">Administrador Sistema</span>
                        <span className="user-email">admin@infoco.com</span>
                    </div>
                    {isProfileOpen && (
                        <div className="dropdown-menu" style={{display: 'block', right: 0, left: 'auto'}}>
                             <a href="#Configurações" className="dropdown-item" onClick={() => setProfileOpen(false)}>Configurações Gerais</a>
                             <a href="#" className="dropdown-item" onClick={onLogout}>Sair</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopNav;
