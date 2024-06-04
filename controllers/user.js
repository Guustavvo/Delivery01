//express
const express = require("express")
const user = express()

//databse
const database = require("../models/dbConnection")

//handlebars
const expressHandlebars = require("express-handlebars")
user.engine("handlebars", expressHandlebars.engine())
user.set("view engine", "handlebars")

//insert user 
user.post("/Insert/User", function(req, res){
    const {nome, email, senha, telefone, senhaConfirmar} = req.body
    
    if(senha == senhaConfirmar){
        database.run(`insert into user (nome, email, senha, telefone, token) 
        values("${nome}", "${email}", "${senha}", "${telefone}", "${Math.random()}")`, function(erro){
            if(erro){
                console.log("erro ao criar user: " + erro)
            }
            else{
                res.redirect("/login")
            }
        })
    }
})

//select user perfil
user.get("/minhaConta/:token", function(req, res){
    
    database.all(`select * from user where token = "${req.params.token}"`, function(erro, user){
        if(erro){
            console.log(erro)
        }
        else{
            res.render("minhaConta", {user})
        }
    })
})

//login user
user.post("/Logar/conta", function(req, res){
    const {email, senha} = req.body

    database.all(`select * from user where email = "${email}" and pass = "${senha}"`, function(erro, user){
        if(erro){
            console.log("erro ao fazer login: " + erro)
        }
        else if(user.length == 1){
            res.redirect(`/${user[0].token}`)
        }
        else{
            res.redirect("/login")
        }
    })
})

//att user
user.post("/att/User/:token", function(req, res){

    const {nome, telefone, email, senha, senhaConfirmar} = req.body

    if(senha == senhaConfirmar){
        database.run(`update user set 
             nome = "${nome}", telefone = "${telefone}", email = "${email}", senha = "${senha}"
             where token = "${req.params.token}"`, function(erro){
        if(erro){
            console.log(erro)
        }
        else{
            res.redirect(`/minhaconta/${req.params.token}`)
        }
    })
    }

})

//index User
user.get("/:token", function(req, res){
    database.all(`select * from user where token = "${req.params.token}"`, function(erro, user){
        if(erro){
            console.log(erro)
        }
        else{
            database.all(`select * from infoDelivery`, function(erro, infoDelivery){
                if(erro){
                    console.log(erro)
                }
                else{
                    res.render("indexUser", {user, infoDelivery})
                }
            })
        }
    })
})

//categoria user
user.get("/categorias/:token", function(req, res){

    database.all(`select * from user where token = "${req.params.token}"`, function(erro, user){
        if(erro){
            console.log(erro)
        }
        else{
            database.all(`select * from categoria`, function(erro, categoria){
                if(erro){
                    console.log(erro)
                }
                else{
                    res.render("categorias_user", {user, categoria})
                }
            })
        }
    })
})

//produtos user
user.get("/produtos/:categoriaproduto/:token", function(req, res){
    database.all(`select * from user where token = "${req.params.token}"`, function(erro, user){
        if(erro){
            console.log(erro)
        }
        else{
            database.all(`select * from produto 
            where categoria = "${req.params.categoriaproduto}"`, function(erro, produto){
                if(erro){
                    console.log(erro)
                }
                else{
                    res.render("produtoUser", {user, produto})
                }
            })
        }
    })
})

//info user
user.get("/info/:token", function(req, res){
    database.all(`select * from user where token = "${req.params.token}"`, function(erro, user){
        if(erro){
            console.log(erro)
        }
        else{
            res.render("infoUser", {user})
        }
    })
})

//det_produto
user.get("/det_produto/:token/:idProduto", function(req, res){
    database.all(`select * from user where token = "${req.params.token}"`, function(erro, user){
        if(erro){
            console.log(erro)
        }
        else{
            
            database.all(`select * from produto where id = "${req.params.idProduto}"`, function(erro, produto){
                if(erro){
                    console.log(erro)
                }
                else{
                    res.render("det_produtoUser", {user, produto})
                }
            })

        }
    })
})

//meus pedidos
user.get("/Meus/:tokenUser", function(req, res){
    database.all(`select * from pedido where token_user = "${req.params.tokenUser}" order by token_pedido desc`, function(erro, pedido){
        if(erro){
            console.log(pedido)
        }
        else{
            database.all(`select * from user where token = "${req.params.tokenUser}"`, function(erro, user){
                if(erro){
                        console.log(erro)
                }
                else{
                    res.render("meusPedidos", {pedido, user})
                }
            })
            
        }
    })
})
module.exports = user