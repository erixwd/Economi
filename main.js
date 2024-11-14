// Array per contenere i dati del registro
let registro = [];

// Funzione per aggiungere una riga alla tabella
function aggiungiRiga(data = "", descrizione = "", dare = "", avere = "") {
    const registroBody = document.getElementById("registroBody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="text" class="form-control contabile-data-input" placeholder="gg/mm" value="${data}"></td>
        <td><input type="text" class="form-control" value="${descrizione}"></td>
        <td><input type="text" class="form-control contabile-input" value="${dare}"></td>
        <td><input type="text" class="form-control contabile-input" value="${avere}"></td>
    `;

    registroBody.appendChild(newRow);

    window.applicaFormattazione();
    window.applicaFormattazioneData();
    
    newRow.querySelector(".contabile-data-input").focus();
}

// Funzione per mostrare i dati del registro nella tabella
window.mostraRegistro = function(registro) {
    const registroBody = document.getElementById("registroBody");
    registroBody.innerHTML = "";
    // Aggiungi riga dinamicamente
    registro.forEach(item => aggiungiRiga(item.data, item.descrizione, item.dare, item.avere));
}

// Aggiungi la prima riga | Startup point
aggiungiRiga();