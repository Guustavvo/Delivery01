//btnCad
const bntCad = document.querySelector("#btnCad")

bntCad.addEventListener("click", function(evento){

    const nome = document.querySelector("#nome")
    const email = document.querySelector("#email")
    const senha = document.querySelector("#senha")
    const senhaConfirmar = document.querySelector("#senhaConfirmar")

    if(nome.value.length < 3){
        evento.preventDefault()
        alert("nome pequeno")
    }
    else if(email.value.length < 7){
        evento.preventDefault()
        alert("email pequeno")
    }
    else if(senha.value.length < 6){
        evento.preventDefault()
        alert("senha pequena")
    }
    else if(senha.value != senhaConfirmar.value){
        evento.preventDefault()
        alert("senhas diff")
    }

})