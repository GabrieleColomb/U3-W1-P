// Definire l'interfaccia Smartphone e la sua implementazione
interface Smartphone {
  carica: number;
  numeroChiamate: number;
  costoMinuto: number;
  registroChiamate: { id: number; durata: number; timestamp: Date }[];

  ricarica(euro: number): void;
  numero404(): number;
  getNumeroChiamate(): number;
  chiamata(min: number): void;
  azzeraChiamate(): void;
}

class SmartphoneImpl implements Smartphone {
  carica: number;
  numeroChiamate: number;
  costoMinuto: number;
  registroChiamate: { id: number; durata: number; timestamp: Date }[];

  constructor() {
    this.carica = 0;
    this.numeroChiamate = 0;
    this.costoMinuto = 0.10; //valore 0.10 per far si che prenda 10 centesimi a minuto
    this.registroChiamate = [];
  }

  ricarica(euro: number): void {
    this.carica += euro;
  }

  numero404(): number {
    return this.carica;
  }

  getNumeroChiamate(): number {
    return this.numeroChiamate;
  }

  chiamata(min: number): void {
    const costoChiamata = min * this.costoMinuto;
    if (this.carica >= costoChiamata) {
      this.carica -= costoChiamata;
      this.numeroChiamate++;
      const callRecord = {
        id: this.numeroChiamate,
        durata: min,
        timestamp: new Date(),
      };
      this.registroChiamate.push(callRecord);
      console.log(`Chiamata di ${min} minuti effettuata.`);
    } else {
      console.log("Credito insufficiente per effettuare la chiamata.");
    }
  }

  azzeraChiamate(): void {
    this.numeroChiamate = 0;
    this.registroChiamate = [];
  }
}

const utenti = [
  { nome: "Samsung Gabriele", smartphone: new SmartphoneImpl() },
  { nome: "iPhone Simone", smartphone: new SmartphoneImpl() },
  { nome: "Xiaomi Teresa", smartphone: new SmartphoneImpl() },
];

let utenteCorrente = 0;

function cambiaUtente(utenteIndex: number) {
  utenteCorrente = utenteIndex;
  updateUI();
  updateButtons();
}

function ricaricaCredito() {
  const ricaricaInput = parseFloat((<HTMLInputElement>document.getElementById("ricaricaInput")).value);
  if (!isNaN(ricaricaInput) && ricaricaInput > 0) {
    utenti[utenteCorrente].smartphone.ricarica(ricaricaInput);
    updateUI();
  }
}

function mostraPopupCreditoEsaurito() {
  window.alert("Credito residuo esaurito. Effettuare una ricarica per continuare a chiamare.");
}

function effettuaChiamata() {
  const durataChiamata = parseFloat((<HTMLInputElement>document.getElementById("durataChiamata")).value);
  if (!isNaN(durataChiamata) && durataChiamata > 0) {
    const creditoResiduoPrimaChiamata = utenti[utenteCorrente].smartphone.numero404();
    utenti[utenteCorrente].smartphone.chiamata(durataChiamata);
    const creditoResiduoDopoChiamate =
      utenti[utenteCorrente].smartphone.carica - utenti[utenteCorrente].smartphone.numeroChiamate * utenti[utenteCorrente].smartphone.costoMinuto;

    // Verifica se il credito residuo è diventato 0 o negativo dopo la chiamata
    if (creditoResiduoPrimaChiamata > 0 && creditoResiduoDopoChiamate <= 0) {
      mostraPopupCreditoEsaurito();
    }

    updateUI();
  }
}

function azzeraChiamate() {
  utenti[utenteCorrente].smartphone.azzeraChiamate();
  updateUI();
}

function updateUI() {
  const creditoResiduoElement = <HTMLSpanElement>document.getElementById("creditoResiduo");
  const numeroChiamateElement = <HTMLParagraphElement>document.getElementById("numeroChiamate");
  const registroChiamateContainer = <HTMLDivElement>document.getElementById("registroChiamateContainer");

  const nomeUtenteCorrente = utenti[utenteCorrente].nome;
  const creditoResiduo = utenti[utenteCorrente].smartphone.numero404();
  const numeroChiamate = utenti[utenteCorrente].smartphone.getNumeroChiamate();
  const registroChiamate = utenti[utenteCorrente].smartphone.registroChiamate;

  creditoResiduoElement.textContent = `${nomeUtenteCorrente} - Credito residuo: ${creditoResiduo.toFixed(2)}€`;

  const creditoResiduoDopoChiamate =
    utenti[utenteCorrente].smartphone.carica - numeroChiamate * utenti[utenteCorrente].smartphone.costoMinuto;
  const creditoResiduoDopoChiamateFormatted = creditoResiduoDopoChiamate.toFixed(2);
  numeroChiamateElement.textContent = `Numero di chiamate effettuate: ${numeroChiamate}`;
  creditoResiduoElement.textContent = `Credito residuo: ${creditoResiduoDopoChiamateFormatted}€`;

  // Visualizza i ricordi delle chiamate
  registroChiamateContainer.innerHTML = "<p>Registro chiamate:</p>";
  registroChiamate.forEach((record) => {
    registroChiamateContainer.innerHTML += `<p>Chiamata ${record.id}: Durata: ${record.durata} minuti, Data e ora: ${record.timestamp}</p>`;
  });
}

function updateButtons() {
  const utenteButtons = document.querySelectorAll(".utente-buttons button");
  utenteButtons.forEach((button, index) => {
    if (index === utenteCorrente) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

// Inizializza l'interfaccia UI al caricamento della pagina
updateUI();
updateButtons();

  