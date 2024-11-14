// Formatta in valuta corrente
window.applicaFormattazione = function() {
    document.querySelectorAll(".contabile-input").forEach(input => {
        // Rimuovi la formattazione per poter modificare
        input.addEventListener("focus", function() {
            input.value = input.value.replace(/[^0-9.-]+/g, "");
        });

        // Aggiungi la formattazione una volta uscito
        input.addEventListener("blur", function() {
            let value = input.value.replace(/[^0-9.-]+/g, "");
            if (value) {
                value = parseFloat(value).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD", // (Da modificare con variabile in futuro)
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                input.value = value;
            }
        });
    });
}

window.applicaFormattazioneData = function() {
    document.querySelectorAll(".contabile-data-input").forEach(input => {
        // Mostra formato gg/mm quando non in focus
        input.addEventListener("blur", function() {
            const dateParts = input.getAttribute("data-full-date")?.split("/");

            if (dateParts && dateParts.length === 3) {
                // Se data valida
                const [day, month, year] = dateParts;
                input.type = "text";
                input.value = `${day}/${month}`;
            } else if (input.value) {
                // Se data non è inserita nel formato corretto
                const date = new Date(input.value);
                if (!isNaN(date)) {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    input.type = "text";
                    input.value = `${day}/${month}`;
                    input.setAttribute("data-full-date", `${day}/${month}/${year}`);
                } else {
                    // Se la data non è valida
                    input.type = "text";
                    input.value = "";
                    input.placeholder = "gg/mm";
                    // Errore data non trovata
                    console.log("Date not found");
                }
            } else {
                // Se nessun valore è presente
                input.type = "text";
                input.placeholder = "gg/mm";
            }
        });

        // Cambia in selettore completo per modifica
        input.addEventListener("focus", function() {
            const currentDateParts = input.getAttribute("data-full-date")?.split("/");
            if (currentDateParts && currentDateParts.length === 3) {
                const [day, month, year] = currentDateParts;
                input.type = "date";
                input.value = `${year}-${month}-${day}`;
            } else {
                // Se data non presente
                input.type = "date";
                input.value = "";
            }
        });

        // Selezione della data con un selettore "date" (quando è in focus)
        input.addEventListener("change", function() {
            if (input.type === "date") {
                const selectedDate = new Date(input.value);
                if (!isNaN(selectedDate)) {
                    const day = String(selectedDate.getDate()).padStart(2, '0');
                    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                    const year = selectedDate.getFullYear();
                    input.setAttribute("data-full-date", `${day}/${month}/${year}`);
                }
            }
        });
    });
}