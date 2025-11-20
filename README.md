# vanilla-js-crud-datatable

CRUD de posts com **Vanilla JS**, **Materialize CSS** e **DataTables** (consumo da API JSONPlaceholder).

Projeto para estudo focado em consumir uma API REST (fake), manipular o DOM, usar DataTables para exibição avançada e permitir exportação para `.xls`.

---

## Funcionalidades

- Listar posts (GET /posts)  
- Visualizar post por ID (GET /posts/{id})  
- Criar novo post (simulado na interface)  
- Editar post (simulado na interface)  
- Excluir post (simulado na interface)  
- Exportar lista atual para `.xls`  
- Busca, paginação e ordenação via DataTables  
- UI responsiva com Materialize (modais, botões, forms)

---

## Tecnologias

- HTML5 / CSS3 (Materialize)  
- JavaScript (ES6+, fetch, async/await)  
- jQuery (apenas para inicializar DataTables)  
- DataTables  
- JSONPlaceholder (API fake)

---

## Estrutura

```
/css
  styles.css
/js
  app.js
  table-utils.js
index.html
README.md
```

---

## Como rodar localmente

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/vanilla-js-crud-datatable.git
cd vanilla-js-crud-datatable
```

2. Abra `index.html` no navegador (ou rode um servidor local simples):
```bash
# usando Python 3
python -m http.server 5500
# abra http://localhost:5500
```

---

## Endpoints usados: JSONPlaceholder

| Método | Endpoint        | Descrição                   |
|--------|-----------------|-----------------------------|
| GET    | /posts          | Lista todos os posts        |
| GET    | /posts/{id}     | Retorna um post específico  |
| POST   | /posts          | Cria um novo post           |
| PUT    | /posts/{id}     | Atualiza um post existente  |
| DELETE | /posts/{id}     | Remove um post              |

---

## Como funciona

1. Ao carregar a página, `app.js` faz `GET /posts` via `fetch`.  
2. A resposta JSON é convertida em linhas da tabela (DOM).  
3. Inicializa DataTables sobre a `<table>`.  
4. Ao criar/editar/excluir, o app chama os endpoints correspondentes (POST/PUT/DELETE) para obter respostas "fake" e **atualiza a tabela no DOM** já que a API não persiste.  
5. Exportação `.xls` é feita localmente gerando um arquivo a partir da tabela HTML.

---

## Guia rápido de implementação

### Inclusão de dependências no `index.html`
```html
<!-- Materialize CSS -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" rel="stylesheet"/>
<!-- DataTables CSS -->
<link href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css" rel="stylesheet"/>

<!-- jQuery (DataTables depende) -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<!-- DataTables JS -->
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<!-- Materialize JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>

## Licença
MIT — uso livre para estudo e demonstrações.
