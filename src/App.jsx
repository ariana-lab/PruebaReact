import React, { useState, useEffect } from 'react';
import './App.css';
import data from './data.json';

function App() {

  const [animeList, setAnimeList] = useState(()=> {
    const savedAnimeList = localStorage.getItem('animeList');
    return savedAnimeList ? JSON.parse(savedAnimeList) : [{data}];
  });
  const [anime, setAnime] = useState({
    studio: '',
    genres: '',
    hype: 0,
    description: '',
    title: { text: '', link: '' },
    start_date: '',
  }); // Objeto individual para crear/editar animes
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnimeId, setCurrentAnimeId] = useState(null);
  const [showModal, setShowModal] = useState(false);  // Controla el modal de agregar
  const [showEditModal, setShowEditModal] = useState(false); // Controla el modal de editarb

  // Crear un nuevo anime
  const addAnime = (e) => {
    e.preventDefault();
    if (!anime.title.text || !anime.studio || !anime.genres || !anime.description) return;

    const newAnime = { ...anime, id: Date.now(), genres: anime.genres.split(', ') };
    setAnimeList([...animeList, newAnime]);
    setAnime({
      studio: '',
      genres: '',
      hype: 0,
      description: '',
      title: { text: '', link: '' },
      start_date: '',
    });
    setShowModal(false); // Cerrar el modal después de añadir
  };

  // Eliminar un anime
  const deleteAnime = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este anime?");
    if (confirmDelete) {
      setAnimeList(animeList.filter((anime) => anime.hype !== id));
    }
  };

  // Editar un anime (Abrir modal)
  const editAnime = (anime) => {
    setIsEditing(true);
    setAnime(anime);
    setCurrentAnimeId(anime.id);
    setShowEditModal(true); // Mostrar modal de edición
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false); // Para agregar
    setShowEditModal(false); // Para editar
    setAnime({
      studio: '',
      genres: '',
      hype: 0,
      description: '',
      title: { text: '', link: '' },
      start_date: '',
    });
    setIsEditing(false);
    setCurrentAnimeId(null);
  };

  // Actualizar un anime editado
  const updateAnime = (e) => {
    e.preventDefault();
    setAnimeList(
      animeList.map((item) =>
        item.id === currentAnimeId ? { ...item, ...anime, genres: anime.genres.split(', ') } : item
      )
    );
    closeModal(); // Cerrar modal después de editar
  };
  const [searchTerm, setSearchTerm] = useState('');

  //Guardamos la lista de animes en el localStorage cada vez que se actualice
  useEffect(() => {
    if (!localStorage.getItem('animeList')) {
      setAnimeList(data);
    }
  }, []);
  
  // Función para manejar el cambio en la barra de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Filtrar los animes según el término de búsqueda
  const filteredAnimeList = animeList.filter((anime) =>
    anime.title.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="container">
      <h1><img src='./img/tituloAnime.png' alt=''></img></h1>
      <input
        type="text"
        placeholder="Buscar anime..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <button className="add-btn" onClick={() => setShowModal(true)}>
        Agregar Anime
      </button>
      <ul>
        {filteredAnimeList.map((anime) => (
          <li key={anime.id} className="anime-item">
            <div className="anime-info">
              <a href={anime.title.link} target="_blank" rel="noopener noreferrer">
                <img className="anime-img" src={anime.image} alt="Imagen del anime" />
              </a>
              <div className="anime-details">
                <h2><a href={anime.title.link} target="_blank" rel="noopener noreferrer">{anime.title.text}</a></h2>
                <p><strong>Estudio:</strong> {anime.studio}</p>
                <p><strong>Géneros:</strong> {anime.genres.join(', ')}</p>
                <p><strong>Hype:</strong> {anime.hype}</p>
                <p>{anime.description}</p>
                <a href={anime.title.link} target="_blank" rel="noopener noreferrer">Ver más</a>
              </div>
            </div>
            <div className="anime-actions">
              <button className="edit" onClick={() => editAnime(anime)}>Editar</button>
              <button className="delete" onClick={() => deleteAnime(anime.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
      {/* Modal para agregar anime */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Agregar Anime</h2>
            <form onSubmit={addAnime}>
              <input
                type="text"
                placeholder="Título del anime"
                value={anime.title.text}
                onChange={(e) =>
                  setAnime({ ...anime, title: { ...anime.title, text: e.target.value } })
                }
              />
              <input
                type="text"
                placeholder="Estudio"
                value={anime.studio}
                onChange={(e) => setAnime({ ...anime, studio: e.target.value })}
              />
              <input
                type="text"
                placeholder="Géneros (separados por coma)"
                value={anime.genres}
                onChange={(e) => setAnime({ ...anime, genres: e.target.value })}
              />
              <input
                type="number"
                placeholder="Hype"
                value={anime.hype}
                onChange={(e) => setAnime({ ...anime, hype: parseInt(e.target.value, 10) || 0 })}
              />
              <textarea
                placeholder="Descripción del anime"
                value={anime.description}
                onChange={(e) => setAnime({ ...anime, description: e.target.value })}
              />
              <button type="submit">Agregar Anime</button>
              <button type="button" onClick={closeModal}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Modal para editar anime */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Anime</h2>
            <form onSubmit={updateAnime}>
              <input
                type="text"
                value={anime.title.text}
                onChange={(e) =>
                  setAnime({ ...anime, title: { ...anime.title, text: e.target.value } })
                }
              />
              <input
                type="text"
                value={anime.studio}
                onChange={(e) => setAnime({ ...anime, studio: e.target.value })}
              />
              <input
                type="text"
                value={anime.genres}
                onChange={(e) => setAnime({ ...anime, genres: e.target.value })}
              />
              <input
                type="text"
                value={anime.hype}
                onChange={(e) => setAnime({ ...anime, hype: e.target.value })}
              />
              <textarea
                value={anime.description}
                onChange={(e) => setAnime({ ...anime, description: e.target.value })}
              />
              <button type="submit">Guardar cambios</button>
              <button type="button" onClick={closeModal}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

