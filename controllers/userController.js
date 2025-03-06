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
                return;
            }

            this.getPhoto().then(content => {
                values.photo = content || "dist/img/default-user.png"; 
                this.addLine(values);
              
                this.formEl.reset();
                if (btn) btn.disabled = false; 

            }).catch(error => {
                console.error("Erro ao carregar a foto:", error);
                values.photo = "dist/img/boxed-bg.jpg"; 
                this.addLine(values);
                if (btn) btn.disabled = false;
            });
        });
    }

    getPhoto() {
        return new Promise((resolve, reject) => {
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

        [...this.formEl.elements].forEach(field => {
            if (!field.name) return;

            if (field.type === "radio" && !field.checked) return;

            if (field.type === "checkbox") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }

    addLine(dataUser) {
        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
            </td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${dataUser.register || new Date().toLocaleDateString()}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.tableEl.appendChild(tr);
    }
}
