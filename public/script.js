document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProduto');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const dados = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/processar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });
            
            const resultado = await response.json();
            
            if (resultado.sucesso) {
                exibirResultado(resultado.produto);
            }
        } catch (erro) {
            console.error('Erro ao cadastrar produto:', erro);
            alert('Erro ao cadastrar produto. Tente novamente.');
        }
    });
});

function exibirResultado(produto) {
    const container = document.querySelector('.container');
    
    container.innerHTML = `
        <h1>✅ Produto Cadastrado com Sucesso!</h1>
        <div class="resultado">
            <h2>Dados do Produto (JSON):</h2>
            <div class="json-display">
                <pre>${JSON.stringify(produto, null, 2)}</pre>
            </div>
            <div class="dados-formatados">
                <h3>Dados Formatados:</h3>
                <p><strong>ID:</strong> ${produto.id}</p>
                <p><strong>Nome:</strong> ${produto.nome}</p>
                <p><strong>Categoria:</strong> ${produto.categoria}</p>
                <p><strong>Preço:</strong> R$ ${produto.preco}</p>
                <p><strong>Quantidade:</strong> ${produto.quantidade} unidades</p>
                <p><strong>Fornecedor:</strong> ${produto.fornecedor}</p>
                <p><strong>Data de Entrada:</strong> ${produto.dataEntrada}</p>
                <p><strong>Descrição:</strong> ${produto.descricao}</p>
                <p><strong>Valor Total em Estoque:</strong> R$ ${produto.valorTotal}</p>
                <p><strong>Data do Cadastro:</strong> ${produto.dataCadastro}</p>
            </div>
        </div>
        <button onclick="window.location.reload()" class="btn-voltar">← Cadastrar Novo Produto</button>
        <button onclick="verTodosProdutos()" class="btn-ver-todos">📋 Ver Todos os Produtos</button>
    `;
}

async function verTodosProdutos() {
    try {
        const response = await fetch('/api/produtos');
        const dados = await response.json();
        
        const container = document.querySelector('.container');
        
        let listaProdutos = '';
        if (dados.produtos.length === 0) {
            listaProdutos = '<p>Nenhum produto cadastrado ainda.</p>';
        } else {
            listaProdutos = dados.produtos.map(p => `
                <div class="produto-item">
                    <p><strong>ID ${p.id}:</strong> ${p.nome} - ${p.categoria} - R$ ${p.preco}</p>
                </div>
            `).join('');
        }
        
        container.innerHTML = `
            <h1>Lista de Produtos Cadastrados</h1>
            <div class="resultado">
                <h2>Total de Produtos: ${dados.total}</h2>
                <div class="json-display">
                    <pre>${JSON.stringify(dados, null, 2)}</pre>
                </div>
                <div class="lista-produtos">
                    ${listaProdutos}
                </div>
            </div>
            <button onclick="window.location.reload()" class="btn-voltar">← Voltar ao Cadastro</button>
        `;
    } catch (erro) {
        console.error('Erro ao buscar produtos:', erro);
        alert('Erro ao buscar produtos.');
    }
}
