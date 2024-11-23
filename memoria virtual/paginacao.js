const headerPath = '../header.html';

fetch(headerPath)
  .then(response => response.text())
  .then(data => document.getElementById('header').innerHTML = data)
  .catch(error => console.error('Erro ao carregar o header:', error));

class Processo {

  constructor(numProcesso, tamanhoP, qntdPaginasProcesso, paginasP) {
    this.numProcesso = numProcesso;
    this.qntdPaginasProcesso = qntdPaginasProcesso;
    this.tamanhoP = tamanhoP;
    this.paginasP = paginasP
  }
}

// Função para gerar números aleatórios
let tamanho = [], paginas = [];
const container = document.getElementById('dynamicFormContainer');
const tabelaRR = document.getElementById('tabelaRR');
const timelineSection = document.querySelector('.timeline');
const informacaoProcessos = document.querySelector('.div-table');
let processos = []
let uniquePageId = 1;

function instanciaProcesso(numProcesso, tamanho, tamPagina, qntdPaginasProcesso) {
  const paginas = [];

  for (let i = 0; i < qntdPaginasProcesso; i++) {
    paginas.push(new Pagina(uniquePageId));
    uniquePageId++;
  }

  let p = new Processo(numProcesso, tamanho, tamPagina, qntdPaginasProcesso, paginas);
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


function generateNumbers(quantProcessos, tamPagina) {

  tamanho = [];
  qntdPaginas = [];

  for (let i = 0; i < quantProcessos; i++) {
    tamanho.push(Math.floor(Math.random() * 50) + 5);
    qntdPaginas.push(Math.ceil(tamanho[i] / tamPagina));
  }

  return qntdPaginas;
}

function renderDiscoTable(processos){
  const tabelaDisco = document.getElementById('discoTable');
  tabelaDisco.innerHTML = '';

  processos.forEach(processo =>{
    processo.paginasP.forEach(pagina =>{
      const row = document.createElement('tr');
      row.id = `${pagina}`;
      row.innerHTML = `
        <td>${pagina}</td>
        <td>Processo ${processo.numProcesso}</td>
      `;
      tabelaDisco.appendChild(row);
    })

  })


}

document.getElementById('generateBtn').addEventListener('click', function () {
  container.innerHTML = '';
  uniquePageId = 1;
  document.getElementById('submitProcesses').style.display = 'none';


  let quantProcessos = document.getElementById('inputNumber').value;
  let tamPagina = document.getElementById('inputPages').value;
  let qntdPaginas = [];

  if (quantProcessos > 0) {
    qntdPaginas = generateNumbers(quantProcessos, tamPagina);
    renderRoundRobinTable(quantProcessos, tamPagina, qntdPaginas);
    renderDiscoTable(processos);
    mostraTabela()
  }
});

document.getElementById('addManualBtn').addEventListener('click', function () {
  tabelaRR.innerHTML = '';
  document.querySelector('.div-table').style.display = 'none';
  document.querySelector('.timeline').style.display = 'none';
  let quantProcessos = document.getElementById('inputNumber').value;
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
    document.getElementById('submitProcesses').style.display = 'block';
  }
});

document.getElementById('submitProcesses').addEventListener('click', function () {
  let quantProcessos = document.getElementById('inputNumber').value;
  tamanho = [];
  let qntdPaginas = [];

  for (let i = 0; i < quantProcessos; i++) {
    const tamanhoValue = document.getElementById(`tamanho${i}`).value;

    // Adiciona os valores ao array
    tamanho.push(Number(tamanhoValue));
    qntdPaginas.push(Math.ceil(tamanho[i] / tamPagina));
  }


  renderRoundRobinTable(quantProcessos, tamPagina, qntdPaginas);
  renderDiscoTable(processos);
  // inicializarMemoriaDisco(quantProcessos, tamPagina);
  mostraTabela()
  container.innerHTML = '';
  document.getElementById('submitProcesses').style.display = 'none';

});

function renderRoundRobinTable(quantProcessos, tamPagina, qntdPaginas) {
  tabelaRR.innerHTML = '';

  for (let i = 0; i < quantProcessos; i++) {
    const rowRR = renderRows((i + 1), tamanho[i], qntdPaginas[i]);
    tabelaRR.appendChild(rowRR);

    instanciaProcesso((i + 1), tamanho[i], tamPagina, qntdPaginas[i]);
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






function renderRows(numProcesso, tamanhoP) {
  const row = document.createElement('tr');
  row.innerHTML = `
        <td>P${numProcesso}</td>
         <td>${tamanhoP}</td>
    `;

  return row;
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





