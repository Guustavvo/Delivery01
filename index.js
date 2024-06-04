//express
const express = require("express")
const app = express()

//porta servidor
const porta = process.env.PORT || 8080
app.listen(porta, function(){
    console.log(`http://localhost:${porta}`)
})

//path
const path = require("path")
app.use(express.static(path.join(__dirname + "/")))

//body-parser
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: false}))

//database
require("./models/dbConnection")

//routes
const routes = require("./routes/routes")
app.get("/", routes)
app.get("/categorias", routes)
app.get("/produtos/:categoria", routes)
app.get("/det_produto/:idProduto", routes)
app.get("/login", routes)
app.get("/criarConta", routes)
app.get("/info", routes)
app.get("/loginAdmin", routes)


//user
const user = require("./controllers/user")
app.post("/Insert/User", user)
app.get("/minhaConta/:idUser", user)
app.post("/Logar/conta", user)
app.post("/att/User/:idUsER", user)
app.get("/:IdUser", user)
app.get("/categorias/:idUser", user)
app.get("/info/:idUser", user)
app.get("/meusPedidos/:idUser", user)
app.get("/produtos/:categoriaproduto/:idUser", user)
app.get("/det_produto/:idUser/:idProduto", user)
app.get("/Meus/:tokenUser", user)

//pedido
const pedido = require("./controllers/pedido")
app.post("/CriarPedido/:token_user/:idProduto", pedido)
app.get("/ver/finalizar/:token_pedido/:token_user", pedido)
app.get("/del/:token_pedido", pedido)
app.get("/finalizar/pedido/:tokenPedido/:tokenUser", pedido)
app.post("/finalizar/:token_user/:token_pedido", pedido)
app.get("/filanizado/pedido/:token_user", pedido)

//admin
const admin = require("./controllers/admin")
app.get("/admin/delivery/entrar", admin)
app.post("/log", admin)
app.get("/menu/:login/:senha", admin)
app.get("/infoDelivery/:login/:senha", admin)
app.post("/Att/:login/:senha", admin)
app.get("/getMin/:login/:senha", admin)
app.post("/update/credAdmin/:login/:senha",admin)


//categoria
const categoria = require("./controllers/categorias")
app.get("/cad/categoria/:loginUser/:senhaUser", categoria)
app.post("/cad/categoria/:loginUser/:senhaUser", categoria)
app.get("/ver/categoria/:loginUser/:senhaUser", categoria)
app.get("/del/:idcategoria/qukeie/:loginUser/:senhaUser", categoria)

//bkp a cada 10min
setInterval(function(){
    require("./controllers/bkp")
}, 43200000)