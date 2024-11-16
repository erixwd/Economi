const dataManager = {
    registro: {
        libroGiornale: [],
        mastrini: {
            attivi: [],
            passivi: [],
            costi: [],
            ricavi: []
        }
    },

    // Genera un ID unico per le transazioni
    generaIdUnico() {
        return 't' + Date.now() + Math.random().toString(16).slice(2);
    },

    // Crea un conto se non esiste
    creaContoSeNonEsiste(conto) {
        for (const categoria in this.registro.mastrini) {
            if (this.registro.mastrini[categoria].some(m => m.nome === conto)) {
                return;
            }
        }

        this.registro.mastrini.attivi.push({
            nome: conto,
            transazioni: [],
            categoria: "attivi"
        });
    },

    // Aggiunge una transazione al mastrino
    aggiornaRegistroDalGiornale(conto, dare, avere) {
        const mastrino = this.trovaConto(conto);
        if (mastrino) {
            const idUnico = this.generaIdUnico();
            mastrino.transazioni.push({ id: idUnico, dare, avere });
            this.aggiornaContoMastro(conto);
            return idUnico; // Restituisci l'ID per sincronizzare il giornale
        }

        this.creaContoSeNonEsiste(conto);
        return this.aggiornaRegistroDalGiornale(conto, dare, avere);
    },

    // Aggiorna una transazione specifica
    aggiornaTransazione(id, dare, avere) {
        for (const categoria in this.registro.mastrini) {
            for (const mastrino of this.registro.mastrini[categoria]) {
                const transazione = mastrino.transazioni.find(t => t.id === id);
                if (transazione) {
                    transazione.dare = dare;
                    transazione.avere = avere;
                    this.aggiornaContoMastro(mastrino.nome);
                    this.aggiornaGiornaleDaRegistro(id, dare, avere);
                    return;
                }
            }
        }
    },

    // Trova un conto per nome
    trovaConto(nomeConto) {
        for (const categoria in this.registro.mastrini) {
            const mastrino = this.registro.mastrini[categoria].find(m => m.nome === nomeConto);
            if (mastrino) return mastrino;
        }
        return null;
    },

    // Aggiorna il mastrino nel DOM
    aggiornaContoMastro(nomeConto) {
        const colonnaAttivi = document.querySelector('[data-categoria="attivi"]');
        const mastrino = this.trovaConto(nomeConto);
        let mastrinoElemento = colonnaAttivi.querySelector(`[data-conto="${nomeConto}"]`);

        if (!mastrinoElemento) {
            mastrinoElemento = document.createElement("div");
            mastrinoElemento.classList.add("conto");
            mastrinoElemento.dataset.conto = nomeConto;
            colonnaAttivi.appendChild(mastrinoElemento);
        }

        mastrinoElemento.innerHTML = `
            <div><strong>${mastrino.nome}</strong></div>
            ${mastrino.transazioni.map(t => `
                <div>
                    <span>Dare: <input type="number" value="${t.dare}" class="mastrino-dare" data-id="${t.id}" /></span>
                    <span>Avere: <input type="number" value="${t.avere}" class="mastrino-avere" data-id="${t.id}" /></span>
                </div>
            `).join("")}
        `;

        mastrinoElemento.querySelectorAll(".mastrino-dare, .mastrino-avere").forEach(input => {
            input.addEventListener("input", (e) => {
                const id = e.target.dataset.id;
                const nuovoValore = parseFloat(e.target.value) || 0;
                const tipo = e.target.classList.contains("mastrino-dare") ? "dare" : "avere";
                const transazione = mastrino.transazioni.find(t => t.id === id);
                if (transazione) {
                    if (tipo === "dare") transazione.dare = nuovoValore;
                    if (tipo === "avere") transazione.avere = nuovoValore;
                    this.aggiornaGiornaleDaRegistro(id, transazione.dare, transazione.avere);
                }
            });
        });
    },

    // Aggiorna il libro giornale dal registro
    aggiornaGiornaleDaRegistro(id, dare, avere) {
        const giornaleBody = document.getElementById("libroGiornaleBody");
        const riga = [...giornaleBody.querySelectorAll("tr")].find(tr => {
            const dareInput = tr.querySelector("[data-id-dare]");
            const avereInput = tr.querySelector("[data-id-avere]");
            return dareInput && dareInput.dataset.id === id && avereInput && avereInput.dataset.id === id;
        });

        if (riga) {
            riga.querySelector("[data-id-dare]").value = dare;
            riga.querySelector("[data-id-avere]").value = avere;
        }
    }
};

export default dataManager;