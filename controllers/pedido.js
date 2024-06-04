//express
const express = require("express")
const pedido = express()

//database
const database = require("../models/dbConnection")

//handlebars
const expressHandlebars = require("express-handlebars")
pedido.engine("handlebars", expressHandlebars.engine())
pedido.set("view engine", "handlebars")

//insert pedido
pedido.post("/CriarPedido/:token_user/:idProduto", function(req, res){    
    
    const data = new Date()
    const dataFormatada = data.getDate() + "/0" + (data.getMonth() + 1) + "/" + data.getFullYear()


    database.all(`select * from pedido where token_user = "${req.params.token_user}" 
    and status = "Em aberto"`, function(erro, pedido){
        if(erro){
            console.log(erro)
        }
        else if(pedido.length == 1){
            database.all(`select * from produto where id = "${req.params.idProduto}"`, function(erro, produto){
                if(erro){
                    console.log(erro)
                }
                else{
                    const valorFinal = req.body.quantidade * produto[0].preco

                    database.run(`insert into pedido_detalhes 
                    (token_pedido, token_user, nome_produto, preco_produto, quantidade_produto, valorFinal, id_produto, imagem_produto)
                    values("${pedido[0].token_pedido}", "${req.params.token_user}", 
                    "${produto[0].nome}", "${produto[0].preco}", "${req.body.quantidade}", 
                    "${valorFinal}", "${produto[0].id}", "${produto[0].imagem}")`, function(erro){
                        if(erro){
                            console.log("erro ao add pedido detalhe: " + erro)
                        }
                        else{
                            res.redirect(`/Meus/${req.params.token_user}`)
                        }
                    })
                }
            })
        }
        else{
            database.all(`select * from produto where id = "${req.params.idProduto}"`, function(erro, produto){
                if(erro){
    
                }
                else{
                    const valorFinal = req.body.quantidade * produto[0].preco
    
                    database.all(`select * from user where token = "${req.params.token_user}"`, function(erro, user){
                        if(erro){
                            console.log(erro)
                        }
                        else{
    
    
                            database.run("insert into numPedidos (criado) values('S')", function(erro){
                                if(erro){
                                    console.log()
                                }
                                else{
                                    database.all(`select * from numPedidos order by num desc`, function(erro, numPedidos){
                                        if(erro){
                                            console.log(erro)
                                        }
                                        else{
                                            database.run(`insert into pedido_detalhes 
                                            (token_pedido, token_user, nome_produto, preco_produto, quantidade_produto, valorFinal, id_produto, imagem_produto)
                                            values("${numPedidos[0].num}", "${user[0].token}", "${produto[0].nome}", 
                                            "${produto[0].preco}", "${req.body.quantidade}", "${valorFinal}", "${produto[0].id}", "${produto[0].imagem}")`, function(erro){
                                            if(erro){
                                                console.log(erro)
                                            }
                                            else{
                                                database.run(`insert into pedido(dataReal, status, token_user, token_pedido)
                                                values("${dataFormatada}", "Em aberto", "${user[0].token}", "${numPedidos[0].num}")`, function(erro){
                                                    if(erro){
                                                        console.log(erro)
                                                    }
                                                    else{
                                                    res.redirect(`/Meus/${user[0].token}`)
                                                    }
                                                })
                                            }
                                        })
                                        }
                                    })
                                }
                            })
                        }
                    })
    
                }
        })
        }
        
    })

    

})

// Finalizar Ver mais
pedido.get("/ver/finalizar/:token_pedido/:token_user", function(req, res){
    database.all(`select * from user where token = "${req.params.token_user}"`, function(erro, user){
        if(erro){
            console.log(erro)
        }
        else{
            database.all(`select * from pedido_detalhes 
            where token_pedido = "${req.params.token_pedido}" 
            and token_user = "${req.params.token_user}"`, function(erro, pedido_detalhes){
                if(erro){
                    console.log(erro)
                }
                else{
                    database.all(`select * from pedido where token_user = "${req.params.token_user}" 
                    and token_pedido = "${req.params.token_pedido}"`, function(erro, pedido){
                        if(erro){
                            console.log(erro)
                        }   
                        else{
                            const token_pedido = req.params.token_pedido
                            res.render("det_pedido", {user, pedido_detalhes, token_pedido, pedido})
                        }
                    })
                }
            })
        }
    })
})

//excluir pedido -> geral
pedido.get("/del/:token_pedido", function(req, res){
    database.all(`select * from pedido`, function(erro, pedido){
        if(erro){
            console.log(erro)
        }
        else{
            database.run(`delete from pedido_detalhes where token_pedido = "${req.params.token_pedido}"`, 
            function(erro){
                if(erro){
                    console.log(erro)
                }
                else{
                    database.run(`delete from pedido where token_pedido = "${req.params.token_pedido}"`, 
                    function(erro){
                        if(erro){
                            console.log(erro)
                        }
                        else{
                            res.redirect(`/Meus/${pedido[0].token_user}`)
                        }
                    })
                }
            })
        }
    })
})

//pedido finalizar
pedido.get("/finalizar/pedido/:tokenPedido/:tokenUser", function(req, res){ 
    
    database.all(`select * from pedido where token_user = 
    "${req.params.tokenUser}" and token_pedido = "${req.params.tokenPedido}"`, function(erro, pedido){
        if(erro){
            console.log(erro)
        }
        else{
            database.all(`select * from user where token = "${req.params.tokenUser}"`, function(erro, user){
                if(erro){
                    console.log(erro)
                }
                else{
                    database.all(`select * from pedido_detalhes where token_user = 
                    "${req.params.tokenUser}" and token_pedido = "${req.params.tokenPedido}"`, 
                    function(erro, pedido_detalhes){
                        if(erro){
                            console.log(erro)
                        }   
                        else{
                            let total = 0
                            for(let i = 0; i < pedido_detalhes.length; i = i + 1){
                                total = total + pedido_detalhes[i].valorFinal 
                            }
                            //total = total + taxa
                            res.render(`finalizar`, {pedido, user, total})
                        }
                    })
                }
            })
        }
    })

})

//finalizar
pedido.post("/finalizar/:token_user/:token_pedido", function(req, res){
        const {cidade, endereco, numero, pagamento, complemento, troco, total} = req.body

    database.run(`update pedido set cidade = "${cidade}", endereco = "${endereco}", complemento = "${complemento}",
    numero = "${numero}", pagamento = "${pagamento}", status = "${'Processando'}", 
    troco = "${troco}", totalAbsoluto = "${total}"`, function(erro){
        if(erro){
            console.log(erro)
        }
        else{
           res.redirect(`/filanizado/pedido/${req.params.token_user}`)
        }
    })

})

//tela finalizado
pedido.get("/filanizado/pedido/:token_user", function(req, res){
    database.all(`select * from user where token = "${req.params.token_user}"`, function(erro, user){
        if(erro){
            console.log(erro)
        }
        else{
            res.render("finalizado", {user})
        }
    })
})

module.exports = pedido