class Processo {

    constructor(numProcesso, surtoP, prioridadeP, chegadaP, tamanhoP, paginasP) {
      this.numProcesso = numProcesso;
      this.surtoP = surtoP;
      this.prioridadeP = prioridadeP;
      this.chegadaP = chegadaP;
      this.tamanhoP = tamanhoP;
      this.paginasP = paginasP
    }
  
  }
  
  // Função para gerar números aleatórios
  let surto = [], prioridade = [], chegada = [],tamanho = [], paginas = [], quantum, media;
  const container = document.getElementById('dynamicFormContainer');
  const tabelaRR = document.getElementById('tabelaRR');
  const timelineSection = document.querySelector('.timeline');
  const informacaoProcessos = document.querySelector('.div-table');
  let processos = []
  
  function instanciaProcesso(numProcesso, tempoSurto, prioridade, horaChegada, tamanho, tamPagina) {
    const paginas = [];
    const numPaginas = Math.ceil(tamanho / tamPagina);
  
    for (let i = 0; i < numPaginas; i++) {
      paginas.push(new Pagina(`Pagina_${i + 1}`)); 
    }
  
    let p = new Processo(numProcesso, tempoSurto, prioridade, horaChegada, tamanho, paginas);
    processos.push(p);
  }

  const inputNumber = document.getElementById('inputNumber');
    const inputPages = document.getElementById('inputPages');
    const generateBtn = document.getElementById('generateBtn');
    const addManualBtn = document.getElementById('addManualBtn');

    function toggleButtonState() {
        // Verifica se ambos os campos têm um valor válido (não vazio e maior que zero)
        const isNumberValid = inputNumber.value && inputNumber.value > 0;
        const isPagesValid = inputPages.value && inputPages.value > 0;

        // Habilita ou desabilita os botões com base na validade dos campos
        const shouldEnableButtons = isNumberValid && isPagesValid;
        generateBtn.disabled = !shouldEnableButtons;
        addManualBtn.disabled = !shouldEnableButtons;
    }

    // Adiciona o evento de input para verificar mudanças em ambos os campos
    inputNumber.addEventListener('input', toggleButtonState);
    inputPages.addEventListener('input', toggleButtonState);
  
  
  
  function calcularMedia(surtos) {
    let soma = surtos.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
    return soma / surtos.length;
  }
  
  function generateNumbers(quantProcessos) {
  
    surto = [];
    prioridade = [];
    chegada = [];
    tamanho = [];
  
    for (let i = 0; i < quantProcessos; i++) {
      surto.push(Math.floor(Math.random() * 50) + 5);
      prioridade.push(Math.floor(Math.random() * quantProcessos) + 1);
      chegada.push(Math.floor(Math.random() * (quantProcessos * 1.5)));
      tamanho.push(Math.floor(Math.random() * 50) + 5);
  
    media = calcularMedia(surto);
    quantum = Math.floor(Math.random() * media) + 5
  }
  }
  
  document.getElementById('generateBtn').addEventListener('click', function () {
    container.innerHTML = '';
    document.getElementById('submitProcesses').style.display = 'none';
    
  
    let quantProcessos = document.getElementById('inputNumber').value;
    let tamPagina =  document.getElementById('inputPages').value;
  
    if (quantProcessos > 0) {
      generateNumbers(quantProcessos);
      document.getElementById('quantum').textContent = quantum;
      renderRoundRobinTable(quantProcessos, tamPagina)
      renderFIFOTable(quantProcessos, tamPagina);
      mostraTabela()
    }
  });
  
  document.getElementById('addManualBtn').addEventListener('click', function() {
    tabelaRR.innerHTML = '';
    document.querySelector('.div-table').style.display = 'none';
    document.querySelector('.timeline').style.display = 'none';
    let quantProcessos = document.getElementById('inputNumber').value;
    if (quantProcessos > 0) {
        // Adiciona os campos para os processos
        
        container.innerHTML = ''; // Limpa o conteúdo anterior
  
        container.innerHTML += `
            <div class="row mt-2">
              <div class="col-md-2">
                <p>Quantum: </p>
              </div>
              <div class="col-md-4">
                <input type="number" class="form-control" id="quantumP" required>
              </div>
            </div>`;
        for (let i = 0; i < quantProcessos; i++) {
            container.innerHTML += `
              <div class="row mt-2">
                <h5 class="mt-2">Processo ${i + 1}</h5>
                <div class="col-md-4">
                  <label for="surto${i}" class="form-label">Tempo de Surto:</label>
                  <input type="number" class="form-control" id="surto${i}" required>
                </div>
                <div class="col-md-4">
                  <label for="prioridade${i}" class="form-label">Prioridade:</label>
                  <input type="number" class="form-control" id="prioridade${i}" required>
                </div>
                <div class="col-md-4 ">
                  <label for="chegada${i}" class="form-label">Tempo de Chegada:</label>
                  <input type="number" class="form-control" id="chegada${i}" required>
                </div>
                <div class="col-md-4 ">
                  <label for="tamanho${i}" class="form-label">Tamanho:</label>
                  <input type="number" class="form-control" id="tamanho${i}" required>
                </div>
              </div>
            `;
        }
        // Exibe o botão de submeter processos
        document.getElementById('submitProcesses').style.display = 'block';
    }
  });
  
  document.getElementById('submitProcesses').addEventListener('click', function() {
    let quantProcessos = document.getElementById('inputNumber').value;
    surto = [];
    prioridade = [];
    chegada = [];
    tamanho = [];
  
    for (let i = 0; i < quantProcessos; i++) {
        const surtoValue = document.getElementById(`surto${i}`).value;
        const prioridadeValue = document.getElementById(`prioridade${i}`).value;
        const chegadaValue = document.getElementById(`chegada${i}`).value;
        const tamanhoValue = document.getElementById(`tamanho${i}`).value;
  
        // Adiciona os valores ao array
        surto.push(Number(surtoValue));
        prioridade.push(Number(prioridadeValue));
        chegada.push(Number(chegadaValue));
        tamanho.push(Number(tamanhoValue));
    }
  
    quantum = Number(document.getElementById('quantumP').value);
    document.getElementById('quantum').textContent = quantum;
  
    renderRoundRobinTable(quantProcessos);
    renderFIFOTable(quantProcessos, tamPagina);
    inicializarMemoriaDisco(quantProcessos, tamPagina); 
    mostraTabela()
    container.innerHTML = '';
    document.getElementById('submitProcesses').style.display = 'none';
  
  });
  
  function renderRoundRobinTable(quantProcessos, tamPagina ) {
    tabelaRR.innerHTML = '';
  
    for (let i = 0; i < quantProcessos; i++) {
      const rowRR = renderRows((i + 1), surto[i], prioridade[i], chegada[i], tamanho[i]);
      tabelaRR.appendChild(rowRR);

      instanciaProcesso((i + 1), surto[i], prioridade[i], chegada[i], tamanho[i], tamPagina);
    }
    roundRobin(processos);
  }

  function renderFIFOTable(quantProcessos, tamPagina) {
    const tabelaFIFO = document.getElementById('tabelaFIFO');
    tabelaFIFO.innerHTML = ''; 
  
    for (let i = 0; i < quantProcessos; i++) {
      const numProcesso = i + 1;
      const tamanhoProcesso = tamanho[i];
      const paginasDoProcesso = [];
  
      const quantPaginas = Math.ceil(tamanhoProcesso / tamPagina);
      for (let j = 0; j < quantPaginas; j++) {
        paginasDoProcesso.push(`Página ${j + 1}`);
      }
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>Processo ${numProcesso}</td>
        <td>${paginasDoProcesso.join(', ')}</td>
      `;
      tabelaFIFO.appendChild(row);
    }
  }

  
  
  
  
  
  function renderRows(numProcesso, surtoP, prioridadeP, chegadaP, tamanhoP) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>P${numProcesso}</td>
        <td>${surtoP}</td>
        <td>${prioridadeP}</td>
        <td>${chegadaP}</td>
         <td>${tamanhoP}</td>
    `;
  
    return row;
  }
  
  function mostraTabela() {
    const tabelaRR = document.getElementById('t2');
    tabelaRR.style.display = 'block';
    const tabelaFIFO = document.getElementById('t1');
    tabelaFIFO.style.display = 'block';
  }
  
  

  
  
  // LÓGICA ROUND ROBIN
  
  //INSTANCIA DE PROCESSO
  
  function sortProcessosPorChegada(processos) {
    return processos.sort((a, b) => {
      // Primeiro ordena pelo tempo de chegada
      if (a.chegadaP !== b.chegadaP) {
        return a.chegadaP - b.chegadaP;
      }
      // Se o tempo de chegada for igual, ordena pela prioridade
      return a.prioridadeP - b.prioridadeP;
    });
  }
  
  function somaTempoSurto(processos) {
    let somatorioTempoSurto = 0;
    for (let i = 0; i < processos.length; i++) {
      somatorioTempoSurto += processos[i].surtoP;
    }
    return somatorioTempoSurto;
  }
  
  function popularListaComProcessos(listaExecucaoProcessos, processosOrdenados) {
    for (let i = 0; i < processosOrdenados.length; i++) {
      listaExecucaoProcessos.set(processosOrdenados[i], []);
    }
    return listaExecucaoProcessos;
  }
  
  function adicionarValor(listaExecucaoProcessos, processo, passo) {
    listaExecucaoProcessos.get(processo).push(passo);
  }
  
  function roundRobin(processos) {
    let passoComAnterior = 0;
    let somatorioTemposSurto = 0;
    somatorioTemposSurto = somaTempoSurto(processos);
    let processosOrdenados = [];
    processosOrdenados = sortProcessosPorChegada(processos);
  
    let listaExecucaoProcessos = new Map();
  
    listaExecucaoProcessos.clear();
  
    listaExecucaoProcessos = popularListaComProcessos(listaExecucaoProcessos, processosOrdenados);
  
    while (somatorioTemposSurto != 0) {
      for (let i = 0; i < processosOrdenados.length; i++) {
        let tempoSurtoRestante = processosOrdenados[i].surtoP - quantum;
  
        if (processosOrdenados[i].surtoP == 0) {
          adicionarValor(listaExecucaoProcessos, processosOrdenados[i], processosOrdenados[i].surtoP);
        } else if (tempoSurtoRestante < 0) {
          tempoSurtoRestante = 0;
          somatorioTemposSurto -= processosOrdenados[i].surtoP;
          passoComAnterior += processosOrdenados[i].surtoP
          adicionarValor(listaExecucaoProcessos, processosOrdenados[i], passoComAnterior);
          processosOrdenados[i].surtoP = 0;
        } else {
          somatorioTemposSurto -= quantum;
          processosOrdenados[i].surtoP -= quantum;
          passoComAnterior += quantum;
          adicionarValor(listaExecucaoProcessos, processosOrdenados[i], passoComAnterior);
        }
  
        console.log("rodada " + i + ": " + passoComAnterior)
      }
    }
  
    renderTimeline(listaExecucaoProcessos, processos[0])
    mostraTimeline()
  }
  
  function testa(listaExecucaoP) {
    listaExecucaoP.forEach((valor, chave) => {
      console.log('Processo: ', chave.numProcesso, 'tempo de surto executado por execução: ', valor);
    });
  }
  
  function renderTimeline(listaExecucaoP, processo) {
    const ol = document.getElementById('historias');
    const tamanhoArray = listaExecucaoP.get(processo).length;
    ol.innerHTML = '';
  
    for (let i = 0; i < tamanhoArray; i++) {
      listaExecucaoP.forEach((valor, chave) => {
        if (valor[i] != 0) {
          const timeElement = renderProcessos(chave.numProcesso, valor[i]);
          ol.appendChild(timeElement);
        }
      });
    }
  
  }
  
  function renderProcessos(numProcesso, final) {
    const li = document.createElement('li');
  
    li.innerHTML = `
        <div class="d-flex flex-column align-items-start">
            <time class="h5 fw-bold">Processo ${numProcesso}</time>
            <span>${final}</span>
        </div>
    `;
  
    return li;
  }
  
  function mostraTimeline() {
    timelineSection.style.display = 'block';
  }
  
  
  
