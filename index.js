const express = require('express');
const path = require('path');

const app = express();
const porta = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

let produtos = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'formulario.html'));
});

app.post('/processar', (req, res) => {
    const { nomeProduto, categoria, preco, quantidade, fornecedor, dataEntrada, descricao } = req.body;
    
    const precoNum = parseFloat(preco);
    const quantidadeNum = parseInt(quantidade);
    const valorTotal = (precoNum * quantidadeNum).toFixed(2);
    
    const dataFormatada = new Date(dataEntrada + 'T00:00:00').toLocaleDateString('pt-BR');
    
    const categoriaFormatada = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    
    const produto = {
        id: produtos.length + 1,
        nome: nomeProduto,
        categoria: categoriaFormatada,
        preco: precoNum.toFixed(2),
        quantidade: quantidadeNum,
        fornecedor: fornecedor,
        dataEntrada: dataFormatada,
        descricao: descricao || 'Sem descrição',
        valorTotal: valorTotal,
        dataCadastro: new Date().toLocaleString('pt-BR')
    };
    
    produtos.push(produto);
    
    res.json({
        sucesso: true,
        mensagem: 'Produto cadastrado com sucesso!',
        produto: produto
    });
});

app.get('/api/produtos', (req, res) => {
    res.json({
        total: produtos.length,
        produtos: produtos
    });
});

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});
