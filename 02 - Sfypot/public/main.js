const formulario = document.querySelector("form")
const btn = formulario.querySelector("#enviar-musica")

class Musica {
  constructor(titulo, autor, genero ) {
    this.titulo = titulo;
    this.autor = autor;
    this.genero = genero;
  }

  static createMusica(musica) {
    const musicas_db = getLocalStorage()
    musicas_db.push(musica)
    setLocalStorage(musicas_db)
  }

   static updateMusica(index, updMusica) {
  const musicas_db = getLocalStorage()
  musicas_db[index] = updMusica
  setLocalStorage(musicas_db)
  }

  static deleteMusica() {
  const musicas_db = getLocalStorage()
  musicas_db.splice(index, 1)
  setLocalStorage(musicas_db)
  }

}

const salvarMusica = () => {
  const arquivo = formulario.querySelector("#arquivo")
  const titulo = formulario.querySelector("#title").value
  const autor = formulario.querySelector("#autor").value
  const genero = formulario.querySelector("#genero").value

  Musica.createMusica(new Musica(titulo,autor,genero))
}


// Aqui eu vou tentar fazer como o Varela ensinou. Tentar salvar as coisas em um arquivo js ao invés do localStorage, mas antes preciso falar com o Rauber sobre.
// class Playlist {
//   #musicas_db
// }


//================
// Local Storage
// ===============
const setLocalStorage = (musicas_db) => localStorage.setItem('musicas_db', JSON.stringify(musicas_db))
const getLocalStorage = () => JSON.parse(localStorage.getItem('musicas_db')) ?? []

//================
// Eventos
// ===============
btn.addEventListener('click', salvarMusica)