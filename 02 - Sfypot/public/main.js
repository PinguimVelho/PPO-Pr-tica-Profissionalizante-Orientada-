const formulario = document.querySelector('form')
const btn = document.querySelector('#enviar-musica')

class Musica {
  constructor(mp3, titulo, autor, genero) {
    this.mp3 = mp3
    this.titulo = titulo;
    this.autor = autor;
    this.genero = genero;
  }
}

// CRUD ///////////////////////////////
const createMusica = async (musica) => {
  const musicas_db = await getIndexedDB()
  musicas_db.push(musica)
  await setIndexedDB(musicas_db)
}

const updateMusica = async (index, updMusica) => {
  const musicas_db = await getIndexedDB()
  musicas_db[index] = updMusica
  await setIndexedDB(musicas_db)
}

const deleteMusica = async (index) => {
  const musicas_db = await getIndexedDB()
  musicas_db.splice(index, 1)
  await setIndexedDB(musicas_db)
}
////////////////////////////////////

const salvarMusica = async () => {
 if (camposValidos()){  
  const arquivo = formulario.querySelector('#arquivo').files[0]
  const titulo = formulario.querySelector('#title').value
  const autor = formulario.querySelector('#autor').value
  const genero = formulario.querySelector('#genero').value
  
  await createMusica(new Musica( arquivo, titulo.trim(), autor.trim(), genero.trim()))
  formulario.reset()
  }
}

// Funções usadas em funções ////////////////////

const camposValidos = () => formulario.reportValidity()

//================
// Indexed DB
// ===============
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('musicasDB', 1)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains('dados')) {
        db.createObjectStore('dados')
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const getIndexedDB = async () => {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('dados', 'readonly')
    const store = transaction.objectStore('dados')

    const request = store.get('musicas_db')

    request.onsuccess = () => resolve(request.result ?? [])
    request.onerror = () => reject(request.error)
  })
}

const setIndexedDB = async (musicas_db) => {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('dados', 'readwrite')
    const store = transaction.objectStore('dados')

    const request = store.put(musicas_db, 'musicas_db')

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

//================
// Eventos
// ===============
btn.addEventListener('click', salvarMusica)