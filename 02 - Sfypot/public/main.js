const formulario = document.querySelector("form")
const btn = formulario.querySelector("#enviar-musica")

class Musica {
  constructor(mp3, titulo, autor, genero) {
    this.mp3 = mp3
    this.titulo = titulo;
    this.autor = autor;
    this.genero = genero;
  }
}

const createMusica = (musica) => {
  const musicas_db = getLocalStorage()
  musicas_db.push(musica)
  setLocalStorage(musicas_db)
}

const updateMusica = (index, updMusica) => {
  const musicas_db = getLocalStorage()
  musicas_db[index] = updMusica
  setLocalStorage(musicas_db)
}

const deleteMusica = () => {
  const musicas_db = getLocalStorage()
  musicas_db.splice(index, 1)
  setLocalStorage(musicas_db)
}

const salvarMusica = (e) => {
 if (camposValidos()){  
  const arquivo = formulario.querySelector("#arquivo").files[0]
  const leitor = new FileReader()
  const titulo = formulario.querySelector("#title").value
  const autor = formulario.querySelector("#autor").value
  const genero = formulario.querySelector("#genero").value

  leitor.onload = (evento) => {
    const mp3string = evento.target.result
    createMusica(new Musica( mp3string, titulo, autor, genero))
  }

  leitor.readAsDataURL(arquivo)
  }
}

// Funções usadas em funções ////////////////////

const camposValidos = () => {
  return formulario.reportValidity()
}


//================
// Local Storage
// ===============
const setLocalStorage = (musicas_db) => localStorage.setItem('musicas_db', JSON.stringify(musicas_db))
const getLocalStorage = () => JSON.parse(localStorage.getItem('musicas_db')) ?? []

//================
// Eventos
// ===============
btn.addEventListener('click', salvarMusica)