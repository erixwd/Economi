let registroDati = [];  // Questo array conterrà il nostro registro

// Funzione per aggiungere una nuova riga al registro
function aggiungiRiga() {
    const registro = document.getElementById("registro");
    const nuovaRiga = document.createElement("div");
    nuovaRiga.classList.add("table-row");

    const dataCell = creaCellaInput("data");
    const descrizioneCell = creaCellaInput("descrizione");
    const importoCell = creaCellaInput("importo");

    nuovaRiga.appendChild(dataCell);
    nuovaRiga.appendChild(descrizioneCell);
    nuovaRiga.appendChild(importoCell);
    registro.appendChild(nuovaRiga);

    registroDati.push({ data: "", descrizione: "", importo: "" });
}

// Funzione per creare una cella con input
function creaCellaInput(campo) {
    const cella = document.createElement("div");
    cella.classList.add("table-cell");
    
    const input = document.createElement("input");
    input.type = "text";
    input.addEventListener("input", function() {
        const rigaIndex = Array.from(cella.parentNode.parentNode.children).indexOf(cella.parentNode) - 1;
        registroDati[rigaIndex][campo] = input.value;
    });
    cella.appendChild(input);
    return cella;
}

// Funzione per scaricare il registro come file JSON
function scaricaJSON() {
    const blob = new Blob([JSON.stringify(registroDati, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registro_contabile.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Funzione per caricare il JSON e popolare la tabella
function caricaJSON(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            registroDati = JSON.parse(e.target.result);
            popolaTabella();
        };
        reader.readAsText(file);
    }
}

// Funzione per popolare la tabella con i dati caricati
function popolaTabella() {
    const registro = document.getElementById("registro");
    registro.innerHTML = `
        <div class="table-row">
            <div class="table-cell">Data</div>
            <div class="table-cell">Descrizione</div>
            <div class="table-cell">Importo</div>
        </div>
    `;

    registroDati.forEach(transazione => {
        const riga = document.createElement("div");
        riga.classList.add("table-row");

        const dataCell = creaCellaInput("data");
        dataCell.firstChild.value = transazione.data;

        const descrizioneCell = creaCellaInput("descrizione");
        descrizioneCell.firstChild.value = transazione.descrizione;

        const importoCell = creaCellaInput("importo");
        importoCell.firstChild.value = transazione.importo;

        riga.appendChild(dataCell);
        riga.appendChild(descrizioneCell);
        riga.appendChild(importoCell);
        registro.appendChild(riga);
    });
}