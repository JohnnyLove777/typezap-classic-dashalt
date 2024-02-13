const ws = new WebSocket('ws://localhost:8000');

// Quando o DOM estiver carregado, configure os listeners
document.addEventListener('DOMContentLoaded', function() {    
    const sidebarLinks = document.querySelectorAll('#sidebar a');
    const mainContent = document.getElementById('main-content');

    // Anexa event listeners ao mainContent para delegação
mainContent.addEventListener('click', function(event) {
    // Identifica se o clique foi no botão "Atualizar Lista"
    if (event.target.id === 'atualizarLista') {
        ws.send(JSON.stringify({ action: 'atualizarLista' }));
        //console.log('Solicitação para atualizar lista de fluxos enviada ao servidor.');
    }

    // Identifica se o clique foi no botão "Atualizar Lista Rapida"
    if (event.target.id === 'atualizarListaRapida') {
        ws.send(JSON.stringify({ action: 'atualizarListaRapida' }));
        //console.log('Solicitação para atualizar lista de fluxos rapidos enviada ao servidor.');
    }

    // Identifica se o clique foi no botão "Adicionar Fluxo"
    else if (event.target.id === 'adicionarFluxo') {
        
                    // Remove o modal existente, se houver, para evitar duplicação
                    const existingModal = document.getElementById('addFluxoModalBackdrop');
                    if (existingModal) existingModal.remove();
                
                    // Conteúdo do modal
                    const modalContent = `
                    <div id="addFluxoModalBackdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;">
                        <div id="addFluxoModal" style="background-color: #222; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div id="closeModal" style="float: right; cursor: pointer; color: white;">&times;</div>
                            <h2 style="color: white;">Adicionar Fluxo</h2>
                            <label for="fluxoUrl" style="color: white;">URL do Fluxo:</label>
                            <input type="text" id="fluxoUrl" placeholder="URL do seu Fluxo" style="width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #555; border-radius: 4px; background-color: #222; color: white;"><br>
                            <label for="fluxoNome" style="color: white;">Nome do Fluxo:</label>
                            <input type="text" id="fluxoNome" placeholder="Nome do seu Fluxo" style="width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #555; border-radius: 4px; background-color: #222; color: white;"><br>
                            <label for="fluxoGatilho" style="color: white;">Gatilho do Fluxo:</label>
                            <input type="text" id="fluxoGatilho" placeholder="Gatilho do seu Fluxo" style="width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #555; border-radius: 4px; background-color: #222; color: white;"><br>
                            <button id="confirmarAdicao" style="margin-top: 10px; width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Confirmar Adição</button>
                        </div>
                        <div id="response" style="margin-top: 20px;"></div>
                    </div>
                `;
                
                    // Insere o modal no DOM
                    document.body.insertAdjacentHTML('beforeend', modalContent);
                
                    // Agora, anexa o listener ao botão 'closeModal' dentro do modal
                    document.getElementById('closeModal').addEventListener('click', function() {
                        document.getElementById('addFluxoModalBackdrop').remove();
                    });
                
                    // Agora, anexa o listener ao botão 'confirmarAdicao' dentro do modal
                    // Isso é feito imediatamente após a criação do modal para garantir que o listener seja adicionado corretamente
                    document.getElementById('confirmarAdicao').addEventListener('click', function() {
                        const urlFluxo = document.getElementById('fluxoUrl').value;
                        const nomeFluxo = document.getElementById('fluxoNome').value;
                        const gatilhoFluxo = document.getElementById('fluxoGatilho').value;
                        
                        ws.send(JSON.stringify({
                            action: 'confirmarAdicao',
                            data: {
                                url: urlFluxo,
                                nome: nomeFluxo,
                                gatilho: gatilhoFluxo
                            }
                        }));
                        alert('Fluxo adicionado com sucesso!');
                        ws.send(JSON.stringify({ action: 'atualizarLista' }));
                        //console.log('Adicionando fluxo...');
                        document.getElementById('addFluxoModalBackdrop').remove(); // Fechar o modal após envio
                    });
    }

    // Identifica se o clique foi no botão "Adicionar Resposta Rápida"
    else if (event.target.id === 'adicionarRespostaRapida') {
        
        // Remove o modal existente, se houver, para evitar duplicação
        const existingModal = document.getElementById('addFluxoModalBackdrop');
        if (existingModal) existingModal.remove();
    
        // Conteúdo do modal
        const modalContent = `
        <div id="addFluxoModalBackdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;">
            <div id="addFluxoModal" style="background-color: #222; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div id="closeModal" style="float: right; cursor: pointer; color: white;">&times;</div>
                <h2 style="color: white;">Adicionar Resposta Rápida</h2>                
                <label for="fluxoNome" style="color: white;">Nome do Fluxo:</label>
                <input type="text" id="fluxoNome" placeholder="Nome do seu Fluxo que será Disparado" style="width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #555; border-radius: 4px; background-color: #222; color: white;"><br>
                <label for="fluxoGatilho" style="color: white;">Frase de Disparo:</label>
                <input type="text" id="fluxoGatilho" placeholder="Frase que irá disparar o Fluxo" style="width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #555; border-radius: 4px; background-color: #222; color: white;"><br>
                <button id="confirmarAdicaoRapida" style="margin-top: 10px; width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Confirmar Adição</button>
            </div>
            <div id="response" style="margin-top: 20px;"></div>
        </div>
    `;
    
        // Insere o modal no DOM
        document.body.insertAdjacentHTML('beforeend', modalContent);
    
        // Agora, anexa o listener ao botão 'closeModal' dentro do modal
        document.getElementById('closeModal').addEventListener('click', function() {
            document.getElementById('addFluxoModalBackdrop').remove();
        });
    
        // Agora, anexa o listener ao botão 'confirmarAdicao' dentro do modal
        // Isso é feito imediatamente após a criação do modal para garantir que o listener seja adicionado corretamente
        document.getElementById('confirmarAdicaoRapida').addEventListener('click', function() {
            const nomeFluxo = document.getElementById('fluxoNome').value;
            const gatilhoFluxo = document.getElementById('fluxoGatilho').value;
            
            ws.send(JSON.stringify({
                action: 'confirmarAdicaoRapida',
                data: {                    
                    nome: nomeFluxo,
                    gatilho: gatilhoFluxo
                }
            }));
            alert('Resposta Rápida adicionada com sucesso!');
            ws.send(JSON.stringify({ action: 'atualizarListaRapida' }));
            //console.log('Adicionando Resposta Rapida...');
            document.getElementById('addFluxoModalBackdrop').remove(); // Fechar o modal após envio
        });
    }

    // Identifica se o clique foi no botão "Atualizar Lista Remarketing"
    if (event.target.id === 'atualizarListaRmkt') {
        ws.send(JSON.stringify({ action: 'atualizarListaRmkt' }));
        //console.log('Solicitação para atualizar lista de remarketing enviada ao servidor.');
    }

    // Identifica se o clique foi no botão "Atualizar Grupo"
    if (event.target.id === 'atualizarGrupo') {
        ws.send(JSON.stringify({ action: 'atualizarGrupo' }));
        //console.log('Solicitação para atualizar lista de grupos enviada ao servidor.');
    }

    // Identifica se o clique foi no botão "Adicionar Remarketing"
    else if (event.target.id === 'adicionarRmkt') {
        
        // Remove o modal existente, se houver, para evitar duplicação
        const existingModal = document.getElementById('addFluxoModalBackdrop');
        if (existingModal) existingModal.remove();
    
        // Conteúdo do modal
        const modalContent = `
        <div id="addFluxoModalBackdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;">
            <div id="addFluxoModal" style="background-color: #222; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div id="closeModal" style="float: right; cursor: pointer; color: white;">&times;</div>
                <h2 style="color: white;">Adicionar Remarketing</h2>
                <label for="fluxoUrl" style="color: white;">URL do Fluxo de Remarketing :</label>
                <input type="text" id="fluxoUrl" placeholder="URL do seu Remarketing" style="width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #555; border-radius: 4px; background-color: #222; color: white;"><br>
                <label for="fluxoNome" style="color: white;">Nome do Fluxo Principal:</label>
                <input type="text" id="fluxoNome" placeholder="Nome do Fluxo que o Remarketing está atrelado" style="width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #555; border-radius: 4px; background-color: #222; color: white;"><br>
                <label for="fluxoGatilho" style="color: white;">Tempo em Dias:</label>
                <input type="text" id="fluxoGatilho" placeholder="Dias para o Disparo do Remarketing" style="width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #555; border-radius: 4px; background-color: #222; color: white;"><br>
                <button id="confirmarAdicaoRmkt" style="margin-top: 10px; width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Confirmar Remarketing</button>
            </div>
            <div id="response" style="margin-top: 20px;"></div>
        </div>
    `;
    
        // Insere o modal no DOM
        document.body.insertAdjacentHTML('beforeend', modalContent);
    
        // Agora, anexa o listener ao botão 'closeModal' dentro do modal
        document.getElementById('closeModal').addEventListener('click', function() {
            document.getElementById('addFluxoModalBackdrop').remove();
        });
    
        // Agora, anexa o listener ao botão 'confirmarAdicao' dentro do modal
        // Isso é feito imediatamente após a criação do modal para garantir que o listener seja adicionado corretamente
        document.getElementById('confirmarAdicaoRmkt').addEventListener('click', function() {
            const urlFluxo = document.getElementById('fluxoUrl').value;
            const nomeFluxo = document.getElementById('fluxoNome').value;
            const gatilhoFluxo = document.getElementById('fluxoGatilho').value;
            
            ws.send(JSON.stringify({
                action: 'confirmarAdicaoRmkt',
                data: {
                    url: urlFluxo,
                    nome: nomeFluxo,
                    dias: gatilhoFluxo
                }
            }));
            alert('Remarketing com sucesso!');
            ws.send(JSON.stringify({ action: 'atualizarListaRmkt' }));
            //console.log('Adicionando fluxo...');
            document.getElementById('addFluxoModalBackdrop').remove(); // Fechar o modal após envio
        });
    }

    let targetElement = event.target;
    if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'deleteFluxo') {
        // Se o clique foi no ícone dentro do botão, ajusta o targetElement para o botão
        targetElement = targetElement.parentNode;
    }

    if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'deleteFluxoRapida') {
        // Se o clique foi no ícone dentro do botão, ajusta o targetElement para o botão
        targetElement = targetElement.parentNode;
    }

    if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'deleteFluxoRmkt') {
        // Se o clique foi no ícone dentro do botão, ajusta o targetElement para o botão
        targetElement = targetElement.parentNode;
    }

    if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'deleteFluxoGrupo') {
        // Se o clique foi no ícone dentro do botão, ajusta o targetElement para o botão
        targetElement = targetElement.parentNode;
    }

    if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'iniciarCampanha') {
        // Se o clique foi no ícone dentro do botão, ajusta o targetElement para o botão
        targetElement = targetElement.parentNode;
    }

    if (targetElement.tagName === 'I' && targetElement.parentNode.classList == 'pararCampanha') {
        // Se o clique foi no ícone dentro do botão, ajusta o targetElement para o botão
        targetElement = targetElement.parentNode;
    }

    // Verifica se o clique foi realmente no botão de lixeira
    if (targetElement.classList == 'deleteFluxo') {
        // Extrai o nome do fluxo do atributo data-fluxoNome
        //console.log('cliquei na lixeira');
        const fluxoNome = targetElement.getAttribute('data-fluxoNome');

        // Envia a solicitação para excluir o fluxo ao servidor
        ws.send(JSON.stringify({
            action: 'excluirFluxo',
            data: { nome: fluxoNome }
        }));
        alert('Fluxo excluido com sucesso!');
        ws.send(JSON.stringify({ action: 'atualizarLista' }));
        //console.log(`Solicitação para excluir fluxo: ${fluxoNome} enviada ao servidor.`);
    }

    // Verifica se o clique foi realmente no botão de lixeira rapida
    if (targetElement.classList == 'deleteFluxoRapida') {
        //console.log('cliquei na lixeira rapida');
        // Extrai o nome do fluxo do atributo data-fluxoNome
        const fluxoNome = targetElement.getAttribute('data-fluxoNome');

        // Envia a solicitação para excluir o fluxo ao servidor
        ws.send(JSON.stringify({
            action: 'excluirRapida',
            data: { nome: fluxoNome }
        }));
        alert('Resposta Rápida excluida com sucesso!');
        ws.send(JSON.stringify({ action: 'atualizarListaRapida' }));
        //console.log(`Solicitação para excluir Resposta Rapida: ${fluxoNome} enviada ao servidor.`);
    }

    // Verifica se o clique foi realmente no botão de lixeira rmkt
    if (targetElement.classList == 'deleteFluxoRmkt') {
        //console.log('cliquei na lixeira rapida');
        // Extrai o nome do fluxo do atributo data-fluxoNome
        const fluxoNome = targetElement.getAttribute('data-fluxoNome');

        // Envia a solicitação para excluir o fluxo ao servidor
        ws.send(JSON.stringify({
            action: 'excluirRmkt',
            data: { url: fluxoNome }
        }));
        alert('Remarketing excluido com sucesso!');
        ws.send(JSON.stringify({ action: 'atualizarListaRmkt' }));
        //console.log(`Solicitação para excluir Remarketing: ${fluxoNome} enviada ao servidor.`);
    }

    // Verifica se o clique foi realmente no botão de lixeira grupo
    if (targetElement.classList == 'deleteFluxoGrupo') {
        //console.log('cliquei na lixeira rapida');
        // Extrai o nome do fluxo do atributo data-fluxoNome
        const fluxoNome = targetElement.getAttribute('data-fluxoNome');

        // Envia a solicitação para excluir o fluxo ao servidor
        ws.send(JSON.stringify({
            action: 'excluirGrupo',
            data: { name: fluxoNome }
        }));
        alert('Automação de Grupo excluida com sucesso!');
        ws.send(JSON.stringify({ action: 'atualizarGrupo' }));
        //console.log(`Solicitação para excluir Grupo: ${fluxoNome} enviada ao servidor.`);
    }

    


});

    ws.onmessage = function(event) {
    const message = JSON.parse(event.data);

    // Seleciona a div de resposta pelo ID, se aplicável
    const responseDiv = document.getElementById('response');

    if (message.action) {
        switch (message.action) {
            case 'listaAtualizada':
                renderFluxosList(message.data);
                break;
            case 'excluirFluxo':
                if (responseDiv) responseDiv.innerHTML = "Fluxo excluído com sucesso.";
                responseDiv.style.color = 'green';
                break;
            case 'listaRapidaAtualizada':
                renderFluxosListRapida(message.data);
                break;
            case 'excluirRapida':
                if (responseDiv) responseDiv.innerHTML = "Resposta Rápida excluída com sucesso.";
                responseDiv.style.color = 'green';
                break;
            case 'listaRmktAtualizada':
                renderFluxosRmkt(message.data);
                break;
            case 'excluirRmkt':
                if (responseDiv) responseDiv.innerHTML = "Remarketing excluído com sucesso.";
                responseDiv.style.color = 'green';
                break;
            case 'listaGrupoAtualizada':
                renderFluxosGrupos(message.data);
                break;
            case 'excluirGrupo':
                if (responseDiv) responseDiv.innerHTML = "Grupo excluído com sucesso.";
                responseDiv.style.color = 'green';
                break;
            case 'listaLeadsAtualizada':
                updateListaLeadsSelect(message.data);
                break;
            case 'listaFluxosAtualizada':
                updateFluxosSelect(message.data);
                break;
            /* // Protótipo para integrar qrcode no dashboard
            case 'qr':
                const qrCodeDiv = message.sessionId === 'typeListener' ? document.getElementById('listenerQR') : document.getElementById('senderQR');
                if (qrCodeDiv) {
                    qrCodeDiv.innerHTML = `<img src="${message.qrCode}" alt="QR Code para ${message.sessionId}">`;
                }
                break;
            case 'ready':
                const qrResponseDiv = document.getElementById('qrResponse');
                if (qrResponseDiv) {
                    qrResponseDiv.innerHTML = `Instância ${message.sessionId} conectada.`;
                }
                break;
            case 'disconnected':
                const qrStatusDiv = document.getElementById('qrResponse');
                if (qrStatusDiv) {
                    qrStatusDiv.innerHTML = `Instância ${message.sessionId} desconectada. Motivo: ${message.reason}`;
                }
                // Reseta os QR Codes para estado de espera
                if (message.sessionId === 'typeListener') {
                    document.getElementById('listenerQR').innerHTML = 'Aguardando QR Code...';
                } else if (message.sessionId === 'sendMessage') {
                    document.getElementById('senderQR').innerHTML = 'Aguardando QR Code...';
                }
                break;
            case 'logoutSuccess':
                if (responseDiv) {
                    responseDiv.innerHTML = message.data.message;
                    responseDiv.style.color = 'green';
                }
                // Reseta os QR Codes para o estado de espera
                document.getElementById('listenerQR').innerHTML = 'Aguardando QR Code...';
                document.getElementById('senderQR').innerHTML = 'Aguardando QR Code...';
                break;
                */
            // Adicione aqui outros casos conforme necessário
            default:
                // Caso padrão para mensagens não reconhecidas
                //console.log("Ação não reconhecida:", message.action);
                if (responseDiv) {
                    responseDiv.innerHTML = message.message || "Ação realizada com sucesso!";
                    responseDiv.style.color = 'green';
                }
                break;
        }
    } else {
        // Para mensagens gerais que não são ações específicas
        if (responseDiv) {
            responseDiv.innerHTML = message.message || "Ação realizada com sucesso!";
            responseDiv.style.color = 'green';
        }
    }
    };
    
    // Função para atualizar lista de leads da ./leadslista
    function updateListaLeadsSelect(leads) {
        const listaLeadsSelect = document.getElementById('listaLeads');
        listaLeadsSelect.innerHTML = ''; // Limpa as opções existentes
        leads.forEach(lead => {
            const option = document.createElement('option');
            option.value = lead;
            option.textContent = lead.replace('.json', ''); // Remove a extensão .json para exibição
            listaLeadsSelect.appendChild(option);
        });
    }

    // Função para atualizar lista de fluxos
    function updateFluxosSelect(fluxos) {
    const fluxoSelecionadoSelect = document.getElementById('fluxoSelecionado');
    fluxoSelecionadoSelect.innerHTML = ''; // Limpa as opções existentes
    fluxos.forEach(fluxo => {
        const option = document.createElement('option');
        option.value = fluxo.name;
        option.textContent = fluxo.name; // Usa o nome do fluxo para exibição
        fluxoSelecionadoSelect.appendChild(option);
    });
    }
    
    // Função para renderizar a lista de fluxos
    function renderFluxosList(fluxos) {
        if (!fluxos) return;

        let tableRows = Object.values(fluxos).map(fluxo => `
            <tr>
                <td style="padding: 8px;">${fluxo.name}</td>
                <td style="padding: 8px;">${fluxo.url_registro}</td>
                <td style="padding: 8px;">${fluxo.gatilho}</td>
                <td style="text-align: center; padding: 8px;">
                    <button class="deleteFluxo" data-fluxoNome="${fluxo.name}" style="border: none; background-color: transparent; cursor: pointer;">
                        <i class="fas fa-trash" style="color: white;"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Fluxos</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">Nome</th>
                                <th style="text-align: center; padding: 8px;">URL</th>
                                <th style="text-align: center; padding: 8px;">Gatilho</th>
                                <th style="text-align: center; padding: 8px;">Ação</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                <div style="margin-top: 20px;">
                    <button id="atualizarLista" style="cursor: pointer;">Atualizar Lista</button>
                    <button id="adicionarFluxo" style="cursor: pointer;">Adicionar Fluxo</button>
                </div>
            </div>
        `;
        // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();
    }

    // Função para renderizar a lista de respostas rápidas
    function renderFluxosListRapida(fluxos) {
        if (!fluxos) return;

        let tableRows = Object.values(fluxos).map(fluxo => `
            <tr>
                <td style="padding: 8px;">${fluxo.name}</td>                
                <td style="padding: 8px;">${fluxo.gatilho}</td>
                <td style="text-align: center; padding: 8px;">
                    <button class="deleteFluxoRapida" data-fluxoNome="${fluxo.name}" style="border: none; background-color: transparent; cursor: pointer;">
                        <i class="fas fa-trash" style="color: white;"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Respostas Rápidas</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">Nome</th>                                
                                <th style="text-align: center; padding: 8px;">Frase de Disparo</th>
                                <th style="text-align: center; padding: 8px;">Ação</th>                                
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                <div style="margin-top: 20px;">
                <button id="atualizarListaRapida" style="cursor: pointer;">Atualizar Respostas Rápidas</button>
                <button id="adicionarRespostaRapida" style="cursor: pointer;">Adicionar Resposta Rápida</button>
                </div>
            </div>
        `;
        // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();
    }

    // Função para renderizar a lista de fluxos de remarketing
    function renderFluxosRmkt(fluxos) {
        if (!fluxos) return;

        let tableRows = Object.values(fluxos).map(fluxo => `
            <tr>
                <td style="padding: 8px;">${fluxo.url_registro}</td>
                <td style="padding: 8px;">${fluxo.name}</td>
                <td style="padding: 8px;">${fluxo.disparo}</td>
                <td style="text-align: center; padding: 8px;">
                    <button class="deleteFluxoRmkt" data-fluxoNome="${fluxo.url_registro}" style="border: none; background-color: transparent; cursor: pointer;">
                        <i class="fas fa-trash" style="color: white;"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Remarketing</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                            <th style="text-align: center; padding: 8px;">URL do Fluxo de Remarketing</th>
                            <th style="text-align: center; padding: 8px;">Nome do Fluxo Principal</th>
                            <th style="text-align: center; padding: 8px;">Dias para o disparo</th>
                            <th style="text-align: center; padding: 8px;">Ação</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                <div style="margin-top: 20px;">
                <button id="atualizarListaRmkt" style="cursor: pointer;">Atualizar Fluxos de Remarketing</button>
                <button id="adicionarRmkt" style="cursor: pointer;">Adicionar Remarketing</button>
                </div>
            </div>
        `;
        // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();
    }

    // Função para renderizar a lista de grupos
    function renderFluxosGrupos(fluxos) {
        if (!fluxos) return;

        let tableRows = Object.values(fluxos).map(fluxo => `
            <tr>                
                <td style="padding: 8px;">${fluxo.name}</td>                
                <td style="text-align: center; padding: 8px;">
                    <button class="deleteFluxoGrupo" data-fluxoNome="${fluxo.name}" style="border: none; background-color: transparent; cursor: pointer;">
                        <i class="fas fa-trash" style="color: white;"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Automação de Grupo</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                            <th style="text-align: center; padding: 8px;">ID do Grupo em Atividade</th>                                                               
                            <th style="text-align: center; padding: 8px;">Ação</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                </div>
                <div style="margin-top: 20px;">
                <button id="atualizarGrupo" style="cursor: pointer;">Atualizar Grupos Ativos</button> 
                </div>
            </div>
        `;
        // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();
    }        

function attachEventListeners() {
    // Certifique-se de que o botão "Atualizar Lista" exista antes de tentar anexar um listener
    const updateListBtn = document.getElementById('atualizarLista');
    if (updateListBtn) {
        updateListBtn.addEventListener('click', function() {
            ws.send(JSON.stringify({
                action: 'atualizarLista'
            }));
            //console.log('Solicitação para atualizar lista de fluxos enviada ao servidor.');
        });
    }

    const updateListRapidaBtn = document.getElementById('atualizarListaRapida');
    if (updateListRapidaBtn) {
        updateListRapidaBtn.addEventListener('click', function() {
            ws.send(JSON.stringify({
                action: 'atualizarListaRapida'
            }));
            //console.log('Solicitação para atualizar lista de respostas rápidas enviada ao servidor.');
        });
    }

    const updateRmktBtn = document.getElementById('atualizarListaRmkt');
    if (updateRmktBtn) {
        updateRmktBtn.addEventListener('click', function() {
            ws.send(JSON.stringify({
                action: 'atualizarListaRmkt'
            }));
            //console.log('Solicitação para atualizar lista de remarketing enviada ao servidor.');
        });
    }

    const updateGrupoBtn = document.getElementById('atualizarGrupo');
    if (updateGrupoBtn) {
        updateGrupoBtn.addEventListener('click', function() {
            ws.send(JSON.stringify({
                action: 'atualizarGrupo'
            }));
            //console.log('Solicitação para atualizar grupos enviada ao servidor.');
        });
    }

    // Listener para o botão de upload de arquivo
    const uploadButton = document.getElementById('uploadButton');
    if (uploadButton) {
        uploadButton.addEventListener('click', function() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const content = e.target.result;
                    // Inclui o nome do arquivo na mensagem enviada
                    ws.send(JSON.stringify({
                        action: 'uploadLeads',
                        fileName: file.name, // Inclui o nome do arquivo na mensagem
                        data: content
                    }));
                };
                reader.readAsText(file); // ou use readAsDataURL(file) para base64
                alert('Arquivo de leads enviado com sucesso!');
            } else {
                alert('Por favor, selecione um arquivo JSON para carregar.');
            }
        });
    }

    // Listener para atualizar o texto ao selecionar um arquivo
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileName = this.files && this.files.length > 0 ? this.files[0].name : 'Nenhum arquivo selecionado';
            document.getElementById('fileUploadText').innerText = fileName;
        });
    }

    // Adiciona o listener para o botão "Iniciar Campanha"
const iniciarCampanhaBtn = document.getElementById('iniciarCampanha');
if (iniciarCampanhaBtn) {
    iniciarCampanhaBtn.addEventListener('click', function() {
        const listaLeadsSelect = document.getElementById('listaLeads');
        const minDelayInput = document.getElementById('minDelay');
        const maxDelayInput = document.getElementById('maxDelay');
        const startPositionInput = document.getElementById('startPosition');
        const endPositionInput = document.getElementById('endPosition');
        const fluxoSelecionadoSelect = document.getElementById('fluxoSelecionado');

        const listaleads = listaLeadsSelect.value;
        const minDelay = minDelayInput.value;
        const maxDelay = maxDelayInput.value;
        const startPosition = startPositionInput.value;
        const endPosition = endPositionInput.value;
        const fluxoSelecionado = fluxoSelecionadoSelect.value;

        // Verifica se todos os campos foram preenchidos
        if (!listaleads || !minDelay || !maxDelay || !startPosition || !endPosition || !fluxoSelecionado) {
            alert('Por favor, preencha todos os campos antes de iniciar a campanha.');
            return;
        }

         if (parseInt(minDelay, 10) >= parseInt(maxDelay, 10)) {
         alert('O Delay Mínimo deve ser menor que o Delay Máximo.');
         return;
         }

         if (parseInt(startPosition, 10) >= parseInt(endPosition, 10)) {
         alert('A Posição Inicial deve ser menor que a Posição Final.');
         return;
         }

        // Envia a solicitação para iniciar a campanha ao servidor
        ws.send(JSON.stringify({
            action: 'iniciarCampanha',
            data: {
                listaleads: listaleads, 
                minDelay: parseInt(minDelay, 10),
                maxDelay: parseInt(maxDelay, 10), 
                startPosition: parseInt(startPosition, 10), 
                endPosition: parseInt(endPosition, 10), 
                fluxoSelecionado: fluxoSelecionado
            }
        }));
        alert('Campanha de disparo iniciada!');
        //console.log('Campanha de disparo iniciada!');
    });
}

// Adiciona o listener para o botão "Parar Campanha"
const pararCampanhaBtn = document.getElementById('pararCampanha');
if (pararCampanhaBtn) {
    pararCampanhaBtn.addEventListener('click', function() {
        // Envia a solicitação para parar a campanha ao servidor
        ws.send(JSON.stringify({
            action: 'pararCampanha'
        }));
        alert('Campanha de disparo cancelada!');
        //console.log('Campanha de disparo cancelada!');
    });
}

/* // Protótipo para integrar qrcode no dashboard
// Gerar os QrCodes

const generateQRCodesBtn = document.getElementById('generateQRCodes');
if (generateQRCodesBtn) {
        generateQRCodesBtn.addEventListener('click', function() {
            // Envia a solicitação para gerar ambos os QR Codes ao servidor
            ws.send(JSON.stringify({ action: 'generateListenerQRCode' }));
            ws.send(JSON.stringify({ action: 'generateSenderQRCode' }));
            console.log('Solicitação para gerar ambos os QR Codes enviada ao servidor.');
        });
}

// Adiciona o listener para o botão "Deslogar Instâncias"
const logoutInstancesBtn = document.getElementById('logoutInstances');
if (logoutInstancesBtn) {
        logoutInstancesBtn.addEventListener('click', function() {
            // Envia a solicitação para deslogar ambas as instâncias ao servidor
            ws.send(JSON.stringify({ action: 'logoutListenerInstance' }));
            ws.send(JSON.stringify({ action: 'logoutSenderInstance' }));
            console.log('Solicitação para deslogar ambas as instâncias enviada ao servidor.');
        });
}
*/


    

    // Implemente a lógica para "Adicionar Fluxo" e outros event listeners necessários
}

// Chama attachEventListeners para garantir que os listeners sejam configurados
document.addEventListener('DOMContentLoaded', attachEventListeners);


    // Adiciona um evento de clique para cada link na barra lateral
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir o comportamento padrão de navegação de âncoras
            const sectionName = link.textContent.trim();

            // <a href="#ativarQR"><i class="fas fa-qrcode"></i> Gerar QR Code</a>
            //<p style="margin-top: 20px;">O Futuro começa aqui, seja muito bem vindo(a) futuro mago das automações LowCost</p>
            //<a href="#ativarQR"><i class="fas fa-qrcode"></i> Gerar QR Code</a> Verificar se o link clicado é "Gerar QR Code"
            /*if (sectionName === "Gerar QR Code") {
                // Substituir o conteúdo de mainContent pela seção com botões para abrir as páginas de QR Code
                mainContent.innerHTML = `
                <div id="ativarQRCode">
                    <h2>Ativação de Instâncias do TypeZap</h2>
                    <p>Use os botões abaixo para ativar as instâncias de escuta e envio de mensagens.</p>
                    <div class="button-container" style="margin-top: 20px; display: flex; justify-content: space-around;">
                        <button onclick="window.open('typeListenerQR.html', '_blank')">Ativar Listener QR Code</button>
                        <button onclick="window.open('sendMessageQR.html', '_blank')">Ativar Sender QR Code</button>
                    </div>       
                </div>
                `;
            
                attachEventListeners(); // Assumindo que essa função configura ouvintes de eventos necessários
            }*/
                                            

            // Verificar se o link clicado é "Ativar meu TypeZap"
            if (sectionName === "Ativar meu TypeZap") {
                // Substituir o conteúdo de mainContent pelo formulário de ativação
                mainContent.innerHTML = `
                    <div id="ativarTypeZap">
                        <h2>Ativar meu TypeZap</h2>
                        <p>Insira as informações necessárias para ativar seu TypeZap.</p>
                        <label for="urlField">URL do TypeZap:</label>
                        <input type="text" id="urlField" placeholder="URL do seu TypeZap">
                        <small>Endereço URL para conectar o TypeZap.</small><br>
                        <button id="registerTypeZap">Registrar TypeZap</button>
                        <div id="response" style="margin-top: 20px;"></div>
                    </div>
                `;

                // Adiciona o listener para o botão "Registrar TypeZap"
                document.getElementById('registerTypeZap').addEventListener('click', function() {
                    const url = document.getElementById('urlField').value;                    

                    // Enviar esses valores para o servidor via WebSocket
                    // Verifica se a URL é válida

                    // Verifica se a URL é válida
    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
        alert('A URL deve começar com "http://" ou "https://".');
        return; // Interrompe a execução para evitar o envio dos dados
    }  
    
    alert('Seu TypeZap foi registrado com sucesso!');
         
                    ws.send(JSON.stringify({
                        action: 'registerTypeZap',
                        data: {
                            url: url                            
                        }
                    }));
                    

                });
            }

            // Verificar se o link clicado é "Gerenciar Fluxos"
            if (sectionName === "Gerenciar Fluxos") {
                // Substituir o conteúdo de mainContent pelo formulário de ativação                

                mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Fluxos</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">Nome</th>
                                <th style="text-align: center; padding: 8px;">URL</th>
                                <th style="text-align: center; padding: 8px;">Gatilho</th>
                                <th style="text-align: center; padding: 8px;">Ação</th>
                            </tr>
                        </thead>                       
                    </table>
                </div>
                <div style="margin-top: 20px;">
                    <button id="atualizarLista" style="cursor: pointer;">Atualizar Lista</button>
                    <button id="adicionarFluxo" style="cursor: pointer;">Adicionar Fluxo</button>
                </div>
            </div>
        `;
        // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();
        ws.send(JSON.stringify({ action: 'atualizarLista' }));
            }

            // Verificar se o link clicado é "Gerenciar Respostas Rápidas"
            if (sectionName === "Gerenciar Respostas Rápidas") {
                // Substituir o conteúdo de mainContent pelo formulário de ativação                

                mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Respostas Rápidas</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">Nome</th>
                                <th style="text-align: center; padding: 8px;">Frase de Disparo</th>
                                <th style="text-align: center; padding: 8px;">Ação</th>                              
                            </tr>
                        </thead>                       
                    </table>
                </div>
                <div style="margin-top: 20px;">
                    <button id="atualizarListaRapida" style="cursor: pointer;">Atualizar Respostas Rápidas</button>
                    <button id="adicionarRespostaRapida" style="cursor: pointer;">Adicionar Resposta Rápida</button>
                </div>
            </div>
        `;
        // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();
        ws.send(JSON.stringify({ action: 'atualizarListaRapida' }));
            }

            // Verificar se o link clicado é "Gerenciar Remarketing"
            if (sectionName === "Gerenciar Remarketing") {
                // Substituir o conteúdo de mainContent pelo formulário de ativação                

                mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Remarketing</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">URL do Fluxo de Remarketing</th>
                                <th style="text-align: center; padding: 8px;">Nome do Fluxo Principal</th>
                                <th style="text-align: center; padding: 8px;">Dias para o disparo</th>
                                <th style="text-align: center; padding: 8px;">Ação</th>                              
                            </tr>
                        </thead>                       
                    </table>
                </div>
                <div style="margin-top: 20px;">
                    <button id="atualizarListaRmkt" style="cursor: pointer;">Atualizar Fluxos de Remarketing</button>
                    <button id="adicionarRmkt" style="cursor: pointer;">Adicionar Remarketing</button>
                </div>
            </div>
        `;
        // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();
        ws.send(JSON.stringify({ action: 'atualizarListaRmkt' }));
            }

            // Verificar se o link clicado é "Gerenciar Automação de Grupo"
            if (sectionName === "Gerenciar Automação de Grupo") {
                // Substituir o conteúdo de mainContent pelo formulário de ativação                

                mainContent.innerHTML = `
            <div id="fluxosWrapper">
                <h2>Gerenciar Automação de Grupo</h2>
                <div id="fluxosList" style="max-height: 200px; overflow-y: auto; border: 1px solid #ccc;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #007bff; color: white;">
                                <th style="text-align: center; padding: 8px;">ID do Grupo em Atividade</th>                                                               
                                <th style="text-align: center; padding: 8px;">Ação</th>                              
                            </tr>
                        </thead>                       
                    </table>
                </div>
                <div style="margin-top: 20px;">
                    <button id="atualizarGrupo" style="cursor: pointer;">Atualizar Grupos Ativos</button>                    
                </div>
            </div>
        `;
        // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();
        ws.send(JSON.stringify({ action: 'atualizarGrupo' }));
            }

            if(sectionName === "Carregar Lista de Leads"){

                mainContent.innerHTML = `
                <div id="carregarLeads">
            <h2>Carregar Lista de Leads</h2>
            <div class="file-upload-wrapper">
                <input type="file" id="fileInput" class="file-upload-input" accept=".json">
                <label for="fileInput" class="file-upload-button">Selecione o Arquivo</label>
                <div id="fileUploadText" class="file-upload-text">Nenhum arquivo selecionado</div>
            </div>    
            <button id="uploadButton">Enviar Lista</button>
        </div>
                `;

                // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();                
            }

            if(sectionName === "Disparo de Mensagens em Massa"){

                mainContent.innerHTML = `
                <div id="massMessageDispatch">
    <h2>Disparo de Mensagens em Massa</h2>
    <label for="listaLeads">Selecione a Lista de Leads:</label>
    <select id="listaLeads">
        <!-- Opções de listas preenchidas dinamicamente com JavaScript -->
        <option value="contatos1.json">Lista de Contatos 1</option>
        <option value="contatos2.json">Lista de Contatos 2</option>
    </select>

    <div class="input-group input-group-inline">
    <div>
        <label for="minDelay">Delay Mínimo (segundos):</label>
        <input type="number" id="minDelay" placeholder="Min" />
    </div>
    <div>
        <label for="maxDelay">Delay Máximo (segundos):</label>
        <input type="number" id="maxDelay" placeholder="Max" />
    </div>
</div>

<div class="input-group input-group-inline">
    <div>
        <label for="startPosition">Posição Inicial:</label>
        <input type="number" id="startPosition" placeholder="Início" />
    </div>
    <div>
        <label for="endPosition">Posição Final:</label>
        <input type="number" id="endPosition" placeholder="Fim" />
    </div>
</div>

    <label for="fluxoSelecionado">Selecione o Fluxo:</label>
    <select id="fluxoSelecionado">
        <!-- Opções de fluxos preenchidas dinamicamente com JavaScript -->
        <option value="fluxoVendas">Fluxo de Vendas</option>
        <option value="fluxoSuporte">Fluxo de Suporte</option>
    </select>

    <div class="buttons-group">
        <button id="iniciarCampanha">Iniciar Campanha</button>
        <button id="pararCampanha">Parar Campanha</button>
    </div>
    <div id="campaignStatus" class="campaign-status">Status da Campanha: Aguardando ação...</div>
</div>
                `;

                // Solicita a atualização da lista de leads
        ws.send(JSON.stringify({ action: 'atualizarListaLeads' }));
        ws.send(JSON.stringify({ action: 'atualizarListaFluxos' }));


                // Re-atacha event listeners para os botões recém-criados
        attachEventListeners();  

            }



        });
    });
});