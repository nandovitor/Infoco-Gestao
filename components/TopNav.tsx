import React, { useState, useRef, useEffect } from 'react';
import { Page, pages } from '../lib/data';
import { Icons } from '../lib/icons';

// Custom hook to handle clicks outside a component
const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};


const NavLink: React.FC<{ page: any; currentPage: Page; openMenu: string | null; setOpenMenu: (id: string | null) => void; }> = ({ page, currentPage, openMenu, setOpenMenu }) => {
  const Icon = Icons[page.icon as keyof typeof Icons] || Icons.dashboard;
  const hasSubItems = page.subItems && page.subItems.length > 0;
  const isActive = currentPage === page.id || (hasSubItems && page.subItems.some((sub: any) => sub.id === currentPage));
  const isMenuOpen = openMenu === page.id;
  
  const navItemRef = useRef<HTMLLIElement>(null);
  useOnClickOutside(navItemRef, () => setOpenMenu(null));

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenu(isMenuOpen ? null : page.id);
  };
  
  if (hasSubItems) {
    return (
      <li className="nav-item" ref={navItemRef}>
        <button type="button" onClick={handleToggleMenu} className={`nav-link ${isActive ? 'active' : ''}`}>
          <Icon className="w-5 h-5" />
          <span>{page.label}</span>
          <svg className="w-4 h-4" style={{transition: 'transform 0.2s', transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
        {isMenuOpen && (
          <ul className="dropdown-menu">
            {page.subItems.map((subItem: any) => (
              <li key={subItem.id}>
                <a href={`#${subItem.id}`} className="dropdown-item" onClick={() => setOpenMenu(null)}>{subItem.label}</a>
              </li>
            ))}
          </ul>
        )}
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
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(profileRef, () => {
        if (openMenu === 'user-profile') setOpenMenu(null);
    });

    return (
        <header className="top-nav">
            <div className="nav-left">
                <a href="#Dashboard" className="nav-logo">INFOCO</a>
            </div>
            <div className="nav-center">
                 <ul className="nav-menu">
                    {pages.map(page => <NavLink key={page.id} page={page} currentPage={currentPage} openMenu={openMenu} setOpenMenu={setOpenMenu} />)}
                </ul>
            </div>
            <div className="nav-right">
                <button className="nav-link" style={{position: 'relative', background: 'transparent'}}>
                    <Icons.notification className="w-6 h-6" />
                    <span style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', backgroundColor: 'var(--danger-color)', color: 'white', borderRadius: '50%', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--sidebar-bg)' }}>2</span>
                </button>
                <div className="nav-user-profile" ref={profileRef}>
                     <button type="button" className="nav-link" style={{padding: '0.25rem', borderRadius: '9999px'}} onClick={() => setOpenMenu(openMenu === 'user-profile' ? null : 'user-profile')}>
                        <img src="https://i.pravatar.cc/150?u=admin" alt="User Avatar" className="user-avatar" />
                    </button>
                    <div className="user-info" onClick={() => setOpenMenu(openMenu === 'user-profile' ? null : 'user-profile')}>
                        <span className="user-name">Administrador Sistema</span>
                        <span className="user-email">admin@infoco.com</span>
                    </div>
                    {openMenu === 'user-profile' && (
                        <div className="dropdown-menu" style={{right: 0, left: 'auto'}}>
                             <a href="#Configurações" className="dropdown-item" onClick={() => setOpenMenu(null)}>Configurações Gerais</a>
                             <a href="#" className="dropdown-item" onClick={() => { onLogout(); setOpenMenu(null); }}>Sair</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopNav;
