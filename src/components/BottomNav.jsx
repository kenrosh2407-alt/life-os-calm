import { NavLink } from 'react-router-dom';
import { Home, User, DollarSign, Heart, Settings } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/you', label: 'You', icon: User },
  { to: '/finance', label: 'Finance', icon: DollarSign },
  { to: '/health', label: 'Health', icon: Heart },
  { to: '/profile', label: 'Profile', icon: Settings }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(t => {
        const IconComponent = t.icon;
        return (
          <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <IconComponent size={18} className="nav-ico" />
            <span className="nav-label">{t.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}