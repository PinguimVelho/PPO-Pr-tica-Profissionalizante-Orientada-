//CRUD - Create Read Update Delete

const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []

//CRUD - Create:
const createClient = (client) => {  
    const dbClient = getLocalStorage();
    dbClient.push (client);
    setLocalStorage(dbClient);
}

//CRUD - Read:
const readClient = () => getLocalStorage()

//CRUD - Update:
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
}

//CRUD - Delete:
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index,1);
    setLocalStorage(dbClient);
}






//Verifica se os campos estão validos e depois salva um novo cliente // e por fim ele apaga os dados e fecha o modal
const isValidFields = () => {
    return document.getElementById('form').reportValidity();
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            id: document.getElementById('id').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (!index ||index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
        activeNotification("Cliente Salvo!!", '#06b6d4')
    }
}

const openModal = () => document.getElementById('modal').classList.add('active');

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active');
}






const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.id}</td>
    <td>${client.email}</td>
    <td>${client.telefone}</td>
    <td>${client.cidade}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const updateTable = (dbClient = readClient()) => {
    clearTable()
    dbClient.forEach(createRow)
}


const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
            
        } else{
            const client = readClient()[index]
            const response = confirm (`Deseja mesmo excluir o cliente ${client.nome}?`)
            if (response == true) {
                deleteClient(index)
                updateTable()    
                activeNotification("Cliente Deletado!!", '#f43f5e')
            }
        }
    }
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('id').value = client.id
    document.getElementById('email').value = client.email
    document.getElementById('telefone').value = client.telefone
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client  = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
    
}

const filtrar = (value) => {
    const dbClient = readClient()
    const typeFiltro = document.getElementById('tipoFiltro').value
    return dbClient.filter(
        client => client[typeFiltro]?.toString().toLowerCase().includes(value.toLowerCase()))
}

const updateFiltro = (evento) => {
    let value;
    if (evento instanceof Event) {
        value = evento.target.value
    }
    else {value = evento}
    const filtrado = filtrar(value)
    updateTable(filtrado)
}

const mudeiFiltro = () => {
    const inputValue = document.getElementById('barraPesquisa').value
    updateFiltro(inputValue)
}

const changePlaceholder = () => {
    const tipo = document.getElementById('tipoFiltro').value
    const tipoUpper = tipo.charAt(0).toUpperCase() + tipo.slice(1)
    document.getElementById('barraPesquisa').placeholder = `Pesquisar por ${tipoUpper}`
}

const activeNotification = (mensagem, cor) => {
    const notification = document.getElementById('notification')
    notification.innerHTML = mensagem
    notification.style.backgroundColor = cor
    setTimeout(() => {
        notification.style.opacity = 1
    }, 300)
    setTimeout(() => {
        notification.style.opacity = 0
    }, 4500)

}
    
//Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);

document.getElementById('salvar')
    .addEventListener('click', saveClient);

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

document.querySelector('#tableClient>tbody')//editar
    .addEventListener('click', editDelete)

document.getElementById('tableClient')
    .addEventListener('load', updateTable())

document.getElementById('barraPesquisa')
    .addEventListener('input', updateFiltro)

document.getElementById('tipoFiltro')
    .addEventListener('change', mudeiFiltro)

document.getElementById('tipoFiltro')
    .addEventListener('change', changePlaceholder)
