import React, { useState, useEffect } from 'react';

// Página informativa acerca de la iniciativa Repara Tu Calle
function InfoPage() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch('/api/info');
        const data = await res.json();
        setInfo(data);
      } catch (error) {
        console.error('Error al obtener información', error);
      }
    }
    fetchInfo();
  }, []);

  return (
    <div className="info-page">
      <h2>{info?.title || 'Información'}</h2>
      <p>{info?.content}</p>
      {info?.categories && (
        <ul>
          {info.categories.map((cat) => (
            <li key={cat.key}>
              <strong>{cat.label}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InfoPage;