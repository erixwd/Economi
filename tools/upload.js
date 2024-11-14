// Funzione per caricare il registro da un file JSON
function caricaJSON() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        // Leggi il file JSON
        const registro = JSON.parse(e.target.result);
        console.log("Data received from file:", registro);
        mostraRegistro(registro);

        // Popola e formatta le tabelle
        document.querySelectorAll("#registroBody .contabile-data-input").forEach((input, index) => {
            const fullDate = registro[index].data;
            console.log("Full Date for row " + index + ":", fullDate);

            if (fullDate) {
                // Memorizza data completa e formatta in gg/mm
                const [day, month, year] = fullDate.split("/");
                input.setAttribute("data-full-date", fullDate);
                const formattedDate = `${day}/${month}`;
                input.type = "text";
                input.value = formattedDate;
            } else {
                // Errore data non valida
                console.log("No date found for row " + index);
            }
        });
 
    // Rimuove focus
    document.activeElement.blur();
    };

    if (file) {
        // Leggi il file come testo
        reader.readAsText(file);
    }
}