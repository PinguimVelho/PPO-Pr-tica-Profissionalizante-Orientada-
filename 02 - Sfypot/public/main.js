const formulario = document.querySelector('form')
const btn = document.querySelector('#enviar-musica')
const btnCancel = document.querySelector('#cancelar-musica')
const tbody = document.querySelector("tbody");

const botaoNext = document.querySelector('#botaoNext')
const botaoPlayPause = document.querySelector('#botaoPlayPause')
const botaoBack = document.querySelector('#botaoBack')

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
  await criarLinha()
  await updateTabela()
  }
}

const formatarDuracao = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg.toString().padStart(2, "0")}`;
}

const criarLinha = async () => {
  const musicas_db = await getIndexedDB()
  for (let index = 0; index < musicas_db.length; index++) { 
    const musica = musicas_db[index];
    const audioURL = URL.createObjectURL(musica.mp3)
    const audio = new Audio(audioURL)

    await new Promise(resolve => {
      audio.onloadedmetadata = resolve
    })
    const duracao = audio.duration

    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td><button type="button" id="play-${index}-${audioURL}">▶</button>
    <td>${musica.titulo}</td>
    <td>${musica.autor}</td>
    <td>${formatarDuracao(duracao)}</td>
    <td>
      <button type="button" id="edit-${index}">Editar</button>
      <button type="button" id="delete-${index}">Apagar</button>
    </td>
    `

    tbody.appendChild(newRow);
  }
}

const updateTabela = async () => {
  limparTabela()
  await criarLinha()
}

const limparTabela = () => {
    tbody.innerHTML = '';
}

const playEditDelete = async (event) => {
  if (event.target.type == 'button') {
    const [action, indexStr, audioURL] = event.target.id.split('-')
    const index = Number(indexStr)
    if (action == 'edit') {
      alert('depois resolvo this') // RESOLVE RESOLVE RESOLVE RESOLVE RESOLVE RESOLVE RESOLVE RESOLVE RESOLVE RESOLVE RESOLVE RESOLVE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      return
    }
    if (action == 'delete') {
      const musicas_db = await getIndexedDB()
      const response = confirm(`Deseja mesmo excluir a música ${musicas_db[index].titulo}?`)
      if (response == true) {
        await deleteMusica(index)
        await updateTabela()    
      }
      return
    }
    if (action == 'play') {
      const botao = tbody.querySelector(`#play-${index}`)
      audio.addEventListener('ended', () => {
        botao.textContent = "▶"
      })

      if (audio.paused) {
        audio.chamarPlayer();
        botao.textContent = "⏸"
        return
      }
      audio.pause()
      botao.textContent = "▶"
    }
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
// =======================================
// Modal
// =======================================

const openModal = () => document.querySelector('.modal').classList.add('active');

const closeModal = () => {
    document.querySelector('.modal').classList.remove('active')
}

//================
// Eventos
// ===============

document.querySelector('#cadastrarMusica')
    .addEventListener('click', openModal);

document.querySelector('#cancelMusica')
    .addEventListener('click', closeModal);

btn.addEventListener('click', salvarMusica);
// btnCancel.addEventListener('click' () => {})

document.querySelector('html')
  .addEventListener('load', updateTabela());

tbody.addEventListener('click', playEditDelete);