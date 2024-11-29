import React, { useState, useEffect } from "react";
import "./App.css";
import axios from 'axios';
import tituloAnime from "./img/tituloAnime.png"
// hola ari

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [anime, setAnime] = useState({
    id:"",
    studio: "",
    genres: "",
    hype: 0,
    description: "",
    title: { text: "", link: "" },
    start_date: "",
    image: "",  
  }); 
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnimeId, setCurrentAnimeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const API = import.meta.env.VITE_API_URL;


  const getAnimeList = async () => {
      const res = await axios.get(`${API}`);

      setAnimeList(res.data);

      
    
  };

  
  useEffect(() => {
    getAnimeList();
    }, [])
  
  // Agregar un nuevo anime
  const addAnime = async (e) => {
    e.preventDefault();
    if (!anime.title.text || !anime.studio || !anime.genres || !anime.description) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const newAnime = {
      studio: anime.studio,
      genres: Array.isArray(anime.genres)
        ? anime.genres
        : anime.genres.split(", ").map((genre) => genre.trim()),
      hype: anime.hype,
      description: anime.description,
      title: { text: anime.title.text, link: anime.title.link },
      start_date: anime.start_date,
    };
      const response = await fetch(`${API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnime),
      });
      const addedAnime = await response.json();
      
      // Actualiza la lista de animes
      setAnimeList((prevList) => [...prevList, { ...newAnime, id: addedAnime.id }]);
      
      // Cierra el modal y restablece el estado
      setShowModal(false);
      setAnime({
        studio: "",
        genres: "",
        hype: 0,
        description: "",
        title: { text: "", link: "" },
        start_date: "",
        image: "",
      });
  };
  // Eliminar un anime
  const deleteAnime = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este anime?"
    );

    if (confirmDelete) {

        const response = await fetch(`${API}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Error deleting anime: ${response.statusText}`);
        }
        
        setAnimeList(animeList.filter((anime) => anime.id !== id)); // Actualizar la lista de animes en el estado
        await getAnimeList();
    }
  };
  // Editar un anime
  const editAnime = (anime) => {
    setIsEditing(true);
    setAnime(anime);
    setCurrentAnimeId(anime.id);
    setShowEditModal(true);
  };
  // Cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setAnime({
      studio: "",
      genres: "",
      hype: 0,
      description: "",
      title: { text: "", link: "" },
      start_date: "",
    });
    setIsEditing(false);
    setCurrentAnimeId(null);
  };
  // Actualizar un anime
  const updateAnime = async (e) => {
    e.preventDefault();
        const response = await fetch(`${API}/${currentAnimeId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...anime,
                genres: Array.isArray(anime.genres)
                    ? anime.genres
                    : anime.genres.split(", ").map((genre) => genre.trim()),
            }),
        });

        const updatedAnime = await response.json();

        setAnimeList((prevList) => //Actualizar la lista de animes en el estado
            prevList.map((item) =>
                item.id === currentAnimeId ? updatedAnime : item
            )
        );
        closeModal();
  };
  // Búsqueda de anime
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredAnimeList = animeList.filter((anime) => (anime.title.text && anime.title.text.toLowerCase().includes(searchTerm.toLowerCase()))
  
  );
  
  return (
    <div className="container">
      <h1>
        <img src={tituloAnime} alt=""></img>
      </h1>
      <input
        type="text"
        placeholder="Buscar anime..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <button className="add-btn-inicio" onClick={() => setShowModal(true)}>
        Agregar Anime
      </button>
      <ul>
        {filteredAnimeList.map((anime) => (
          <li key={anime.id} className="anime-item">
            <div className="anime-info">
              <a
                href={anime.title.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="anime-img"
                  src={anime.image}
                  alt="Imagen del anime"
                />
              </a>
              <div className="anime-details">
                <h2>
                  <a
                    href={anime.title.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {anime.title.text}
                  </a>
                </h2>
                <p>
                  <strong>Estudio:</strong> {anime.studio}
                </p>
                <p>
                  <strong>Géneros:</strong>{" "}
                  {Array.isArray(anime.genres)
                    ? anime.genres.join(", ")
                    : anime.genres}
                </p>
                <p>
                  <strong>Hype:</strong> {anime.hype}
                </p>
                <p>{anime.description}</p>
                <a
                  href={anime.title.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver más
                </a>
              </div>
            </div>
            <div className="anime-actions">
              <button className="edit" onClick={() => editAnime(anime)}>
                Editar
              </button>
              <button
                className="delete"
                onClick={() => deleteAnime(anime.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Agregar Anime</h2>
            <form onSubmit={addAnime} className="from-modal">
              <input
                type="text"
                placeholder="Título del anime"
                value={anime.title.text}
                onChange={(e) =>
                  setAnime({
                    ...anime,
                    title: { ...anime.title, text: e.target.value }})
                }
                className="modal-input"
              />
              <input
                type="text"
                placeholder="Estudio"
                value={anime.studio}
                onChange={(e) => setAnime({ ...anime, studio: e.target.value })
              } 
              className="modal-input"
              />
              <input
                type="text"
                placeholder="Géneros (separados por coma)"
                value={anime.genres}
                onChange={(e) => setAnime({ ...anime, genres: e.target.value })
              } 
                className="modal-input"
              />
              <input
                type="number"
                placeholder="Hype"
                value={anime.hype}
                onChange={(e) =>
                  setAnime({
                    ...anime,
                    hype: parseInt(e.target.value, 10) || 0,
                  })
                } 
                className="modal-input"
              />
              <textarea
                placeholder="Descripción del anime"
                value={anime.description}
                onChange={(e) =>
                  setAnime({ ...anime, description: e.target.value })
                } 
                className="modal-input"
              />
              <input
                type="text"
                placeholder="URL del anime (opcional)"
                value={anime.title.link}  // Utiliza anime.title.link para almacenar la URL
                onChange={(e) =>
                  setAnime({
                    ...anime,
                    title: { ...anime.title, link: e.target.value },
                  })
                }
                className="modal-input"
              />
              <input
                type="text"
                placeholder="URL de la imagen (opcional)"
                value={anime.image}
                onChange={(e) => setAnime({ ...anime, image: e.target.value })
              }
              className="modal-input"
              />
              <div className="modal-buttons">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="add-btn">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Anime</h2>
            <form onSubmit={updateAnime} className="from-modal">
              <input
                type="text"
                value={anime.title.text}
                onChange={(e) =>
                  setAnime({
                    ...anime,
                    title: { ...anime.title, text: e.target.value },
                  })
                }
                className="modal-input"
              />
              <input
                type="text"
                placeholder="URL del anime"
                value={anime.title.link}
                onChange={(e) =>
                  setAnime({
                    ...anime,
                    title: { ...anime.title, link: e.target.value },
                  })
                }
                className="modal-input"
              />
              <input
                type="text"
                value={anime.studio}
                onChange={(e) => setAnime({ ...anime, studio: e.target.value })
              }
              className="modal-input"
              />
              <input
                type="text"
                value={
                  Array.isArray(anime.genres)
                    ? anime.genres.join(", ")
                    : anime.genres
                }
                onChange={(e) => setAnime({ ...anime, genres: e.target.value })
              }
              className="modal-input"
              />
              <input
                type="number"
                value={anime.hype}
                onChange={(e) =>
                  setAnime({
                    ...anime,
                    hype: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="modal-input"
              />
              <textarea
                value={anime.description}
                onChange={(e) =>
                  setAnime({ ...anime, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="URL de la imagen (opcional)"
                value={anime.image}
                onChange={(e) => setAnime({ ...anime, image: e.target.value })
              }
              className="modal-input"
              />

              <div className="modal-buttons">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancelar
                </button>
                <button type="submit" className="add-btn">
                Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
