interface IEmployee {
    id: number;
    name: string;
    surname: string;
    departmentId: number;
    position: string;
    salary: number;
    isFired: boolean;
  }
  
  interface IDepartment {
    id: number;
    title: string;
    employees: IEmployee[];
  }
  
  interface IPosition {
    id: number;
    title: string;
  }
  
  interface IRestaurant {
    departments: IDepartment[];
    positions: IPosition[];
    restaurant: HTMLElement;
    id: number;
    oldEmployeeId: number;
  
    render(): void;
    showForm(templateEmployee?: string): void;
    showEmployeesList(employeesList: HTMLElement): void;
    handleSubmitForm(form: HTMLElement, event: Event): void;
    handleSubmitEditForm(editForm: HTMLElement, event: Event): void;
    handleClick(event: Event): void;
    addOptionsToSelect(data: any): string;
    addDepartment(id: number, title: string): IDepartment;
    addPosition(id: number, title: string): IPosition;
    findDepartment(id: number): IDepartment;
    findPosition(id: number): string;
    addEmployee(formData: FormData): void;
    getSumSalary(departmentId: number): number;
    getMeanSalary(departmentId: number): number;
    getExtremumSalary(departmentId: number, positionId: number, extremum: 'min' | 'max'): number;
    getFiredEmployees(): number;
    getDepartmentsWithoutPosition(positionId: number): string[];
    editsEmployee(employee: IEmployee): void
  }
  
  class Restaurant implements IRestaurant {
    departments: IDepartment[];
    positions: IPosition[];
    restaurant: HTMLElement;
    id: number;
    oldEmployeeId: number;
  
    constructor(departments?: IDepartment[], positions?: IPosition[]) {
      this.departments = departments || [];
      this.positions = positions || [];
      this.restaurant = document.querySelector(".restaurant");
      this.id = 4;
      this.oldEmployeeId;
      this.render();
    }
  
    render(): void {
      this.showForm();
  
      document
        .querySelector(".departmentSelect")
        .insertAdjacentHTML("beforeend", this.addOptionsToSelect(this.departments));
  
      document
        .querySelector(".positionSelect")
        .insertAdjacentHTML("beforeend", this.addOptionsToSelect(this.positions));
  
      if (document.querySelector("ul")) {
        document.querySelector("ul").remove();
      }
  
      const employeesList: HTMLElement = this.restaurant.appendChild(
        document.createElement("ul")
      );
  
      let form: HTMLElement = document.querySelector(".form");
  
      form.addEventListener("submit", this.handleSubmitForm.bind(this, form));
  
      employeesList.addEventListener("click", this.handleClick);
  
      this.showEmployeesList(employeesList);
    }
  
    handleSubmitForm(form: HTMLElement, event: Event): void {
      event.preventDefault();
      let formData: FormData = new FormData(form as HTMLFormElement);
      this.addEmployee(formData);
  
      form.remove();
    }
  
    handleSubmitEditForm(editForm: HTMLElement, event: Event): void {
      event.preventDefault();
  
      let formData: FormData = new FormData(editForm as HTMLFormElement);
  
      this.addEmployee(formData);
  
      if (document.querySelector(".form")) {
        document.querySelector(".form").remove();
      }
  
      editForm.remove();
  
      this.departments.forEach((department) => {
        department.employees.forEach((employee, indexEmployee, arr) => {
          if (employee.id === this.oldEmployeeId) {
            arr.splice(indexEmployee, 1);
          }
        });
      });
  
      this.render();
    }
  
    handleClick(event: Event): void {
      event.preventDefault();
  
      if ((event.target as HTMLElement).nodeName !== "BUTTON") {
        return;
      }
  
      let selectedEmployeeId: number = Number((event.target as HTMLElement).closest("li").dataset.id);
  
      if ((event.target as HTMLElement).dataset.action === "delete") {
        this.departments.forEach((department) => {
          department.employees.forEach((employee, indexEmployee, arr) => {
            if (employee.id === selectedEmployeeId) {
              arr.splice(indexEmployee, 1);
            }
          });
        });
        (event.target as HTMLElement).closest("li").remove();
      }
  
      if ((event.target as HTMLElement).dataset.action === "edit") {
        this.departments.forEach((department) => {
          department.employees.forEach((employee) => {
            if (employee.id === selectedEmployeeId) {
              if (document.querySelector(".form")) {
                document.querySelector(".form").remove();
              }
  
              newRestaurant.editsEmployee(employee);
            }
          });
        });
      }
    }
  
    addOptionsToSelect(data: any): string {
      let template: string = "";
  
      for (let item of data) {
        template += `<option value="${item.id}">${item.title}</option>`;
      }
  
      return template;
    }
  
    addDepartment(id: number, title: string): IDepartment {
      const department: IDepartment = { id, title, employees: [] };
      this.departments.push(department);
  
      return department;
    }
  
    addPosition(id: number, title: string): IPosition {
      const position: IPosition = { id, title };
      this.positions.push(position);
  
      return position;
    }
  
    findDepartment(id: number): IDepartment {
      return this.departments.find((department) => department.id === id);
    }
  
    findPosition(id: number): string {
      for (let position of this.positions) {
        if (position.id === id) {
          return position.title;
        }
      }
    }
  
    addEmployee(formData: FormData): void {
      let departmentId: number = Number(formData.get("department"));
      let positionId: number = Number(formData.get("position"));
  
      const employee: any = {
        id: this.id++,
        name: formData.get("name"),
        surname: formData.get("surname"),
        departmentId: departmentId,
        position: this.findPosition(positionId),
        salary: Number(formData.get("salary")),
        isFired: Boolean(formData.get("isFired")),
      };
  
      const selectedDepartment: IDepartment = this.findDepartment(departmentId);
  
      selectedDepartment.employees.push(employee);
  
      this.render();
    }
  
    getSumSalary(departmentId: number): number {
      let res: number = 0;
      for (let department of this.departments) {
        if (department.id === departmentId) {
          for (let employee of department.employees) {
            if (!employee.isFired) {
              res += employee.salary;
            }
          }
        }
      }
      return res;
    }
  
    getMeanSalary(departmentId: number): number {
      let res: number = 0;
      let counter: number = 0;
      for (let department of this.departments) {
        if (department.id === departmentId) {
          for (let employee of department.employees) {
            if (!employee.isFired) {
              res += employee.salary;
              counter++;
            }
          }
        }
      }
      return Math.round(res / counter);
    }
  
    getExtremumSalary(departmentId: number, positionId :number, extremum: 'min' | 'max'): number {
      let res: number[] = [];
  
      for (let department of this.departments) {
        if (department.id === departmentId) {
          for (let employee of department.employees) {
            if (
              !employee.isFired &&
              employee.position === this.findPosition(positionId)
            ) {
              res.push(employee.salary);
            }
          }
        }
      }
  
      if (extremum === "min") {
        return Math.min(...res);
      }
  
      if (extremum === "max") {
        return Math.max(...res);
      }
    }
  
    getFiredEmployees(): number {
      let res: number = 0;
  
      for (let department of this.departments) {
        for (let employee of department.employees) {
          if (employee.isFired) {
            res++;
          }
        }
      }
  
      return res;
    }
  
    getDepartmentsWithoutPosition(positionId: number): string[] {
      let res: string[] = [];
  
      for (let department of this.departments) {
        let counter: number = 0;
  
        for (let employee of department.employees) {
          if (
            !employee.isFired &&
            employee.position === this.findPosition(positionId)
          ) {
            counter++;
          }
        }
        if (counter === 0) {
          res.push(department.title);
        }
      }
  
      return res;
    }
  
    editsEmployee(employee: IEmployee): void {
      const selectedDepartment: IDepartment = this.findDepartment(employee.departmentId);
  
      this.oldEmployeeId = employee.id;
  
      let selectedPosition: number;
  
      for (let position of this.positions) {
        if (position.title === employee.position) {
          selectedPosition = position.id;
        }
      }
  
      let templateEmployee: string = `<form class="editForm">
     <label>
     Department
     <select name="department" class="departmentSelect")>
     <option value="${employee.departmentId}">${selectedDepartment.title}</option>
     </select>
     </label>
     <label>
     Name
     <input type="text" name="name" value="${employee.name}"/>
     </label>
     <label>
       Surname
       <input type="text" name="surname" value="${employee.surname}"/>
       </label>
     <label>
     Position
     <select name="position" class="positionSelect">
       <option value="${selectedPosition}">${employee.position}</option>
       </select>
       </label>
       <label>
       Salary
       <input type="text" name="salary" value="${employee.salary}"/>
       </label>
       <label>
       isFired
       <select name="isFired">
       <option value="${employee.isFired}" disabled>${employee.isFired}</option>
       <option value="false">false</option>
          <option value="true">true</option>
       </select>
     </label>
     <button type="submit">Edit</button>
     </form>`;
  
      newRestaurant.showForm(templateEmployee);
  
      document
        .querySelector(".departmentSelect")
        .insertAdjacentHTML("beforeend", this.addOptionsToSelect(this.departments));
  
      document
        .querySelector(".positionSelect")
        .insertAdjacentHTML("beforeend", this.addOptionsToSelect(this.positions));
  
      let editForm: HTMLElement = document.querySelector(".editForm");
      editForm.addEventListener(
        "submit",
        this.handleSubmitEditForm.bind(this, editForm)
      );
    }
  
    showForm(templateEmployee?: string): void {
      let template: string = ``;
      if (templateEmployee) {
        template = templateEmployee;
      } else {
        template = `<form class="form">
        <label>
        Department
        <select name="department" class="departmentSelect")>
        <option></option>
        </select>
        </label>
        <label>
        Name
        <input type="text" name="name" />
        </label>
        <label>
          Surname
          <input type="text" name="surname" />
          </label>
        <label>
        Position
        <select name="position" class="positionSelect">
          <option></option>
          </select>
          </label>
          <label>
          Salary
          <input type="text" name="salary" />
          </label>
          <label>
          isFired
          <select name="isFired">
          <option></option>
          <option value="false">false</option>
          <option value="true">true</option>
          </select>
        </label>
        <button type="submit">Add</button>
        </form>`;
      }
  
      this.restaurant.insertAdjacentHTML("afterbegin", template);
    }
  
    showEmployeesList(employeesList: HTMLElement): void {
      this.departments.forEach((department) => {
        department.employees.forEach(
          ({ id, name, surname, departmentId, position, salary, isFired }) => {
            const template: string = `<li class="employee-item" data-id=${id} data-department=${departmentId}>
                <span>Department: <span>${department.title}</span> |</span>
                <span>Name: <span>${name}</span> |</span>
                <span>Surname: <span>${surname}</span> |</span>
                <span>Position: <span>${position}</span> |</span>
                <span>Salary: <span>${salary}</span> |</span>
                <span>isFired: <span>${isFired}</span> |</span>
                <button type="button" data-action="edit">edit</button>
                <button type="button" data-action="delete">delete</button>
                </li>`;
            employeesList.insertAdjacentHTML("beforeend", template);
          }
        );
      });
    }
  }
  
  const newRestaurant = new Restaurant ();
  