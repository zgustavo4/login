const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")
const porta = 3000
const app = express()
const crypto = require('crypto');

const pool = require("./db.js")

// acessar dados do body
app.use(express.json())
app.use(cors())

// servidor
app.listen(porta, () => {
  console.log(`Servidor rodando em: http://localhost:${porta}`)
})

//rota
app.post("/cadastro", async(req,res)=>{
    try {
        const { nome, email} = req.body
        let { senha } = req.body

        // senha = senha.trim()

        if (senha == "") {
            return res.json({"resposta":"Preencha uma senha"})
        }
        else if (senha.length < 6) {
            return res.json({"resposta":"A senha tem que conter no minimo 6 caracteres"})
        }
        else if (email == "") {
            return res.json({"resposta":"Digite um email valido"})
        }
        else if (email.length < 6) {
            return res.json({"resposta":"Digite um email valido"})
        }
        else if (nome == "") {
            return res.json({"resposta":"Digite um nome"})
        }
        //verificar email já cadastrado

        let sql = `SELECT * FROM cadastro WHERE email = ?`
        let [resultado] = await pool.query(sql, [email])
        if (resultado.length != 0) {
            return res.json({ "resposta": "email ja cadastrado" })
        }

        const hash = crypto.createHash("sha256").update(senha).digest("hex")

        sql = `insert into cadastro (nome, email, senha) values (?,?,?)`
        let [resultado2] = await pool.query(sql, [nome, email, hash])

        if (resultado2.affectedRows == 1) {
            return res.json({ "resposta": "cadastro efetuado com sucesso!" })
        } else {
            return res.json({ "resposta": "erro ao fazer cadastro!" })
        }

    } catch (error) {
        console.log(error)
    }

    //LOGIN
    app.post("/login", async(req,res)=>{
        try {
            const{email, senha} = req.body
        //if e else
    
    
    
      if (email == "") {
          return res.json({"resposta":"Digite um email valido"})
      }
      else if (email.length < 6) {
          return res.json({"resposta":"Digite um email valido"})
      }
      else if (senha == "") {
          return res.json({"resposta":"Digite uma senha valida"})
      }
    
    //verificar
    
    let sql = "SELECT * FROM cadastro WHERE email = ? AND senha = ?"
        let [resultado] = await pool.query(sql, [email, senha]);
    
        if (resultado.length > 0) {
          // Login correto
          sql = "INSERT INTO login (email, senha) VALUES (?, ?)"
        await pool.query(sql, [email,senha]);
          return res.json({
            resposta: "login efetuado",
            usuario: resultado[0]
            
          })
    
        } else {
          // Email ou senha errados
          return res.json({ resposta: "cadastro não encontrado" });
        }
    } catch (error) {
          console.log(`o erro é: ${error}`)
    }
})})

// rotas
app.post("/faleConosco", async (req, res) => {
  try {
    const { nome, email, telefone, assunto, mensagem} = req.body

//if e else


    if (nome == "") {
        return res.json({"resposta":"Digite um nome valido"})
    }
    else if (email == "") {
        return res.json({"resposta":"Digite um email valido"})
    }
    else if (email.length < 6) {
        return res.json({"resposta":"Digite um email valido"})
    }
    else if (assunto == "") {
        return res.json({"resposta":"Digite um assunto"})
    }
    else if (mensagem == "") {
        return res.json({"resposta":"Digite uma mensagem"})
    }
//verificar

    let sql = `SELECT * FROM fale_conosco WHERE email = ?`
        let [resultado2] = await pool.query(sql, [email])
        if (resultado2.length != 0) {
            return res.json({ "resposta": "email ja usado" })
        }

//insert
    sql = (`INSERT INTO fale_conosco (nome, email, telefone, assunto, mensagem) VALUES (?,?,?,?,?)`)
        let [resultado] = await pool.query(sql, [nome, email, telefone, assunto, mensagem])
        res.json({"resposta":"enviado com sucesso"})
  } catch (error) {
        console.log(`o erro é: ${error}`)
  }
})

