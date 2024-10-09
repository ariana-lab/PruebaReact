import React, { useState, useEffect } from "react";
import axios from 'axios'; 
import "./App.css";
import data from "./data.json";

function App() {
  const [animeList, setAnimeList] = useState([]);
  const [anime, setAnime] = useState({
    studio: "",
    genres: "",
    hype: 0,
    description: "",
    title: { text: "", link: "" },
    start_date: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnimeId, setCurrentAnimeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL='https://66fffb4b4da5bd237552c00b.mockapi.io/api/v1/:endpoint'

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setUsers(response.data); // Actualizar el estado con los datos recibidos
      })
      .catch((error) => {
        console.error('Error fetching data from MockAPI:', error);
      });
  }, []);

  const addAnime = (e) => {
    e.preventDefault();
    if (
      !anime.title.text ||
      !anime.studio ||
      !anime.genres ||
      !anime.description
    )
      return;

    const newAnime = {
      ...anime,
      id: Date.now(),
      genres: Array.isArray(anime.genres)
        ? anime.genres
        : anime.genres.split(", ").map((genre) => genre.trim()),
    };
    setAnimeList([...animeList, newAnime]);
    setAnime({
      studio: "",
      genres: "",
      hype: 0,
      description: "",
      title: { text: "", link: "" },
      start_date: "",
    });
    setShowModal(false);
  };

  const deleteAnime = (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este anime?"
    );
    if (confirmDelete) {
      setAnimeList(animeList.filter((anime) => anime.hype !== id));
    }
  };

  const editAnime = (anime) => {
    setIsEditing(true);
    setAnime(anime);
    setCurrentAnimeId(anime.id);
    setShowEditModal(true);
  };

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

  const updateAnime = (e) => {
    e.preventDefault();
    setAnimeList(
      animeList.map((item) =>
        item.id === currentAnimeId
          ? {
              ...item,
              ...anime,
              genres: Array.isArray(anime.genres)
                ? anime.genres
                : anime.genres.split(", ").map((genre) => genre.trim()),
            }
          : item
      )
    );
    closeModal();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAnimeList = animeList.filter((anime) =>
    anime.title.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>
        <img src="./img/tituloAnime.png" alt=""></img>
      </h1>
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
                onClick={() => deleteAnime(anime.hype)}
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
            <form onSubmit={addAnime}>
              <input
                type="text"
                placeholder="Título del anime"
                value={anime.title.text}
                onChange={(e) =>
                  setAnime({
                    ...anime,
                    title: { ...anime.title, text: e.target.value },
                  })
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
                onChange={(e) =>
                  setAnime({
                    ...anime,
                    hype: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
              <textarea
                placeholder="Descripción del anime"
                value={anime.description}
                onChange={(e) =>
                  setAnime({ ...anime, description: e.target.value })
                }
              />
              <button type="submit">Agregar Anime</button>
              <button type="button" onClick={closeModal}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Anime</h2>
            <form onSubmit={updateAnime}>
              <input
                type="text"
                value={anime.title.text}
                onChange={(e) =>
                  setAnime({
                    ...anime,
                    title: { ...anime.title, text: e.target.value },
                  })
                }
              />
              <input
                type="text"
                value={anime.studio}
                onChange={(e) => setAnime({ ...anime, studio: e.target.value })}
              />
              <input
                type="text"
                value={
                  Array.isArray(anime.genres)
                    ? anime.genres.join(", ")
                    : anime.genres
                }
                onChange={(e) => setAnime({ ...anime, genres: e.target.value })}
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
              />
              <textarea
                value={anime.description}
                onChange={(e) =>
                  setAnime({ ...anime, description: e.target.value })
                }
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