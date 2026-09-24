import axios from 'axios'; //biblioteca usada para facilitar a comunicação

const url = import.meta.env.VITE_BACK_URL

const api_unidade = axios.create({ //create por estar criando uma conexão com o servidor
    baseURL: url // endereço que o backEnd fica(o endpoint vai ser passado depois)
});

export default api_unidade // sempre lembrar de exportar