const API = 'https://jsonplaceholder.typicode.com';

//Chama a API
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


//Insere na tabela
function renderPostsTable(posts) {

    const tableBody = document.querySelector("#posts-table tbody");

    tableBody.innerHTML = "";

    posts.forEach(post => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.body}</td>
            <td>
                <button class="btn-small blue edit-btn" data-id="${post.id}">Editar</button>
                <button class="btn-small blue delete-btn" data-id="${post.id}">Excluir</button>
            </td>
        `;

        tableBody.appendChild(tr);

    });

}


document.addEventListener("DOMContentLoaded", async () => {
    const posts = await fetchPosts();
    //console.log(posts);
    renderPostsTable(posts);
});