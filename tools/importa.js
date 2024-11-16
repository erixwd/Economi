// Importazione dei dati da JSON
document.getElementById("importaJSON").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const json = e.target.result;
            dataManager.importaJSON(json);
            ricreaInterfaccia();
        };
        reader.readAsText(file);
    }
});

// Ricrea l'interfaccia utente dopo l'importazione
function ricreaInterfaccia() {
    const giornaleBody = document.getElementById("libroGiornaleBody");
    const colonnaAttivi = document.querySelector('[data-categoria="attivi"]');

    giornaleBody.innerHTML = "";
    colonnaAttivi.innerHTML = "";

    // Ricrea il libro giornale e i mastrini
    const mastrini = dataManager.registro.mastrini.attivi;
    mastrini.forEach(mastrino => {
        mastrino.transazioni.forEach(transazione => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" class="form-control conto-input" value="${mastrino.nome}" readonly></td>
                <td><input type="number" class="form-control dare-input" value="${transazione.dare}" data-id="${transazione.id}"></td>
                <td><input type="number" class="form-control avere-input" value="${transazione.avere}" data-id="${transazione.id}"></td>
            `;
            giornaleBody.appendChild(newRow);
        });

        dataManager.aggiornaContoMastro(mastrino.nome);
    });
}