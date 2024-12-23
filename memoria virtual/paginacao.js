

class Processo {

  constructor(numProcesso, tamanhoP, qntdPaginasProcesso, paginasP) {
    this.numProcesso = numProcesso;
    this.tamanhoP = tamanhoP;
    this.qntdPaginasProcesso = qntdPaginasProcesso;
    this.paginasP = paginasP
  }
}

const inputNumber = document.getElementById('inputNumber');
const inputPages = document.getElementById('inputPages');
const generateBtn = document.getElementById('generateBtn');
const addManualBtn = document.getElementById('addManualBtn');
const tabelas = document.getElementById('tabelas');
const tabelaDisco = document.getElementById('discoTable');

// Função para gerar números aleatórios
let tamanho = [], paginas = [];
const container = document.getElementById('dynamicFormContainer');
const tabelaRR = document.getElementById('tabelaRR');
const timelineSection = document.querySelector('.timeline');
const informacaoProcessos = document.querySelector('.div-table');
let processos = [];
let disco = [];
let uniquePageId = 1;

function limparTabelas() {
  tabelaRR.innerHTML = ''; // Limpa a tabela de processos
  tabelaDisco.innerHTML = ''; // Limpa a tabela do disco
}

function toggleButtonState() {
  // Verifica se ambos os campos têm um valor válido (não vazio e maior que zero)
  const isNumberValid = inputNumber.value && inputNumber.value > 0;
  const isPagesValid = inputPages.value && inputPages.value > 0;

  // Habilita ou desabilita os botões com base na validade dos campos
  const shouldEnableButtons = isNumberValid && isPagesValid;
  generateBtn.disabled = !shouldEnableButtons;
  addManualBtn.disabled = !shouldEnableButtons;
}

inputNumber.addEventListener('input', toggleButtonState);
inputPages.addEventListener('input', toggleButtonState);



function instanciaProcesso(numProcesso, tamanhoP, qntdPaginasProcesso) {
  const paginas = [];

  for (let i = 0; i < qntdPaginasProcesso; i++) {
    paginas.push(new Pagina(uniquePageId));
    uniquePageId++;
  }

  let p = new Processo(numProcesso, tamanhoP, qntdPaginasProcesso, paginas);
  processos.push(p);
}


function generateNumbers(quantProcessos, tamPagina) {

  qntdPaginas = [];

  for (let i = 0; i < quantProcessos; i++) {
    tamanho.push(Math.floor(Math.random() * 50) + 2);
  }

  for (let i = 0; i < quantProcessos; i++) {
    qntdPaginas.push(Math.ceil(tamanho[i] / tamPagina));
  }

  return qntdPaginas;
}

function renderRoundRobinTable(quantProcessos, qntdPaginas) {
  tabelaRR.innerHTML = '';

  for (let i = 0; i < quantProcessos; i++) {
    instanciaProcesso((i + 1), tamanho[i], qntdPaginas[i]);
  }

  processos.forEach(processo => {
    console.log('Processo:', processo.numProcesso, 'Tamanho:', processo.tamanhoP, 'Páginas:', processo.paginasP);
  });
  

  processos.forEach(processo =>{
    const ProcessosRow = renderRows(processo.numProcesso, processo.tamanhoP, processo.qntdPaginasProcesso);
    tabelaRR.appendChild(ProcessosRow);

  })
}

function renderRows(numProcesso, tamanhoP, qntdPaginas) {
  const row = document.createElement('tr');
  row.innerHTML = `
        <td>P${numProcesso}</td>
        <td>${tamanhoP}</td>
        <td>${qntdPaginas}</td>
    `;

  return row;
}

function renderDiscoTable(processos){
  const tabelaDisco = document.getElementById('discoTable');
  tabelaDisco.innerHTML = '';

  disco.forEach(pagina =>{
    const row = document.createElement('tr');
    row.id = `${pagina.paginaId}`;
      row.innerHTML = `
        <td>${pagina.paginaId}</td>
        <td>P${pagina.numProcesso}</td>
      `;
      tabelaDisco.appendChild(row);
  })
}

function resetarMemoria() {
  const tabelaFIFO = document.getElementById('fifoTable');
  const rows = tabelaFIFO.querySelectorAll('tr');
  rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      cells.forEach(cell => cell.textContent = '-');
  });
}

function instanciaDisco(processos){

  processos.forEach(processo =>{
    processo.paginasP.forEach(pagina =>{
      disco.push(new Disco(pagina.id, processo.numProcesso))
    })
  })
}

document.getElementById('generateBtn').addEventListener('click', function () {
  processos = [];
  disco = [];
  limparTabelas();

  tabelaRR.innerHTML = ''; 
  document.getElementById('discoTable').innerHTML = ''; 
  tabelas.style.display = 'none';
  container.innerHTML = '';
  uniquePageId = 1;
  document.getElementById('submitProcesses').style.display = 'none';

  resetarMemoria();


  let quantProcessos = document.getElementById('inputNumber').value;
  let tamPagina = document.getElementById('inputPages').value;
  let qntdPaginas = [];

  if (quantProcessos > 0) {
    qntdPaginas = generateNumbers(quantProcessos, tamPagina);
    renderRoundRobinTable(quantProcessos, qntdPaginas);
    instanciaDisco(processos)
    renderDiscoTable(processos);
    
  }
  exibirIdsEmbaralhados();
  tabelas.style.display = 'flex';
});

document.getElementById('addManualBtn').addEventListener('click', function () {
  processos = [];
  disco = [];
  limparTabelas();
  tabelas.style.display = 'none';
  tabelaRR.innerHTML = ''; // Limpa a tabela de processos
  document.getElementById('discoTable').innerHTML = ''; 
  let quantProcessos = document.getElementById('inputNumber').value;

  resetarMemoria();

  if (quantProcessos > 0) {
    // Adiciona os campos para os processos

    container.innerHTML = ''; // Limpa o conteúdo anterior

    for (let i = 0; i < quantProcessos; i++) {
      container.innerHTML += `
              <div class="row mt-2">
                <h5 class="mt-2">Processo ${i + 1}</h5>
                <div class="col-md-4 ">
                  <label for="tamanho${i}" class="form-label">Tamanho:</label>
                  <input type="number" class="form-control" id="tamanho${i}" required>
                </div>
              </div>
            `;
    }
    // Exibe o botão de submeter processos
    document.getElementById('submitProcesses').style.display = 'flex';
  }
});

document.getElementById('submitProcesses').addEventListener('click', function () {
  
  limparTabelas();
  let quantProcessos = document.getElementById('inputNumber').value;
  let tamPagina = document.getElementById('inputPages').value;
  tamanho = [];
  let qntdPaginas = [];


  for (let i = 0; i < quantProcessos; i++) {
    const tamanhoValue = document.getElementById(`tamanho${i}`).value;

    // Adiciona os valores ao array
    tamanho.push(Number(tamanhoValue));
    qntdPaginas.push(Math.ceil(tamanho[i] / tamPagina));
  }

  for (let i = 0; i < quantProcessos; i++) {
    qntdPaginas.push(Math.ceil(tamanho[i] / tamPagina));
  }

  if (quantProcessos > 0) {
    renderRoundRobinTable(quantProcessos, qntdPaginas);
    instanciaDisco(processos)
    renderDiscoTable(processos);
    
  }

  // inicializarMemoriaDisco(quantProcessos, tamPagina);
  container.innerHTML = '';
  document.getElementById('submitProcesses').style.display = 'none';
  tabelas.style.display = 'flex';
  exibirIdsEmbaralhados();

});

document.getElementById('trocaBtn').addEventListener('click', function () {
  if (callSystem.hasNext()) {
      const id = callSystem.nextId();

      // Atualiza a tabela FIFO
      const tabelaFIFO = document.getElementById('fifoTable');
      atualizarTabelaFIFO(tabelaFIFO, id);

      const index = disco.findIndex(pagina => pagina.paginaId === id);

      if (index !== -1) {
        // Remove o objeto do array `disco`
        disco.splice(index, 1);

        // Re-renderiza a tabela do disco
        renderDiscoTable();
    }
  } else {
      alert('Todas as páginas já foram transferidas para a memória.');
  }
});


function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let callSystem;

function exibirIdsEmbaralhados() {
  const idsPaginas = processos.flatMap(processo => processo.paginasP.map(pagina => pagina.id));

  const idsEmbaralhados = embaralharArray(idsPaginas);

  callSystem = new CallSystem(idsEmbaralhados);

  const displayContainer = document.getElementById('arrayDisplay');
  displayContainer.innerHTML = '';

  const titulo = document.createElement('h4');
  titulo.textContent = 'Ordem das Chamadas de Sistema';
  titulo.style.textAlign = 'center';
  titulo.style.color = 'white'; // Centraliza o título
  titulo.style.display = 'block'; 
  titulo.style.marginBottom = '15px'; // Adiciona espaço abaixo do título
  displayContainer.appendChild(titulo);

  idsEmbaralhados.forEach(id => {
      const quadrado = document.createElement('div');
      quadrado.className = 'quadrado';
      quadrado.textContent = id; 
      displayContainer.appendChild(quadrado);
  });
}

function atualizarTabelaFIFO(tabelaFIFO, id) {
  const rows = tabelaFIFO.querySelectorAll('tr');

  // Move todos os valores para cima
  for (let i = 0; i < rows.length - 1; i++) {
      rows[i].firstChild.textContent = rows[i + 1].firstChild.textContent;
  }

  // Adiciona o novo valor na última posição
  rows[rows.length - 1].firstChild.textContent = id || '-';
}

function removerPaginaDisco(tabelaDisco, id) {
  const row = tabelaDisco.querySelector(`tr#${id}`);
  if (row) {
      row.remove();
  }
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




function mostraTabela() {
  const tabelaProcessos = document.getElementById('t1');
  tabelaProcessos.style.display = 'block';
  const tabelaDisco = document.getElementById('t2');
  tabelaDisco.style.display = 'block';
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





