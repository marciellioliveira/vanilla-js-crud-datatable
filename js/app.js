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

//Faz POST na API
async function createPost(title, body) {

    try {

        const response = await fetch(`${API}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                body,
                userId: 1
            })
        });

        const newPost = await response.json();
        return newPost;

    } catch(e) {
        console.log("Erro ao criar o post: ", e);
    }

}

function addPostToTable(post) {

    const table = window.dataTableInstance;

    table.row.add([
        post.id,
        post.title,
        post.body,
        `   <button class="btn-small blue edit-btn" data-id="${post.id}">Editar</button>
            <button class="btn-small red delete-btn" data-id="${post.id}">Excluir</button>
        `
    ]).draw(false);

}






document.addEventListener("DOMContentLoaded", async () => {
    const posts = await fetchPosts();

    const modals = document.querySelectorAll(".modal");

    //console.log(posts);
    renderPostsTable(posts);
    
    window.dataTableInstance = new DataTable('#posts-table', {
        info: true,
        paging: true,
        ordering: true,
        responsive: true
    });

    /*$('#posts-table').DataTable({
        info: true,
        paging: true,
        ordering: true,
        responsive: true
    });*/

    M.Modal.init(modals);

    document.querySelector("#save-post").addEventListener("click", async () => {

        const title = document.querySelector("#post-title").value;
        const body = document.querySelector("#post-body").value;

        if(!title || !body) {
            M.toast({html:"Preencha todos os campos!"});
            return;
        }

        const created = await createPost(title, body);
        addPostToTable(created);

        document.querySelector("#post-title").value = "";
        document.querySelector("#post-body").value = "";

        M.updateTextFields();
    });
});

