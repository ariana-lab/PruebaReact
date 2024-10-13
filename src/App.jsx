import React, { useState, useEffect } from "react";
import "./App.css";
import axios from 'axios';


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
  }); 

  const [isEditing, setIsEditing] = useState(false);
  const [currentAnimeId, setCurrentAnimeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const API = import.meta.env.VITE_API_URL;


  const getAnimeList = async () => {
    
    try {
      const res = await axios.get(`${API}/Anime`);
      console.log(res.data)
      setAnimeList(res.data);  // Actualiza el estado solo una vez
    } 
    catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };
  useEffect(() => {
    getAnimeList();
    }, [])
  
  // Agregar un nuevo anime
  const addAnime = (e) => {
    e.preventDefault();
    if (!anime.title.text || !anime.studio || !anime.genres || !anime.description)
      return;

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

    fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAnime),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error adding new anime");
        }
        return response.json();
      })
      .then(() => {
        setAnimeList([...animeList, newAnime]);
        setShowModal(false);
      })
      .catch((error) => console.error("Error adding new anime:", error));
    setAnime({
      studio: "",
      genres: "",
      hype: 0,
      description: "",
      title: { text: "", link: "" },
      start_date: "",
      image,
    });
  };

  /*const addIdToAnimeList = (animeList) => {
    let nextId = 1;
    animeList.forEach((anime) => {
      if (anime.id && anime.id >= nextId) {
        nextId = anime.id + 1;
      }
    });

    return animeList.map((anime) => {
      if (!anime.id) {
        anime.id = nextId; 
        nextId++; 
      }
      return anime;
    });
  };
  useEffect(() => {
    const animeListWithIds = addIdToAnimeList(animeData);
    setAnimeList(animeListWithIds);
  }, []); */
  
  // Eliminar un anime
  const deleteAnime = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este anime?"
    );

    if (confirmDelete) {
      try {
        // Hacer una petición DELETE a la API para eliminar el anime
        const response = await fetch(`${API}/Anime/${id}`, {
          method: "DELETE",
        });

        // Comprobar si la respuesta es ok
        if (!response.ok) {
          throw new Error(`Error deleting anime: ${response.statusText}`);
        }

        // Actualizar la lista de animes en el estado
        setAnimeList(animeList.filter((anime) => anime.id !== id));

        // Opcional: Si quieres obtener la lista actualizada desde la API
        await getAnimeList();
      } catch (error) {
        console.error("Error deleting anime:", error);
      }
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
  const updateAnime = (e) => {
    e.preventDefault();

    fetch(`${API}/${currentAnimeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateAnime),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating anime");
        }
        return response.json();
      })
      .then(() => {
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
      })
      .catch((error) => console.error("Error updating anime:", error));
  };

  // Búsqueda de anime
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAnimeList = animeList.filter((anime) =>
    anime.title && anime.title.text && anime.title.text.toLowerCase().includes(searchTerm.toLowerCase())
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
