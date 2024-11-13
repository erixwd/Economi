// Array per contenere i dati del registro
let registro = [];

// Funzione per aggiungere una riga alla tabella
function aggiungiRiga(data = "", descrizione = "", entrate = "", uscite = "") {
    const registroBody = document.getElementById("registroBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="date" class="form-control" value="${data}"></td>
        <td><input type="text" class="form-control" value="${descrizione}"></td>
        <td><input type="number" class="form-control" value="${entrate}"></td>
        <td><input type="number" class="form-control" value="${uscite}"></td>
    `;

    registroBody.appendChild(newRow);
}

// Funzione per scaricare il registro come file JSON
function scaricaJSON() {
    // Costruisci l'array con i dati della tabella
    registro = Array.from(document.querySelectorAll("#registroBody tr")).map(row => ({
        data: row.cells[0].querySelector("input").value,
        descrizione: row.cells[1].querySelector("input").value,
        entrate: row.cells[2].querySelector("input").value,
        uscite: row.cells[3].querySelector("input").value,
    }));

    // Converti l'array in JSON e scarica il file
    const blob = new Blob([JSON.stringify(registro, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registro-contabile.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Funzione per caricare il registro da un file JSON
function caricaJSON() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        registro = JSON.parse(e.target.result);
        mostraRegistro();
    };

    if (file) {
        reader.readAsText(file);
    }
}

// Funzione per mostrare i dati del registro nella tabella
function mostraRegistro() {
    const registroBody = document.getElementById("registroBody");
    registroBody.innerHTML = "";
    registro.forEach(item => aggiungiRiga(item.data, item.descrizione, item.entrate, item.uscite));
}

// Aggiungi una prima riga di esempio
aggiungiRiga();
