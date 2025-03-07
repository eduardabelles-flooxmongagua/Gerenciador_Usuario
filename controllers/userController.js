class UserController {
    constructor(formId, formUpdateId, tableId) {
        this.formEl = document.getElementById(formId);
        this.formUpdateEl = document.getElementById(formUpdateId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    onEdit() {
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event => {
            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");
            if (btn) btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);
            if (!values) {
                if (btn) btn.disabled = false;
                return;
            }

            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            let userOld = JSON.parse(tr.dataset.user);
            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then((content) => {
                result.photo = content !== "dist/img/boxed-bg.jpg" ? content : userOld.photo;

                if (tr) {
                    tr.dataset.user = JSON.stringify(result);
                    tr.innerHTML = `
                        <td><img src="${result.photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${result.name}</td>
                        <td>${result.email}</td>
                        <td>${result.admin ? "Sim" : "Não"}</td>
                        <td>${Utils.dateFormat(result.register)}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
                        </td>
                    `;
                    this.addEventsTR(tr);
                    this.showPanelCreate();
                }

                this.formUpdateEl.reset();
                if (btn) btn.disabled = false;

                this.updateCount();
            });
        });
    }

    onSubmit() {
        this.formEl.addEventListener("submit", event => {
            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");
            if (btn) btn.disabled = true;

            let values = this.getValues(this.formEl);
            if (!values) {
                if (btn) btn.disabled = false;
                return;
            }

            this.getPhoto(this.formEl).then(content => {
                values.photo = content || "dist/img/default-user.png";
                values.register = new Date();

                this.insert(values);
                this.addLine(values);

                this.formEl.reset();
                if (btn) btn.disabled = false;
            }).catch(error => {
                console.error("Erro ao carregar a foto:", error);
                values.photo = "dist/img/boxed-bg.jpg";
                values.register = new Date();

                this.insert(values);
                this.addLine(values);

                if (btn) btn.disabled = false;
            });
        });
    }

    getPhoto(formEl) {
        return new Promise((resolve, reject) => {
            let fileInput = formEl.querySelector("[name=photo]");
            let file = fileInput?.files[0];

            if (!file) {
                resolve("dist/img/boxed-bg.jpg");
                return;
            }

            let reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => {
                console.error("Erro ao ler o arquivo de imagem.");
                reject("dist/img/boxed-bg.jpg");
            };

            reader.readAsDataURL(file);
        });
    }

    getValues(formEl) {
        let user = {};
        let isValid = true;

        [...formEl.elements].forEach(field => {
            if (['name', 'email', 'password'].includes(field.name) && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            } else {
                field.parentElement.classList.remove('has-error');
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
            photo: user.photo || "dist/img/boxed-bg.jpg",
            admin: user.admin,
            register: new Date()
        };
    }

    selectAll() {
        let users = this.getUsersStorage();
        users.forEach(dataUser => {
            this.addLine(dataUser);
        });
    }

    insert(data) {
        let users = [];
        if (sessionStorage.getItem("users")) {
            users = JSON.parse(sessionStorage.getItem("users"));
        }
        users.push(data);
        sessionStorage.setItem("users", JSON.stringify(users));
    }

    getUsersStorage() {
        return sessionStorage.getItem("users") ? JSON.parse(sessionStorage.getItem("users")) : [];
    }

    addLine(dataUser) {
        let tr = document.createElement("tr");

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat btn-delete">Excluir</button>
            </td>
        `;

        this.addEventsTR(tr);
        this.tableEl.appendChild(tr);
        this.updateCount();
    }

    addEventsTR(tr) {
        tr.querySelector(".btn-delete").addEventListener("click", e => {
            if (confirm("Deseja realmente excluir?")) {
                tr.remove();
                this.updateCount();
            }
        });

        tr.querySelector(".btn-edit").addEventListener("click", e => {
            let json = JSON.parse(tr.dataset.user);
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {
                    switch (field.type) {
                        case "file":
                            continue;
                        case "radio":
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case "checkbox":
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                }
            }

            let imgEl = this.formUpdateEl.querySelector(".photo");
            if (imgEl) {
                imgEl.src = json.photo;
            }

            this.showPanelUpdate();
        });
    }

    showPanelCreate() {
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    }

    showPanelUpdate() {
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
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
