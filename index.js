document.getElementById("form-user-create").addEventListener("submit", function(event) {
    event.preventDefault();

    function addLine(dataUser) {
        var tr = document.createElement("tr");
    
        tr.innerHTML = `
            <td>
                <img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm">
            </td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
    
       
        document.querySelector("#table-users").appendChild(tr);
        
        document.querySelector("#table-users tbody").appendChild(tr);
    }
    

    var fields = document.querySelectorAll("#form-user-create [name]"); // Corrigido
    var user = {};

    fields.forEach(function(field) {
        if (field.name === "gender") {
            if (field.checked) {
                user[field.name] = field.value;
            }
        } else {
            user[field.name] = field.value;
        }
    });

    console.log(user);

   
    addLine(user);
});

