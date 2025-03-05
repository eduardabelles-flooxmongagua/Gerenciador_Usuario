class UserController{
    constructor(formId, tableId){
    this.formEl=document.getElementById(formId);
    this.tabelEl=document.getElementById(tableId);
    
    this.onSubmit();
} 

    onSubmit(){

            this.formEl.addEventListener("submit", event => {
            event.preventDefault();
        
            this.addLine(this.getValues());
        
        });
    }
    getValues(){
       let user ={};
       
        [...this.formEl.elements].forEach(function(field, index) {
            if (field.name === "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else {
                user[field.name] = field.value;
            }
        });
    
        //console.log(user);
    
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
  addLine(dataUser,tableId) {
    console.log(dataUser);
 
     this.tabelEl.innerHTML= `
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
   // document.querySelector("#table-users tbody").appendChild(tr);
 }

}
    

