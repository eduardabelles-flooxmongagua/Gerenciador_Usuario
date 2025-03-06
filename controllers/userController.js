class UserController {
    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
    }

    onSubmit() {
        this.formEl.addEventListener("submit", event => {
            event.preventDefault();
                 
            let btn = this.formEl.querySelector("[type=submit]");
            if (btn) btn.disabled = true;

            let values = this.getValues();
            
            if (!values) {
                if (btn) btn.disabled = false;
                return false;
            }

            this.getPhoto().then(content => {
                values.photo = content || "dist/img/default-user.png"; 
                values.register = new Date(); 

                console.log("Valores antes de adicionar à lista:", values);

                this.addLine(values);
              
                this.formEl.reset();
                if (btn) btn.disabled = false;
            }).catch(error => {
                console.error("Erro ao carregar a foto:", error);
                values.photo = "dist/img/boxed-bg.jpg"; 
                values.register = new Date();

                this.addLine(values);
                if (btn) btn.disabled = false;
            });
        });
    }

    getPhoto() {
        return new Promise((resolve) => {
            let fileInput = this.formEl.querySelector("[name=photo]");
            let file = fileInput?.files[0];

            if (!file) {
                resolve("dist/img/boxed-bg.jpg"); 
                return;
            }

            let reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = () => {
                console.error("Erro ao ler o arquivo de imagem.");
                resolve('dist/img/boxed-bg.jpg'); 
            };

            reader.readAsDataURL(file);
        });
    }

    getValues() {
        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach(field => {
            if (['name', 'email', 'password'].indexOf(field.name) > -1) {
                if (!field.value) {
                    field.parentElement.classList.add('has-error');
                    isValid = false;
                } else {
                    field.parentElement.classList.remove('has-error');
                }
            }

            if (!field.name) return;
            if (field.type === "radio" && !field.checked) return;

            if (field.type === "checkbox") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (!isValid) return false;

        return {
            name: user.name,
            gender: user.gender,
            birth: user.birth,
            country: user.country,
            email: user.email,
            password: user.password,
            photo: user.photo,
            admin: user.admin,
            register: new Date()
        };
    }

    addLine(dataUser) {
        let tr = document.createElement("tr");
        tr.dataset.user = JSON.stringify(dataUser);
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.tableEl.appendChild(tr);
        this.updateCount();
    }

    updateCount() {
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            if (user.admin) numberAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }
}


