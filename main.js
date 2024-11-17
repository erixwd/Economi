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
    newRow.setAttribute("style", "margin: 1rem 0; padding: 1rem;");
    newRow.innerHTML = `
        <td><input type="text" class="form-control conto-input rounded-0" placeholder="Inserisci conto o data"></td>
        <td><input type="number" class="form-control dare-input rounded-0 valuta" placeholder=" " data-id-dare=""></td>
        <td><input type="number" class="form-control avere-input rounded-0 valuta" placeholder=" " data-id-avere=""></td>
    `;

    // Aggiungi la riga alla tabella
    giornaleBody.appendChild(newRow);

    // Chiamare la funzione per abilitare il drag and drop
    enableDragAndDrop();

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
        
                const dare = parseFloat(dareInput.value) || 0;
                const avere = parseFloat(avereInput.value) || 0;
        
                // Rileva modifica o crea nuovo conto
                dataManager.rilevaModificaOppureCrea(contoNome, dare, avere, newRow);
        
                // Trova la prossima riga nel libro giornale
                const nextRow = newRow.nextElementSibling;
                if (nextRow) {
                    // Se esiste, sposta il focus sulla voce conto della prossima riga
                    const nextContoInput = nextRow.querySelector(".conto-input");
                    if (nextContoInput) {
                        nextContoInput.focus();
                        return;
                    }
                }
        
                // Se non esiste una riga successiva, aggiungi una nuova riga
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
        <div class="fw-bold mt-2">${dataCompleta}</div>
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

// Funzione per abilitare il drag and drop su ogni div di conto
export function enableDragAndDrop() {
    const mastrini = document.querySelectorAll('.conto');

    mastrini.forEach(mastrino => {
        mastrino.setAttribute('draggable', 'true');

        // Rimuovi eventuali listener precedenti
        mastrino.removeEventListener('dragstart', handleDragStart);
        mastrino.removeEventListener('dragend', handleDragEnd);

        // Aggiungi nuovi listener
        mastrino.addEventListener('dragstart', handleDragStart);
        mastrino.addEventListener('dragend', handleDragEnd);
    });

    // Gestione delle colonne che ricevono il drop
    const mastrinoColonne = document.querySelectorAll('.mastrino-colonna');

    mastrinoColonne.forEach(colonna => {
        colonna.removeEventListener('dragover', handleDragOver);
        colonna.removeEventListener('drop', handleDrop);

        colonna.addEventListener('dragover', handleDragOver);
        colonna.addEventListener('drop', handleDrop);
    });
}

// Definizione esplicita delle funzioni di gestione
function handleDragStart(event) {
    const contoNome = event.target.dataset.conto; // Ottieni il nome del conto
    if (!contoNome) {
        console.error("Il conto trascinato non ha un nome valido.");
        return;
    }
    event.dataTransfer.setData('conto', contoNome); // Imposta i dati da trasferire
    console.log("Inizio drag:", contoNome);
}

function handleDragEnd(event) {
    console.log("Drag terminato:", event.target.dataset.conto);
}

function handleDragOver(event) {
    event.preventDefault(); // Permetti il drop
    console.log("Drop Permesso");
}

function handleDrop(event) {
    event.preventDefault(); // Evita comportamenti predefiniti
    const contoNome = event.dataTransfer.getData('conto'); // Ottieni i dati del conto
    const nuovaCategoria = event.currentTarget.dataset.categoria; // Ottieni la categoria della colonna

    if (!contoNome || !nuovaCategoria) {
        console.error("Dati mancanti nel drop:", { contoNome, nuovaCategoria });
        return;
    }

    // Cambia la categoria del conto
    dataManager.cambiaCategoriaConto(contoNome, nuovaCategoria);
    console.log("Conto spostato:", { contoNome, nuovaCategoria });
}

// Startup point
aggiungiRigaGiornale();
document.activeElement.blur();