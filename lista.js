document.addEventListener('DOMContentLoaded', function () {
    const comprasTable = document.getElementById('comprasTable').getElementsByTagName('tbody')[0];
    const enviarServidorBtn = document.getElementById('enviarServidor');

    let listaProdutos = JSON.parse(localStorage.getItem('listaProdutos')) || [];
    let listaCompras = listaProdutos.filter(produto => produto.ativo);

    function renderCompras() {
        comprasTable.innerHTML = '';
        listaCompras.forEach(produto => {
            const row = comprasTable.insertRow();
            row.insertCell(0).innerText = produto.codigoProduto;
            row.insertCell(1).innerText = produto.nomeProduto;
            row.insertCell(2).innerText = produto.unidade;
            row.insertCell(3).innerText = produto.quantidade;

            const quantidadeCompradaCell = row.insertCell(4);
            const quantidadeCompradaInput = document.createElement('input');
            quantidadeCompradaInput.type = 'number';
            quantidadeCompradaInput.value = produto.quantidadeComprada || 0;
            quantidadeCompradaInput.addEventListener('change', function () {
                produto.quantidadeComprada = parseInt(this.value);
                localStorage.setItem('listaProdutos', JSON.stringify(listaProdutos));
                checkIfAllCollected();
            });
            quantidadeCompradaCell.appendChild(quantidadeCompradaInput);

            const coletadoCell = row.insertCell(5);
            const coletadoCheckbox = document.createElement('input');
            coletadoCheckbox.type = 'checkbox';
            coletadoCheckbox.checked = produto.quantidadeComprada >= produto.quantidade;
            coletadoCheckbox.disabled = true;
            coletadoCell.appendChild(coletadoCheckbox);

            if (produto.quantidadeComprada >= produto.quantidade) {
                row.classList.add('striked');
            }
        });
    }

    function checkIfAllCollected() {
        const allCollected = listaCompras.every(produto => produto.quantidadeComprada >= produto.quantidade);
        enviarServidorBtn.disabled = !allCollected;
    }

    enviarServidorBtn.addEventListener('click', function () {
        const mockapiUrl = 'https://66690fa92e964a6dfed3b3dd.mockapi.io/compras/compras';
        console.log('Sending data to server:', listaCompras);

        fetch(mockapiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listaCompras)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Lista de compras enviada com sucesso!');
                localStorage.removeItem('listaProdutos');
                listaProdutos = [];
                listaCompras = [];
                renderCompras();
                checkIfAllCollected();
            })
            .catch(error => {
                console.error('Erro ao enviar a lista de compras:', error);
            });
    });

    renderCompras();
    checkIfAllCollected();
});
