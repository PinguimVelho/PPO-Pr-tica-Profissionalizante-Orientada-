const btn = document.querySelector('#enviar-musica')
const formulario = document.querySelector('form')
const inputs = formulario.querySelectorAll('input')

const salvarMusiquinha = () => {
  alert(
    inputs.querySelector('#title').value +
    inputs.querySelector('#autor').value +
    inputs.querySelector('#genero').value 
  );
  
}


btn.addEventListener('click', salvarMusiquinha)

/*

//================
// Eventos
// ===============

btn.addEventListener('click', salvarMusica())

//================

// Local Storage
const setLocalStorage = (musicas_db) => localStorage.setItem('musicas_db', JSON.stringify)
const geLocalStorage = () => JSON.parse(localStorage.getItem('musicas_db')) ?? []

// Classe

class Musica {
  constructor(titulo, autor, genero ) {
    this.titulo = titulo;
    this.autor = autor;
    this.genero = genero;
  }
}

// CRUD

const createMusica = (musica) => {
    const musicas_db = readMusicas()
    musicas_db.push = musica
    setLocalStorage(musicas_db)
}


const readMusicas = () => getLocalStorage()


const updateMusica = (index, updMusica) => {
    const musicas_db = readMusicas()
    musicas_db[index] = updMusica
    setLocalStorage(musicas_db)
}


const deleteMusica = () => {
    const musicas_db = readMusicas()
    musicas_db.splice(index, 1)
    setLocalStorage(musicas_db)
}

// Salvar musica

const salvarMusica = () => {
    
}

*/