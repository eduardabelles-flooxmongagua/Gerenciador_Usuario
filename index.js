
//Example
//var nome = document.querySelector("#exampleInputName"); 
//nome.value = "Name"; 
//nome.style.color = "blue"; 

//Manipulation DOM
var name = document.querySelector("#exampleInputName");
var gender = document.querySelectorAll("#form-user-create[name-gender]:checked"); 
var birth = document.querySelector("#exampleInputBirth");
var country = document.querySelector("#exampleInputCountry");  
var email = document.querySelector("#exampleInputEmail"); 
var passaword = document.querySelector("#exampleInputPassaword"); 
var photo = document.querySelector("#exampleInputFile"); 
var admin = document.querySelector("#exampleInputAdmin");

var fields = document.querySelectorAll("#form-user-create [name]"); 

fields.forEach(function(field, index) { 
    console.log(field.id,field.name,field.value,field.ariaChecked, index); 
});
