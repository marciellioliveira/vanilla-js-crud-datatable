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

async function updatePost(id, title, body) {

    try {

        const response = await fetch(`${API}/posts/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, title, body, userId: 1})
        });

        const updated = await response.json();
        return updated;

    } catch(e) {
        console.log("Erro ao atualizar o post: ",e);
    }

}

async function deletePost(id) {

    try {

        const response = await fetch(`${API}/posts/${id}`, {
            method: "DELETE"
        });

        return response.ok;

    } catch(e) {
        console.log("Erro ao deletar: ", e);
        return false;
    }

}


function exportToExcel(rows) {

    if(!rows || rows.length === 0) {

        alert("Nenhum dado para exportar");
        return;

    }

    //Criando conteudo em Excel em formato de tabela HTML 
    let xlsContent = `
        <table border="1">
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Conteúdo</th>
            </tr>
    `;

    rows.forEach(row => {
        xlsContent += `
            <tr>
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
            </tr>
        `;
    });

    xlsContent += "</table>";

    //Criando o arquivo
    const blob = new Blob([xlsContent], {
        type: "application/vnd.ms-excel"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    a.download = "posts.xls";

    a.click();

    URL.revokeObjectURL(url);

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
        responsive: true,
        layout: {
            topStart: null,
            top: 'search',             
            topEnd: document.getElementById("extra-buttons") 
        }
    });  
        

    //Criando o botão de export do lado do search e adicionando no html
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "Exportar planilha";
    exportBtn.classList.add("btn-small", "green");

    exportBtn.addEventListener("click", () => {

        const rows = window.dataTableInstance.rows().data().toArray();
        exportToExcel(rows);

    });

    document.getElementById("extra-buttons").appendChild(exportBtn);

    /*$('#posts-table').DataTable({
        info: true,
        paging: true,
        ordering: true,
        responsive: true
    });*/

    M.Modal.init(modals);

    //Evento para criar novo post
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

    //Evento para editar um post 
    document.querySelector("#posts-table").addEventListener("click", async (e) => {

        if(e.target.classList.contains("edit-btn")) {

            const id = e.target.dataset.id;

            const table = window.dataTableInstance;
            const row = table.row($(e.target).closest("tr"));
            const data = row.data();

            document.querySelector("#edit-id").value = id;
            document.querySelector("#edit-title").value = data[1];
            document.querySelector("#edit-body").value = data[2];

            M.updateTextFields();

            const modal = M.Modal.getInstance(document.querySelector("#edit-modal"));
            modal.open();

        }

    });

    //Evento para atualizar o post quando clicar no botão atualizar
    document.querySelector("#update-post").addEventListener("click", async () => {

        const id = document.querySelector("#edit-id").value;
        const title = document.querySelector("#edit-title").value;
        const body = document.querySelector("#edit-body").value;
    
        if (!title || !body) {
            M.toast({html: "Preencha todos os campos!"});
            return;
        }
    
        const updated = await updatePost(id, title, body);
    
        // atualizar na tabela
        const table = window.dataTableInstance;
    
        // encontra a linha pela coluna ID
        table.rows().every(function() {
            if (this.data()[0] == id) {
    
                this.data([
                    id,
                    updated.title,
                    updated.body,
                    `
                        <button class="btn-small blue edit-btn" data-id="${id}">Editar</button>
                        <button class="btn-small red delete-btn" data-id="${id}">Excluir</button>
                    `
                ]);
    
            }
        });
    
        table.draw(false);
    
        M.toast({html: "Post atualizado!"});
    });


    //Botão Delete
    document.querySelector("#posts-table").addEventListener("click", async (e) => {

        if(e.target.classList.contains("delete-btn")) {

            const id = e.target.dataset.id;

            if(!confirm(`Tem certeza de que deseja excluir o post ${id}?`)) {
                return;
            }

            const deleted = await deletePost(id);

            if(deleted) {

                const table = window.dataTableInstance;

                table.rows().every(function () {
                    
                    if(this.data()[0] == id) {
                        this.remove();
                    }

                });

                table.draw(false);

                M.toast({html: "Post excluído com sucesso"});

            }

        }

    });

});

