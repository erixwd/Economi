// Funzione per scaricare il registro come file JSON
function scaricaJSON() {
    // Costruisci l'array con i dati della tabella
    registro = Array.from(document.querySelectorAll("#registroBody tr")).map(row => ({
        data: row.cells[0].querySelector("input").getAttribute("data-full-date") || row.cells[0].querySelector("input").value,
        descrizione: row.cells[1].querySelector("input").value,
        dare: row.cells[2].querySelector("input").value,
        avere: row.cells[3].querySelector("input").value,
    }));

    // Converti in JSON e scarica il file
    const blob = new Blob([JSON.stringify(registro, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registro-contabile.json";
    a.click();
    URL.revokeObjectURL(url);
}