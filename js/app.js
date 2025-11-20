const API = 'https://jsonplaceholder.typicode.com';

async function fetchPosts() {

    try {

        const response = await fetch(`${API}/posts`);

        if(!response.ok) throw new Error(`Erro ${response.status}`);

        const posts = await response.json();        
        return posts;

    } catch(e) {
        console.error('Falha ao acessar a API: ', e);
        throw e;
    }

}