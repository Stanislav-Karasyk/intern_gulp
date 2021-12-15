interface IAccount{
    id: number;
    type: 'debit' | 'credit';
    currency: string;
    isActive: boolean;
    creationDate: string;
    expirationDate: string,
    balance?: number;
    creditLimit?: number;
    personalFunds?: number;
    usedCreditFunds?: number;
  }

  interface IClient{
    id: number;
    name: string;
    surname: string;
    registrationDate: string;
    isActive: boolean;
    accounts: IAccount[];
  }

  interface IExchangeRates {
    ccy: string;
    base_ccy: string; 
    buy: string; 
    sale: string;
  }

  interface IDebtors {
    debtors: number,
    sumDebt: number,
  }

  interface IBank {
    clients: IClient[];
    bank: HTMLElement;
    clientId: number;
    accountId: number;

    render(): void;
    showForm(сlient?: IClient): void;
    handleSubmitForm(form: HTMLElement, event: Event): void;
    handleClick(event: Event): void;
    showClientsList(clientsList: HTMLElement): void;
    showClientAccounts(selectedClientId: number): void;
    addClient(formData: FormData): IClient;
    findClient(id: number): IClient;
    addAccount(formData: FormData): IAccount;
    convertsСurrency(rates: IExchangeRates[], initial: string, final: string, amount: number): number;
    getTotalAmountFunds(finalСгrrency: string): Promise<number>;
    getTotalAmountDebts(finalСгrrency: string): Promise<number>;
    getDebtors(isActive: boolean, finalСгrrency: string): Promise<IDebtors>;
    getExchangeRates(handleError: Function): Promise<IExchangeRates[]>;
  }

  class Bank implements IBank {
    clients: IClient[] ;
    bank: HTMLElement;
    clientId: number;
    accountId: number;
    
  constructor(clients?: IClient[]) {
    this.clients = clients || [];
    this.bank = document.querySelector(".bank");
    this.clientId = 4;
    this.accountId = 4;
    this.render();
  }

  render(): void {
    this.showForm();

    if (document.querySelector("ul")) {
      document.querySelector("ul").remove();
    }
    if (document.querySelector(".accountsList")) {
      document.querySelector(".accountsList").remove();
    }

    let clientsList = this.bank.appendChild(document.createElement("ul"));

    clientsList.addEventListener("click", this.handleClick);

    this.showClientsList(clientsList);
  }

  handleSubmitForm(form: HTMLElement, event: Event): void {
    event.preventDefault();

    let formData: FormData = new FormData(form as HTMLFormElement);
    this.addClient(formData);
    this.addAccount(formData);

    this.render();
  }

  handleClick(event: Event): void {
    event.preventDefault();

    if ((event.target as HTMLElement).nodeName !== "BUTTON") {
      return;
    }

    let selectedClientId: number = Number((event.target as HTMLElement).closest("li").dataset.id);

    if ((event.target as HTMLElement).dataset.action === "delete") {
      if (document.querySelector(".accountsList")) {
        document.querySelector(".accountsList").remove();
      }
      this.clients.forEach((client, indexClient, arr) => {
        if (client.id === selectedClientId) {
          arr.splice(indexClient, 1);
        }
      });
      (event.target as HTMLElement).closest("li").remove();
    }

    if ((event.target as HTMLElement).dataset.action === "edit") {
      this.clients.forEach((client, indexClient, arr) => {
        if (client.id === selectedClientId) {
          newBank.showForm(client);
          arr.splice(indexClient, 1);
        }
      });
    }

    if ((event.target as HTMLElement).dataset.action === "accounts") {
      if (document.querySelector(".accountsList")) {
        document.querySelector(".accountsList").remove();
      }

      newBank.showClientAccounts(selectedClientId);
    }
  }

  showForm(сlient?: IClient): void {
    let template: string = `<form class="form">
    <fieldset>
      <legend>${сlient ? "Edit client" : "Add client"}</legend>
      <label>
        Name
        <input type="text" name="name" value="${сlient ? сlient.name : ""}"/>
      </label>
      <label>
        Surname
        <input type="text" name="surname" 
        value="${сlient ? сlient.surname : ""}"/>
      </label>
      <label>
       Is active
        <select name="isActive">
          <option value="${сlient ? сlient.isActive : "true"}">
            ${сlient ? сlient.isActive : "true"}
          </option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </label>
        <label>
          Type account
          <select name="type">
            <option value="debit">debit</option>
            <option value="credit">credit</option>
          </select>
        </label>
        <label>
          Currency
          <select name="currency">
            <option value="UAH">UAH</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RUR">RUR</option>
          </select>
        </label>
        <label>
          Balance
          <input type="number" name="balance" />
        </label>
        <label>
          Credit limit
          <input type="number" name="creditLimit" />
        </label>
      <button type="submit">${сlient ? "Edit" : "Add"}</button>
    </fieldset>
  </form>`;

  if (document.querySelector(".form")) {
      document.querySelector(".form").remove();
    }

    this.bank.insertAdjacentHTML("afterbegin", template);
    
    let form: HTMLElement = document.querySelector(".form");
    form.addEventListener("submit", this.handleSubmitForm.bind(this, form));
  }

  showClientsList(clientsList: HTMLElement): void {
    this.clients.forEach(
      ({ id, name, surname, registrationDate, isActive }) => {
        const template: string = `<li class="client-item" data-id="${id}">
          <span>Name: <span>${name}</span> |</span>
          <span>Surname: <span>${surname}</span> |</span>
          <span>Registration date: <span>${registrationDate}</span> |</span>
          <span>isActive: <span>${isActive}</span> </span>
          <button type="button" data-action="accounts">accounts</button>
          <button type="button" data-action="edit">edit</button>
          <button type="button" data-action="delete">delete</button>
        </li>`;

        clientsList.insertAdjacentHTML("beforeend", template);
      }
    );
  }

  showClientAccounts(selectedClientId: number): void {
    const accountsList: HTMLElement = this.bank.appendChild(document.createElement("ul"));
    accountsList.classList.add("accountsList");

    let template: string = ``;
    this.clients.forEach((client) => {
      if (selectedClientId === client.id) {
        client.accounts.forEach((account) => {
          template = ` <li class="account-item data-id="${account.id}">
          <p>Account: <span>${account.type}</span></p>
          <p>Creation date: <span>${account.creationDate}</span></p>
          <p>Expiration date: <span>${account.expirationDate}</span></p>
          <p>Currency: <span>${account.currency}</span></p>
          <p>Is active account: <span>${account.isActive}</span></p>
          <p>Balance: <span>${account.balance}</span></p>
          <p>Credit limit: <span>${account.creditLimit}</span></p>
          <p>Personal funds: <span>${account.personalFunds}</span></p>
          <p>Used credit funds: <span>${account.usedCreditFunds}</span></p>
          </li>`;

          accountsList.insertAdjacentHTML("beforeend", template);
        });
      }
    });
  }

  addClient(formData: FormData): IClient {
    const client: IClient = {
      id: this.clientId++,
      name: String(formData.get("name")),
      surname: String(formData.get("surname")),
      registrationDate: new Date().toDateString(),
      isActive: Boolean(formData.get("isActive")),
      accounts: [],
    };

    this.clients.push(client);

    this.render();

    return client;
  }

  findClient(id: number): IClient {
    return this.clients.find((client) => client.id === id);
  }

  addAccount(formData: FormData): IAccount {
    const foundСlient: IClient = this.findClient(this.accountId);

    const creationDate: Date = new Date();
    const expirationDate: Date = new Date(
      creationDate.setFullYear(creationDate.getFullYear() + 3)
    );

    const account: any = {
      id: this.accountId++,
      type: formData.get("type"),
      currency: String(formData.get("currency")),
      isActive: true,
      creationDate: new Date().toDateString(),
      expirationDate: expirationDate.toDateString(),
      balance: 0,
      creditLimit: 0,
      usedCreditFunds: 0,
      personalFunds: 0,
    };

    if (account.type === "debit") {
      account.balance = Number(formData.get("balance"));
      account.personalFunds = account.balance;
    }

    if (account.type === "credit") {
      account.creditLimit = Number(formData.get("creditLimit"));
      account.balance = Number(formData.get("balance")) + account.creditLimit;
      account.personalFunds = account.balance - account.creditLimit;
    }

    foundСlient.accounts.push(account);

    return account;
  }

  convertsСurrency(rates: IExchangeRates[], initial: string, final: string, amount: number): number {
    let initialСгrrency: IExchangeRates;
    let finalСгrrency: IExchangeRates;
    let res: number = 0;

    for (let rate of rates) {
      if (rate.ccy === initial) {
        initialСгrrency = rate;
      }
      if (rate.ccy === final) {
        finalСгrrency = rate;
      }
    }

    if (initial === final) {
      return amount;
    }

    if (initial === "UAH") {
      res = amount / Number(finalСгrrency.buy);
    }

    if (final === "UAH") {
      res = amount * Number(initialСгrrency.buy);
    }

    rates.forEach((rate) => {
      if (finalСгrrency) {
        if (initial === rate.ccy) {
          res = (amount * Number(rate.buy)) / Number(finalСгrrency.buy);
        }
      }
    });

    return Math.round(res * 100) / 100;
  }

  async getTotalAmountFunds(finalСгrrency: string): Promise<number> {
    const currencyRates: IExchangeRates[] = await this.getExchangeRates((error: Error) => error);
    let res: number = 0;

    this.clients.forEach((client) => {
      client.accounts.forEach((account) => {
        if (account.currency === finalСгrrency) {
          res += account.balance;
        } else {
          res += this.convertsСurrency(
            currencyRates,
            account.currency,
            finalСгrrency,
            account.balance
          );
        }
      });
    });

    return Math.round(res * 100) / 100;
  }

  async getTotalAmountDebts(finalСгrrency: string): Promise<number> {
    const currencyRates: IExchangeRates[] = await this.getExchangeRates((error: Error) => error);
    let res: number = 0;

    this.clients.forEach((client) => {
      client.accounts.forEach((account) => {
        if (account.usedCreditFunds) {
          if (account.currency === finalСгrrency) {
            res += account.usedCreditFunds;
          } else {
            res += this.convertsСurrency(
              currencyRates,
              account.currency,
              finalСгrrency,
              account.usedCreditFunds
            );
          }
        }
      });
    });

    return Math.round(res * 100) / 100;
  }

  async getDebtors(isActive: boolean, finalСгrrency: string): Promise<IDebtors> {
    const currencyRates: IExchangeRates[] = await this.getExchangeRates((error: Error) => error);
    let res: IDebtors = {
      debtors: 0,
      sumDebt: 0,
    };

    for (let client of this.clients) {
      for (let account of client.accounts) {
        if (client.isActive === isActive && account.usedCreditFunds) {
          res.debtors++;
          if (account.currency === finalСгrrency) {
            res.sumDebt += account.usedCreditFunds;
          } else {
            res.sumDebt += this.convertsСurrency(
              currencyRates,
              account.currency,
              finalСгrrency,
              account.usedCreditFunds
            );
          }
        }
      }
    }
    return res;
  }

  async getExchangeRates(handleError: Function): Promise<IExchangeRates[]> {
    const privatbankApiUrl: string =
      "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";

      try {
        const data: IExchangeRates[] = await fetch(privatbankApiUrl).then((response) =>
          response.json()
        );

        return data;

      } catch (error) {   
          handleError(error)
      }
  }
}

const newBank = new Bank();