import React from 'react';
import { NavLink } from 'react-router-dom';

// Barra de navegación que muestra enlaces a las distintas secciones de la aplicación
function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-title">Repara Tu Calle</div>
      <div className="nav-links">
        {/* El atributo end asegura que solo se marque activo en la ruta exacta */}
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Nuevo reclamo
        </NavLink>
        <NavLink to="/resultados" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Resultados
        </NavLink>
        <NavLink to="/informacion" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Información
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;