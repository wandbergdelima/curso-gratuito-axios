const statusEl = document.getElementById('status');
const dataEl = document.getElementById('data');
const headersEl = document.getElementById('headers');
const configEl = document.getElementById('config');


// trabalhando com multiplas instancias com o axios

/* cada instancia deve ser declarada para uma constante

= newAxios

const newAxios = axios.create({
    baseURL: 'https://api.example.com',
    headers: {
        common: {
            Authorization: 'New axios'
        }
    }
});

*/

// Declaração da api 
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'
// const api = 'https://jsonplaceholder.typicode.com';


// ha a possibilidade de definir o Metodo do cabeçalho (GET - POST - PATH, etc.)
axios.defaults.headers.post['Content-Type'] = 'application/json';


/*
 se o token for padrão pode se estar passando ele direto como default para o axios
 
 axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
*/

// atraves do interceptador axios podemos adicionar os tokens da API antes de iniciar a Requisição da API
axios.interceptors.request.use(function (config) {
    // normalmente é utilizado para injetar tokens na request
    config.headers.common.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    console.log(config);
    return config;

});

/* adicionando o interceptador da resposta da API esse interceptador é global e todas as requisições passaram por ele
    fazendo assim o tratamento de erros e criando condições para analizar determinados dados da API
*/
axios.interceptors.response.use(function (response) {
    // retorno caso a resposta da API seja True
    console.log('sucesso');

    return response;
  }, function (error) {
    // retorno de mensagens de erros 
    console.log(error.response);

    return Promise.reject(error);
  });


// INICIANDO O CRUD E ESTUDOS DA API

const get = () => {
    const config = {
        // Definição de parametros para o link da api que será chamado dentro do axios
        params: {
            _limit: 5
        }
    }
    // iniciar o axios efetuando a requisição da api externa com o metodo GET
    axios.get('posts', config)
        // Renderizar o contudo axios atraves da resposta (response)
        .then((response) => renderOutput(response))
}

const post = () => {
    // Informações que serão enviadas para a API
    const data = {
        title: 'foo',
        body: 'bar',
        userId: 1,
      }
    // iniciar o axios usando o mesmo endPoint efetuando a criação/Postagem na api externa com o metodo POST
    axios.post('posts', data)
        // Renderizar o contudo axios atraves da resposta (response)
        .then((response) => renderOutput(response))
}

const put = () => {
    // Informações que serão alteradas na API por convenção é utilizado para alteração de todos os campos da API
    const data = {
        // o campo id só é informado caso seja especifica a mudança deste campo caso não ele pode ser informado pelo usuário e automaicamenteser feita a alteração
        // id: 1,
        title: 'LaraVue',
        body: 'bar',
        userId: 1,
      }
    // iniciar o axios usando o mesmo endPoint efetuando update na api externa com o metodo PUT e informando o id de referencia
    axios.put('posts/1', data)
        // Renderizar o contudo axios atraves da resposta (response)
        .then((response) => renderOutput(response))
}

const patch = () => {
    // Informações que serão alteradas na API por convenção é utilizado somente para alteração de 1 campo especifico da API
    const data = {
        title: 'GOLANG',
      }
    // iniciar o axios usando o mesmo endPoint efetuando update na api externa com o metodo PATCH e informando o id de referencia
    axios.patch('posts/1', data)
        // Renderizar o contudo axios atraves da resposta (response)
        .then((response) => renderOutput(response))
}

const del = () => {
        // iniciar o axios usando o mesmo endPoint efetuando o delete na api externa com o metodo DELETE e informando o id como referencia
        axios.delete('posts/2', data)
        // Renderizar o contudo axios atraves da resposta (response)
        .then((response) => renderOutput(response))
}

const multiple = () => {
    // iniciando a requisição de varios endPoints
    Promise.all([
        axios.get('posts', config),
        axios.get('users', config)
        // apos a varredura sera retornado o resultado somente se todos os endPoints forem acessados
    ]).then((response) => {
        // exibir no console o resultado de cada requisição em tabela e filtrado com limit de 5 no config
        console.table(response[0].data);
        console.table(response[1].data);

    })
}

const transform = () => {
    const config = {
        // Definição de parametros para o link da api que será chamado dentro do axios
        params: {
            _limit: 5
        },
        // parametro de transformação de dados da API, permite manipular a informação da requisição de forma mais livre e textual
        transformResponse: [function (data) {
            // OBS.: sempre ao parsear o objeto JSON deve ser escrito com letras Maiusculas
            const payload = JSON.parse(data).map(o =>{
                return {
                    ...o,
                    first_name: 'Jon',
                    last_name: 'Snow',
                    full_name: 'Jon Snow',
                    is_selected: false,
                }
            })
        
            return payload;
          }],
    }

    // iniciar o axios efetuando a requisição da api externa com o metodo GET
    axios.get('posts', config)
        // Renderizar o contudo axios atraves da resposta (response)
        .then((response) => renderOutput(response))

}

const errorHandling = () => {
    // iniciar o axios efetuando a requisição da api externa com o metodo GET
    axios.get('postsZ')
        // Renderizar o contudo axios atraves da resposta (response)
        .then((response) => renderOutput(response))
        // aplicando a condição de retorno caso a requisição THEN de algum erro na busca, respondendo o resultado atraves do CATCH
        .catch((error) => renderOutput(error.response));

        // outra forma de montar o CATCH

        // .catch((error) =>{
        //     renderOutput(error.response)
        //     console.log(error.response.data);
        //     console.log(error.response.status);
        //     console.log(error.response.headers);
        // })

}

const cancel = () => {
    // declaração do comando para cancelar 1 ou mais requisições; 
    const controller = new AbortController();

    const config = {
        // Definição de parametros para o link da api que será chamado dentro do axios
        params: {
            _limit: 5
        },
        signal: controller.signal
    }
    // iniciar o axios efetuando a requisição da api externa com o metodo GET
    axios.get('posts', config)
        // Renderizar o contudo axios atraves da resposta (response)
        .then((response) => renderOutput(response))
        // Exibir o cancelamento da requisição
        .catch((e) => {
            // exibição de mensagem no console
            console.log(e.message);
        })
    controller.abort();
}

const clear = () => {
    statusEl.innerHTML = '';
    statusEl.className = '';
    dataEl.innerHTML = '';
    headersEl.innerHTML = '';
    configEl.innerHTML = '';
}

const renderOutput = (response) => {
    // Status
    const status = response.status;
    statusEl.removeAttribute('class');
    let statusElClass = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium';
    if (status >= 500) {
        statusElClass += ' bg-red-100 text-red-800';
    } else if (status >= 400) {
        statusElClass += ' bg-yellow-100 text-yellow-800';
    } else if (status >= 200) {
        statusElClass += ' bg-green-100 text-green-800';
    }

    statusEl.innerHTML = status;
    statusEl.className = statusElClass;

    // Data
    dataEl.innerHTML = JSON.stringify(response.data, null, 2);
    Prism.highlightElement(dataEl);

    // Headers
    headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
    Prism.highlightElement(headersEl);

    // Config
    configEl.innerHTML = JSON.stringify(response.config, null, 2);
    Prism.highlightElement(configEl);
}

document.getElementById('get').addEventListener('click', get);
document.getElementById('post').addEventListener('click', post);
document.getElementById('put').addEventListener('click', put);
document.getElementById('patch').addEventListener('click', patch);
document.getElementById('delete').addEventListener('click', del);
document.getElementById('multiple').addEventListener('click', multiple);
document.getElementById('transform').addEventListener('click', transform);
document.getElementById('cancel').addEventListener('click', cancel);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('clear').addEventListener('click', clear);
