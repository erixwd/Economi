// Esportazione dei dati in JSON
document.getElementById("esportaJSON").addEventListener("click", () => {
    const json = dataManager.esportaJSON();
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "registro.json";
    link.click();
});