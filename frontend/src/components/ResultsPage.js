import React, { useState, useEffect } from 'react';

// Página que muestra todos los reclamos y un recuento por categoría
function ResultsPage() {
  const [complaints, setComplaints] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/reclamos');
        const data = await res.json();
        setComplaints(data.complaints);
        setCounts(data.counts);
      } catch (error) {
        console.error('Error al obtener reclamos', error);
      }
    }
    fetchData();
  }, []);

  const getLabel = (key) => {
    switch (key) {
      case 'hoyo':
        return 'Hoyo';
      case 'desnivel':
        return 'Desnivel';
      case 'resalto_fuera_de_norma':
        return 'Resalto fuera de norma';
      case 'calle_peatonal':
        return 'Calle peatonal';
      default:
        return key;
    }
  };

  return (
    <div className="results-page">
      <h2>Reclamos reportados</h2>
      <div className="counts">
        {['hoyo', 'desnivel', 'resalto_fuera_de_norma', 'calle_peatonal'].map((cat) => (
          <div key={cat} className="count-item">
            <span className="count-number">{counts[cat] || 0}</span>
            <span className="count-label">{getLabel(cat)}</span>
          </div>
        ))}
      </div>
      <div className="complaints-list">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="complaint-card">
            <img src={complaint.photo_path} alt={complaint.category} />
            <div className="complaint-details">
              <h4>{getLabel(complaint.category)}</h4>
              <p>{complaint.description}</p>
              {complaint.address && <p className="address">{complaint.address}</p>}
              {complaint.latitude && complaint.longitude && (
                <iframe
                  title={`map-${complaint.id}`}
                  width="100%"
                  height="200"
                  src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&marker=${complaint.latitude},${complaint.longitude}`}
                ></iframe>
              )}
              <small>
                {new Date(complaint.created_at).toLocaleDateString()} {new Date(complaint.created_at).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsPage;
