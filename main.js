// Importa il backend
import dataManager from './backend/dataManager.js';

// Aggiungi una nuova riga al libro giornale
document.getElementById("aggiungiRigaGiornale").addEventListener("click", () => {
    aggiungiRigaGiornale();
});

function aggiungiRigaGiornale() {
    const giornaleBody = document.getElementById("libroGiornaleBody");

    // Crea una nuova riga
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td><input type="text" class="form-control conto-input" placeholder="Inserisci conto o data"></td>
        <td><input type="number" class="form-control dare-input" placeholder="" data-id-dare=""></td>
        <td><input type="number" class="form-control avere-input" placeholder="" data-id-avere=""></td>
    `;

    // Aggiungi la riga alla tabella
    giornaleBody.appendChild(newRow);

    // Gestione eventi per la riga
    const contoInput = newRow.querySelector(".conto-input");
    const dareInput = newRow.querySelector(".dare-input");
    const avereInput = newRow.querySelector(".avere-input");

    [contoInput, dareInput, avereInput].forEach(input => {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                const contoNome = contoInput.value.trim();
                if (contoNome === "") return;

                // Controlla se è una data
                if (isDataValida(contoNome)) {
                    creaDivisoreData(contoNome, giornaleBody, newRow);
                    return;
                }

                // Aggiungi il conto al registro e ottieni l'ID della transazione
                const dare = parseFloat(dareInput.value) || 0;
                const avere = parseFloat(avereInput.value) || 0;
                const transazioneId = dataManager.aggiornaRegistroDalGiornale(contoNome, dare, avere);

                // Sincronizza l'ID nella riga
                dareInput.dataset.id = transazioneId;
                avereInput.dataset.id = transazioneId;

                // Aggiungi automaticamente una nuova riga
                aggiungiRigaGiornale();
            }
        });
    });

    // Sincronizza modifiche sui campi "Dare" e "Avere"
    [dareInput, avereInput].forEach(input => {
        input.addEventListener("input", (event) => {
            const id = input.dataset.id;
            if (!id) return;

            const nuovoDare = parseFloat(dareInput.value) || 0;
            const nuovoAvere = parseFloat(avereInput.value) || 0;
            dataManager.aggiornaTransazione(id, nuovoDare, nuovoAvere);
        });
    });

    contoInput.focus();
}

// Funzione per creare un divisore data
function creaDivisoreData(data, giornaleBody, posizioneRiga) {
    const [giorno, mese] = data.split("/");
    const annoCorrente = new Date().getFullYear();
    const dataCompleta = `${giorno.padStart(2, "0")}/${mese.padStart(2, "0")}/${annoCorrente}`;

    // Crea un divisore
    const divisoreRow = document.createElement("tr");
    divisoreRow.classList.add("table-secondary");
    divisoreRow.innerHTML = `
        <td colspan="3" class="fw-bold">${dataCompleta}</td>
    `;

    // Inserisce il divisore prima della riga corrente
    giornaleBody.insertBefore(divisoreRow, posizioneRiga);

    // Cancella il contenuto del campo "Conto"
    posizioneRiga.querySelector(".conto-input").value = "";
}

// Controlla se un input è una data valida (formato gg/mm)
function isDataValida(input) {
    return /^\d{1,2}\/\d{1,2}$/.test(input);
}