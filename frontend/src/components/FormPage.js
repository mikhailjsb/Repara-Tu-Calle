import React, { useState, useEffect } from 'react';

// Página con el formulario para reportar problemas en la calle
function FormPage() {
  const [category, setCategory] = useState('hoyo');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null, address: '' });

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation((prev) => ({ ...prev, latitude, longitude }));
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setLocation({ latitude, longitude, address: data.display_name });
        } catch (err) {
          console.error('Error obteniendo dirección', err);
        }
      },
      (err) => {
        console.error('Error obteniendo ubicación', err);
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar que se haya seleccionado una foto
    if (!photo) {
      setMessage('Debes seleccionar una foto.');
      return;
    }
    const formData = new FormData();
    formData.append('category', category);
    formData.append('description', description);
    formData.append('photo', photo);
    if (location.latitude && location.longitude) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    }
    if (location.address) {
      formData.append('address', location.address);
    }

    try {
      const res = await fetch('/api/reclamos', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setMessage('Reclamo enviado correctamente.');
        setDescription('');
        setPhoto(null);
        // Limpiar el formulario de archivo
        e.target.reset();
      } else {
        const data = await res.json();
        setMessage(data.error || 'Error al enviar el reclamo.');
      }
    } catch (error) {
      console.error('Error al enviar el reclamo', error);
      setMessage('Error al enviar el reclamo.');
    }
  };

  return (
    <div className="form-page">
      <h2>Reportar un problema</h2>
      <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
        <label htmlFor="category">Categoría:</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="hoyo">Hoyo</option>
          <option value="desnivel">Desnivel</option>
          <option value="resalto_fuera_de_norma">Resalto fuera de norma</option>
          <option value="calle_peatonal">Calle peatonal</option>
        </select>
        <label htmlFor="description">Descripción:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe el problema..."
        />
        <label htmlFor="photo">Foto:</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />
        {location.address && (
          <p className="address">Ubicación detectada: {location.address}</p>
        )}
        <button type="submit">Enviar</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default FormPage;
