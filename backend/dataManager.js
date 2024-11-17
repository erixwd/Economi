    // Importa il frontend
    import { enableDragAndDrop } from '../main.js';

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

        rimuoviVociCollegate(contoNome) {
            for (const categoria in this.registro.mastrini) {
                const mastrino = this.registro.mastrini[categoria].find(m => m.nome === contoNome);
                if (mastrino) {
                    mastrino.transazioni = [];
                    this.aggiornaContoMastro(contoNome);
                    break;
                }
            }
        },

        rimuoviContoSeVuoto(contoNome) {
            for (const categoria in this.registro.mastrini) {
                const index = this.registro.mastrini[categoria].findIndex(m => m.nome === contoNome);
                if (index !== -1) {
                    const mastrino = this.registro.mastrini[categoria][index];
                    // Rimuove solo se non ci sono transazioni e non è referenziato nel libro giornale
                    const transazioniResidue = mastrino.transazioni.length > 0;
                    const referenzeNelGiornale = [...document.querySelectorAll(`[data-conto="${contoNome}"]`)].length > 0;

                    if (!transazioniResidue && !referenzeNelGiornale) {
                        this.registro.mastrini[categoria].splice(index, 1);
                        // Rimuove il mastrino dal DOM
                        const elemento = document.querySelector(`[data-conto="${contoNome}"]`);
                        if (elemento) elemento.remove();
                        break;
                    }
                }
            }
        },


        rilevaModificaOppureCrea(contoNome, dare, avere, riga) {
            const dareId = riga.querySelector(".dare-input").dataset.id;
            const avereId = riga.querySelector(".avere-input").dataset.id;
        
            // Se non esiste un ID, è una nuova creazione
            if (!dareId && !avereId) {
                const transazioneId = this.aggiornaRegistroDalGiornale(contoNome, dare, avere);
                riga.querySelector(".dare-input").dataset.id = transazioneId;
                riga.querySelector(".avere-input").dataset.id = transazioneId;
            } else {
                // Modifica esistente: elimina vecchie voci e crea le nuove
                const vecchioNome = this.trovaNomeDaId(dareId || avereId);
                if (vecchioNome !== contoNome) {
                    this.rimuoviVociCollegate(vecchioNome);
                    this.rimuoviContoSeVuoto(vecchioNome);
                }
                const nuovoId = this.aggiornaRegistroDalGiornale(contoNome, dare, avere);
                riga.querySelector(".dare-input").dataset.id = nuovoId;
                riga.querySelector(".avere-input").dataset.id = nuovoId;
            }
        },

        trovaNomeDaId(id) {
            for (const categoria in this.registro.mastrini) {
                for (const mastrino of this.registro.mastrini[categoria]) {
                    if (mastrino.transazioni.some(t => t.id === id)) {
                        return mastrino.nome;
                    }
                }
            }
            return null;
        },        

        // Funzione per cambiare la categoria di un conto
        cambiaCategoriaConto(contoNome, nuovaCategoria) {
            const conto = this.trovaConto(contoNome);
            if (!conto) return;

            // Rimuovi il conto dalla categoria attuale
            for (const categoria in this.registro.mastrini) {
                const index = this.registro.mastrini[categoria].findIndex(c => c.nome === contoNome);
                if (index !== -1) {
                    // Rimuovi il vecchio mastrino dal DOM
                    const mastrinoElemento = document.querySelector(`[data-conto="${contoNome}"]`);
                    if (mastrinoElemento) mastrinoElemento.remove();

                    // Rimuovi il conto dalla categoria
                    this.registro.mastrini[categoria].splice(index, 1);
                }
            }

            // Aggiungi il conto alla nuova categoria
            conto.categoria = nuovaCategoria;
            this.registro.mastrini[nuovaCategoria].push(conto);

            // Aggiorna il DOM
            this.aggiornaContoMastro(contoNome);

            // Riapplica i listener di drag and drop
            enableDragAndDrop();
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
                // Controlla se il conto ha già transazioni vuote e rimuovile
                mastrino.transazioni = mastrino.transazioni.filter(t => t.dare > 0 || t.avere > 0);
        
                const idUnico = this.generaIdUnico();
                mastrino.transazioni.push({ id: idUnico, dare, avere });
                this.aggiornaContoMastro(conto);
                return idUnico;
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

        // Aggiorna il conto mastro
        aggiornaContoMastro(nomeConto) {
            const mastrino = this.trovaConto(nomeConto);
            if (!mastrino) return;
        
            // Trova l'elemento esistente e rimuovilo (se presente)
            const mastriniEsistenti = document.querySelectorAll(`[data-conto="${nomeConto}"]`);
            mastriniEsistenti.forEach(m => m.remove());
        
            // Trova la colonna corretta in base alla categoria attuale
            const colonna = document.querySelector(`[data-categoria="${mastrino.categoria}"]`);
        
            // Crea il nuovo elemento mastrino
            let mastrinoElemento = document.createElement("div");
            mastrinoElemento.classList.add("conto");
            mastrinoElemento.classList.add("rounded-0");
            mastrinoElemento.classList.add("border-2");
            mastrinoElemento.classList.add("my-0")
            mastrinoElemento.dataset.conto = nomeConto;
        
            // Aggiungi attributi per drag and drop
            mastrinoElemento.setAttribute("draggable", "true");
            mastrinoElemento.addEventListener("dragstart", this.onDragStart.bind(this, nomeConto));
        
            // Append il mastrino nella nuova colonna
            colonna.appendChild(mastrinoElemento);
        
            // Popola il contenuto del mastrino
            mastrinoElemento.innerHTML = `
                <div class="text-center"><strong>${mastrino.nome}</strong></div>
                <hr>
                ${mastrino.transazioni.map(t => `
                    <tr>
                        <th scope="col" style="width: 50%;"><input type="number" value="${t.dare}" class="mastrino-dare" data-id="${t.id}" /></th>
                        <th scope="col" style="width: 50%;"><input type="number" value="${t.avere}" class="mastrino-avere" data-id="${t.id}" /></th>
                    </tr>
                `).join("")}
            `;
        
            // Aggiungi listener per aggiornamenti
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

        onDragStart(e, nomeConto) {
            console.log('Drag started on:', nomeConto);
            // Il resto della logica per il dragstart
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