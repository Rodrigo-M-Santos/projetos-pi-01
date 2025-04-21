document.addEventListener('DOMContentLoaded', () => {
    const listaDemandas = document.getElementById('lista-demandas');
    const tituloDemandaInput = document.getElementById('titulo-demanda');
    const descricaoDemandaInput = document.getElementById('descricao-demanda');
    const adicionarDemandaBotao = document.getElementById('adicionar-demanda');

    const inputArquivo = document.getElementById('input-arquivo');
    const enviarArquivosBotao = document.getElementById('enviar-arquivos');
    const listaArquivosDiv = document.getElementById('lista-arquivos');

    // --- Funcionalidade de Demandas ---
    function carregarDemandas() {
        // Aqui você faria uma chamada AJAX para buscar as demandas do backend Django
        // e popular a listaDemandas.
        // Exemplo (simulado):
        const demandasSimuladas = [
            { id: 1, titulo: 'Revisar Iluminação da Garagem', descricao: 'Verificar lâmpadas queimadas.' },
            { id: 2, titulo: 'Orçamento para Pintura', descricao: 'Solicitar orçamentos para a fachada.' }
        ];
        demandasSimuladas.forEach(demanda => adicionarDemandaNaLista(demanda));
    }

    function adicionarDemandaNaLista(demanda) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="demanda-texto">
                <strong>${demanda.titulo}</strong><br>
                <span>${demanda.descricao}</span>
            </div>
            <div class="demanda-acoes">
                <button class="excluir-demanda" data-id="${demanda.id}">Excluir</button>
            </div>
        `;
        listaDemandas.appendChild(listItem);

        const botaoExcluir = listItem.querySelector('.excluir-demanda');
        botaoExcluir.addEventListener('click', () => {
            // Aqui você faria uma chamada AJAX para excluir a demanda do backend
            listItem.remove();
        });
    }

    adicionarDemandaBotao.addEventListener('click', () => {
        const titulo = tituloDemandaInput.value.trim();
        const descricao = descricaoDemandaInput.value.trim();
        if (titulo && descricao) {
            // Aqui você faria uma chamada AJAX para enviar a nova demanda para o backend Django
            const novaDemanda = { id: Date.now(), titulo, descricao }; // Simulação de ID
            adicionarDemandaNaLista(novaDemanda);
            tituloDemandaInput.value = '';
            descricaoDemandaInput.value = '';
        } else {
            alert('Por favor, preencha o título e a descrição da demanda.');
        }
    });

    // --- Funcionalidade de Arquivos ---
    function carregarArquivos() {
        // Aqui você faria uma chamada AJAX para buscar os arquivos do backend Django
        // e popular a listaArquivosDiv.
        // Exemplo (simulado):
        const arquivosSimulados = [
            { id: 101, nome: 'ata_assembleia_01.pdf', url: '#' },
            { id: 102, nome: 'foto_portaria.jpg', url: 'img/foto_portaria.jpg' }
        ];
        arquivosSimulados.forEach(arquivo => adicionarArquivoNaLista(arquivo));
    }

    function adicionarArquivoNaLista(arquivo) {
        const arquivoDiv = document.createElement('div');
        arquivoDiv.innerHTML = `
            ${arquivo.url.match(/\.(jpeg|jpg|gif|png)$/) ? `<img src="${arquivo.url}" alt="${arquivo.nome}">` : ''}
            <span>${arquivo.nome}</span>
            <button class="excluir-arquivo" data-id="${arquivo.id}">Excluir</button>
        `;
        listaArquivosDiv.appendChild(arquivoDiv);

        const botaoExcluir = arquivoDiv.querySelector('.excluir-arquivo');
        botaoExcluir.addEventListener('click', () => {
            // Aqui você faria uma chamada AJAX para excluir o arquivo do backend
            arquivoDiv.remove();
        });
    }

    enviarArquivosBotao.addEventListener('click', () => {
        const arquivos = inputArquivo.files;
        if (arquivos.length > 0) {
            const formData = new FormData();
            for (let i = 0; i < arquivos.length; i++) {
                formData.append('arquivos', arquivos[i]);
            }

            // Aqui você faria uma chamada AJAX (POST) para enviar os arquivos para o backend Django
            // e, em caso de sucesso, atualizar a lista de arquivos.
            console.log('Enviando arquivos...', formData);
            // Exemplo de como você poderia fazer uma chamada fetch (adaptar para Django):
            /*
            fetch('/api/arquivos/', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                data.forEach(arquivo => adicionarArquivoNaLista(arquivo));
                inputArquivo.value = ''; // Limpar o input de arquivo
            })
            .catch(error => console.error('Erro ao enviar arquivos:', error));
            */
            alert('Arquivos enviados (funcionalidade de backend não implementada neste exemplo).');
        } else {
            alert('Por favor, selecione os arquivos para enviar.');
        }
    });

    carregarDemandas();
    carregarArquivos();
});

