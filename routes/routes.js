//express
const express = require("express")
const routes = express()

//handlebars
const expressHandlebars = require("express-handlebars")
routes.engine("handlebars", expressHandlebars.engine())
routes.set("view engine", "handlebars")

//database 
const database = require("../models/dbConnection")

routes.get("/", function(req, res){
    database.all(`select * from infoDelivery`, function(erro, infoDelivery){
        res.render("index", {infoDelivery})
    })
})

routes.get("/categorias", function(req, res){
    database.all(`select * from categoria`, function(erro, categoria){
        res.render("categorias", {categoria})
    })
})

routes.get("/produtos/:categoria",function(req, res){
    database.all(`select * from produto where categoria = "${req.params.categoria}"`, function(erro, produto){
        if(erro){
            console.log(erro)
        }
        else{
            res.render("produtos", {produto})
        }
    })
})

routes.get("/det_produto/:idProduto", function(req, res){
    database.all(`select * from produto where id = "${req.params.idProduto}"`, function(erro, produto){
        if(erro){
            console.log(erro)
        }
        else{
            res.render("det_produto", {produto})
        }
    })
})

routes.get("/login", function(req, res){
    res.render("login")
})

routes.get("/criarConta", function(req, res){
    res.render("criarConta")
})

routes.get("/info", function(req, res){
    res.render("info")
})

routes.get("/loginAdmin", function(req, res){
    res.render("loginAdmin")
})

module.exports = routes