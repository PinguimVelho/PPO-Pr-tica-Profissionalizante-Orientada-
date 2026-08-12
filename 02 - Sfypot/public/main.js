const formulario = document.querySelector('.form-musica')
const btnEnviar = document.querySelector('#enviar-musica')
const btnCancel = document.querySelector('#cancelMusica')
const tbody = document.querySelector("tbody");
const dataIndex_modal = formulario.querySelector('#title')

const classPlayer = document.querySelector('.player')
const musicName = classPlayer.querySelector('#musicName')
const musicAutor = classPlayer.querySelector('#musicAutor')
const spanIndex = classPlayer.querySelector('.indexMusica')
const player = classPlayer.querySelector('#audioPlayer')

const botaoBack = classPlayer.querySelector('#botaoBack')
const iconBack = botaoBack.querySelector('i')

const botaoPlayPause = classPlayer.querySelector('#botaoPlayPause')
const iconPlayPause = botaoPlayPause.querySelector('i')

const botaoNext = classPlayer.querySelector('#botaoNext')
const iconNext = document.querySelector('i')

const progress = document.querySelector(".progress")
const tempoAtual = document.querySelector("#tempoAtual")
const duracaoPlayer = document.querySelector("#duracao")

// ============

const formAlbum = document.querySelector(".form-album");
const btnCriarAlbum = document.querySelector("#enviar-album");
const btnCancelarAlbum = document.querySelector("#cancel-album");



class Album {
    constructor(capa, titulo, musicas=[]) {
        this.capa = capa;
        this.titulo = titulo;
        this.musicas = musicas;
    }
}

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
  if (camposValidos()) {

    const arquivo = formulario.querySelector('#arquivo').files[0]
    const titulo = formulario.querySelector('#title').value
    const autor = formulario.querySelector('#autor').value
    const genero = formulario.querySelector('#genero').value

    
    if (dataIndex_modal.dataset.index == 'new') {
      await createMusica(new Musica(arquivo, titulo.trim(), autor.trim(), genero.trim()))
    }
    if (dataIndex_modal.dataset.index != 'new') {
      const index = dataIndex_modal.dataset.index
      await updateMusica(index, new Musica(arquivo, titulo.trim(), autor.trim(), genero.trim()))
    }
    formulario.reset()
    limparTabela()
    await criarLinha()
    updateTabela()
    closeModal()
    dataIndex_modal.dataset.index = 'new'
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
    <td><button class="playPorMusica" type="button" id="play-${index}">▶</button>
    <td>${musica.titulo}</td>
    <td>${musica.autor}</td>
    <td>${formatarDuracao(duracao)}</td>
    <td>
      <button type="button" id="edit-${index}"><i id="edit-${index}" class="bx bxs-pencil"></i></button>
      <button type="button" id="delete-${index}"><i id="delete-${index}" class="bx bxs-trash-alt"></i></button>
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

// =======================================
// Acões da musica
// =======================================

const playEditDelete = async (event) => {
  if (event.target.type == 'button' || event.target.tagName == 'I') {
    const [action, indexStr] = event.target.id.split('-')
    const index = Number(indexStr)
    const btnPress = tbody.querySelector(`#play-${index}`)
    if (action == 'edit') {
      await actionEdit(index)
    }
    if (action == 'delete') {
      await actionDelete(index)
    }
    if (action == 'play') {
      await actionPlay(index)
    }
  }
}

const actionDelete = async (index) => {
  const musicas_db = await getIndexedDB()
  const response = confirm(`Deseja mesmo excluir a música ${musicas_db[index].titulo}?`)
  if (response == true) {
    await deleteMusica(index)
    await updateTabela()
  }
}

const actionPlay = async (index) => {
  if (player.paused && spanIndex.id == index) {
    await chamarPlayer('continue', index)
    return
  }
  if (player.paused || spanIndex.id != index) {
    await chamarPlayer('play', index);
    return
  }
  if (!player.paused && spanIndex.id == index) {
    await chamarPlayer('pause', index)
    return
  }
}

const actionEdit = async (index) => {
  const musicas_db = await getIndexedDB()
  const musica = musicas_db[index]

  dataIndex_modal.dataset.index = index
  await preencherCampos(musica)
  openModal()
}

const preencherCampos = async (musica) => {
  const dt = new DataTransfer();
  dt.items.add(musica.mp3)
  formulario.querySelector('#arquivo').files = dt.files
  formulario.querySelector('#title').value = musica.titulo
  formulario.querySelector('#autor').value = musica.autor
  formulario.querySelector('#genero').value = musica.genero
}

// A partir daqui é o player

const chamarPlayer = async (action, index) => {
  const musicas_db = await getIndexedDB()
  const musica = musicas_db[index]
  const audioURL = URL.createObjectURL(musica.mp3)
  const btnPress = tbody.querySelector(`#play-${index}`)
  pausarTudo()
  if (action == 'play') {
    musicName.textContent = musica.titulo
    musicAutor.textContent = musica.autor
    player.src = audioURL
    spanIndex.id = index
    player.play()
    btnPress.textContent = '⏸'
    iconPlayPause.className = 'bx bx-pause'
  }
  if (action == 'pause') {
    player.pause()
    btnPress.textContent = '▶'
    iconPlayPause.className = 'bx bx-play'
  }
  if (action == 'continue') {
    player.play()
    btnPress.textContent = '⏸'
    iconPlayPause.className = 'bx bx-pause'
  }
}

const pausarTudo = () => {
  const botoesPlay = document.querySelectorAll('.playPorMusica')
  botoesPlay.forEach(button => {
    button.textContent = '▶'
  });
}

const camposValidos = () => formulario.reportValidity()

// =======================================
// Botões do Player
// =======================================

const Back = async () => {
  if (spanIndex.id > 0) {
    const newIndex = Number(spanIndex.id) - 1
    await chamarPlayer('play', newIndex)
  }
}

const PlayPause = async () => {
  if (spanIndex.id != -1) {
    if (player.paused) {
      const btnPress = tbody.querySelector(`#play-${spanIndex.id}`)
      player.play()
      iconPlayPause.className = 'bx bx-pause'
      btnPress.textContent = '⏸'
      return
    }
    pausarTudo()
    player.pause()
    iconPlayPause.className = 'bx bx-play'
  }
}

const Next = async () => {
  const musicas_db = await getIndexedDB()
  if (spanIndex.id < (musicas_db.length) - 1) {
    const newIndex = Number(spanIndex.id) + 1;

    await chamarPlayer('play', newIndex)
  }
}

const atualizarBarra = () => {
  if (!player.duration) return
  const porcentagem = (player.currentTime / player.duration) * 100
  progress.style.width = `${porcentagem}%`
  tempoAtual.textContent = formatarDuracao(player.currentTime)
  duracaoPlayer.textContent = formatarDuracao(player.duration)

}

// =======================================
// Modal
// =======================================

const openModal = () => {
  document.querySelector('.modal').classList.add('active');
  closeAlbumModal()
}
const closeModal = () => {
  document.querySelector('.modal').classList.remove('active')
}


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

const getLocalStorage = () => JSON.parse(localStorage.getItem('albuns_db'))

const setLocalStorage = (array) => localStorage.setItem('albuns_db', JSON.stringify(array))

// ========================================================
// Criar Albuns 🌟
// ========================================================

const openAlbumModal = () => {
  document.querySelector('.modal_2').classList.add('active');
  closeModal()
}

const closeAlbumModal = () => {
  document.querySelector('.modal_2').classList.remove('active')
}

const salvarAlbum = () => {
  const capa = formAlbum.querySelector('#capa-album')
  const titulo = formAlbum.querySelector('#titulo-album')
  const musicas = []

  createAlbum(new Album(capa, titulo, [1,,3]))
}

const createAlbum = (album) => {
  const albuns_db = getLocalStorage()
  albuns_db.push(album)
  setLocalStorage(albuns_db)
}

const updateAlbum = (index, updMusica) => {
  const albuns_db = getLocalStorage()
  albuns_db[index] = updMusica
  setLocalStorage(albuns_db)
}

const deleteAlbum = (index) => {
  const albuns_db = getLocalStorage()
  albuns_db.splice(index, 1)
  setLocalStorage(albuns_db)
}


//================
// Eventos
// ===============

document.querySelector('#cadastrarMusica') // Abrir o modal
  .addEventListener('click', openModal);

document.querySelector('#cancelMusica')    // Fechar o modal
  .addEventListener('click', () => {
    closeModal()
    formulario.reset()
    dataIndex_modal.dataset.index = 'new'
  }) ;

btnEnviar.addEventListener('click', salvarMusica); // salvar a musicakk

tbody.addEventListener('click', playEditDelete);  // funções de play edit e delete de cada música

player.addEventListener('ended', () => {
  pausarTudo
  iconPlayPause.className = 'bx bx-play'
})

//eventos do player
botaoBack.addEventListener('click', Back)
botaoPlayPause.addEventListener('click', PlayPause)
botaoNext.addEventListener('click', Next)

player.addEventListener('timeupdate', atualizarBarra)

// CRIAR ÁLBUMM

document.querySelector('#criarAlbum')
  .addEventListener('click', openAlbumModal)

document.querySelector('#cancel-album')    // Fechar o modal
  .addEventListener('click', () => {
    closeAlbumModal()
    formAlbum.reset()
    dataIndex_modal.dataset.index = 'new'
  });

btnCriarAlbum.addEventListener('click', salvarAlbum)




updateTabela()