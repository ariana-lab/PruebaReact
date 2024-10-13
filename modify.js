import { readFile, writeFile } from 'fs/promises';
import path from 'path';

// Ruta hacia tu archivo JSON (ajusta si es necesario)
const jsonPath = path.resolve('src', 'data.json');

// Función para leer el archivo JSON
async function readJson() {
  try {
    const data = await readFile(jsonPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo el archivo JSON:', error);
    throw error;
  }
}

// Función para escribir el archivo JSON actualizado
async function writeJson(data) {
  try {
    await writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Archivo JSON actualizado correctamente.');
  } catch (error) {
    console.error('Error escribiendo el archivo JSON:', error);
    throw error;
  }
}

// Función para agregar IDs a los elementos del JSON como strings
async function addIdsToJson() {
  try {
    const animeList = await readJson();
    
    animeList.forEach((anime, index) => {
      if (!anime.id) {
        anime.id = (index + 1).toString();  // Agrega un ID secuencial como string si no existe
      }
    });

    await writeJson(animeList);
  } catch (error) {
    console.error('Error actualizando el JSON:', error);
  }
}

// Ejecuta la función
addIdsToJson();
