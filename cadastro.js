document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('produtoForm');
    const produtosTable = document.getElementById('produtosTable').getElementsByTagName('tbody')[0];

    let produtos = JSON.parse(localStorage.getItem('listaProdutos')) || [];

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nomeProduto = document.getElementById('nomeProduto').value;
        const unidade = document.getElementById('unidade').value;
        const quantidade = document.getElementById('quantidade').value;
        const codigoBarra = document.getElementById('codigoBarra').value;
        const ativo = document.getElementById('ativo').checked;

        if (!nomeProduto || !unidade || !quantidade) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const codigoProduto = produtos.length ? Math.max(...produtos.map(p => p.codigoProduto)) + 1 : 1;

        const produto = {
            codigoProduto,
            nomeProduto,
            unidade,
            quantidade,
            codigoBarra,
            ativo,
            quantidadeComprada: 0  // Inicializar a quantidade comprada com 0
        };

        produtos.push(produto);
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
        addProdutoToTable(produto);
        form.reset();
    });

    function addProdutoToTable(produto) {
        const row = produtosTable.insertRow();
        row.insertCell(0).innerText = produto.codigoProduto;
        row.insertCell(1).innerText = produto.nomeProduto;
        row.insertCell(2).innerText = produto.unidade;
        row.insertCell(3).innerText = produto.quantidade;
        row.insertCell(4).innerText = produto.codigoBarra;
        row.insertCell(5).innerText = produto.ativo ? 'Sim' : 'Não';

        const actionsCell = row.insertCell(6);
        const editButton = document.createElement('button');
        editButton.innerText = 'Editar';
        editButton.addEventListener('click', function () {
            editProduto(produto.codigoProduto);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Excluir';
        deleteButton.addEventListener('click', function () {
            deleteProduto(produto.codigoProduto);
        });

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    }

    function editProduto(codigoProduto) {
        const produto = produtos.find(p => p.codigoProduto === codigoProduto);
        if (!produto) return;

        document.getElementById('nomeProduto').value = produto.nomeProduto;
        document.getElementById('unidade').value = produto.unidade;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('codigoBarra').value = produto.codigoBarra;
        document.getElementById('ativo').checked = produto.ativo;

        produtos = produtos.filter(p => p.codigoProduto !== codigoProduto);
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
        renderProdutos();
    }

    function deleteProduto(codigoProduto) {
        produtos = produtos.filter(p => p.codigoProduto !== codigoProduto);
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
        renderProdutos();
    }

    function renderProdutos() {
        produtosTable.innerHTML = '';
        produtos.forEach(addProdutoToTable);
    }

    renderProdutos();
});
