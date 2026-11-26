const loading = document.getElementById("loading-overlay");

function mostrarLoading() {
  loading.classList.remove("loading-escondido");
}

function esconderLoading() {
  loading.classList.add("loading-escondido");
}

// Variáveis REGEX
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexSenha = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
const regexNomeUsuario = /^\S{2,}$/;
const regexCodigoToken = /^\d{6}$/;
const regexWhatsapp = /^55\d{10,11}$/;

// Parte login 
let loginFormulario = document.querySelector('div.form-login');
let botaoLogin = document.querySelector('button#btn-login');
let botaoCadastro = document.querySelector('button#btn-cadastro');
let linkCliqueAqui = document.querySelector("a#clique-aqui");

// Parte esqueci a senha
let esquecerSenha = document.querySelector('div.esqueci-senha');
let botaoVoltarEsqueciSenha = document.querySelector("#botao-voltar");
let botaoContinuarEsqueciSenha = document.querySelector("#botao-continuar-esqueci-senha");
let campoEsqueciSenhaCodigo = document.querySelector('.envio-codigo-email');
let botaoVoltarEsqueciSenhaCodigo = document.querySelector('.botao-voltar-enviar-codigo');
let verificarCodigoComUsuario = document.querySelector('#verificar-codigo-email');
let camposInputEsqueciSenha = document.querySelector(".campos-trocar-senha");
let botaoConfirmarNovaSenha = document.querySelector('#botao-confirmar-nova-senha');
let inputEmailEsqueciSenha = document.querySelector("input#email-esqueci-senha");
let inputCodigoEsqueciSenha = document.querySelector("input#codigo-esqueci-senha");

// Parte campo cadastro
let campoCadastroForm = document.querySelector('div.campo-cadastro');
let primeiroBotaoVoltarCadastro = document.querySelector('button#botao-voltar-cadastro-01');
let segundoBotaoVoltarCadastro= document.querySelector('button#botao-voltar-cadastro-02');
let terceiroBotaoVoltarCadastro = document.querySelector('button#botao-voltar-cadastro-03');
let primeiroBotaoContinuar = document.querySelector('#botao-continuar-01');
let segundoBotaoContinuar = document.querySelector('#botao-continuar-02');
let ultimoBotaoContinuarCadastro = document.querySelector('#botao-continuar-03');
let divNomeUsuario = document.querySelector('div#campo-cadastro-nome-usuario');
let divEmailUsuario = document.querySelector('div#campo-cadastro-email');
let divSenhaUsuario = document.querySelector('div#campo-cadastro-senha');
let instrucaoUsuario = document.querySelector('p#instrucoes-para-usuario');
let botaoVoltarEnvioCodigo = document.querySelector('#envio-codigo-botao-voltar');
let verificarCodigoCampoCadastro = document.querySelector('#envio-codigo-botao-verificar');
let digitarCodigoCadastro = document.querySelector('#campos-digitar-codigo-cadastro');
let barraCadastro = document.querySelector(".estilizacao-barra")
let botaoContinuarQuatro = document.querySelector("button#botao-continuar-04");
let botaoVoltarQuatro = document.querySelector("button#botao-voltar-cadastro-04");
let digitarNumeroWhatsapp = document.querySelector("div#campo-cadastro-whatsapp")
let inputNomeUsuarioCadastro = document.querySelector("#nome-usuario-cadastro")
let inputEmailCadastro = document.querySelector("#email-cadastro")
let inputWhatsappCadastro = document.querySelector("#whatsapp-cadastro")
let inputCadastroSenha = document.querySelector("#senha-cadastro")
let inputCodigoCadastro = document.querySelector("#input-codigo-cadastro");
let campoCadastroEnvioCodigo = document.querySelector("#campos-digitar-codigo-cadastro");

botaoLogin.addEventListener('click', function entrarSite(){
    let inputEmailLogin = document.querySelector('input#input-email').value.trim();
    let inputSenhaLogin = document.querySelector('input#input-senha').value;

    if(!regexEmail.test(inputEmailLogin)){
        alert("Email inválido!");
        return;
    }

    if(!regexSenha.test(inputSenhaLogin)){
        alert("A senha precisa ter 8 caracteres ou mais!");
        return;
    }

    let dadosUsuario = { email: inputEmailLogin, senha: inputSenhaLogin };

    mostrarLoading()

    fetch("https://apoialocal-projeto.onrender.com/realizar-login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosUsuario)
    })
    .then(resposta => resposta.json())
    .then(dados => {
        if (dados.token) {
            // Salvando no cache (localStorage)
            localStorage.setItem('tokenUsuario', dados.token);
            localStorage.setItem('nomeUsuario', dados.nome);
            localStorage.setItem('whatsappUsuario', dados.whatsapp);

            console.log("=== DADOS SALVOS NO LOCALSTORAGE COM SUCESSO ===");
            console.log("Token:", localStorage.getItem('tokenUsuario'));
            console.log("Nome do usuário:", localStorage.getItem('nomeUsuario'));
            console.log("WhatsApp:", localStorage.getItem('whatsappUsuario'));
            console.log("================================================");
            alert("Login feito com sucesso!");

            window.open("http://127.0.0.1:5500/apoia-local/front-end/paginas/pagina-principal/index.html");
        } else {
            alert(dados.mensagem || "Erro ao realizar login.");
        }
    })
    .catch(erro => {
        console.log("Ocorreu um erro: ", erro);
    })
    .finally(() => {
        esconderLoading();
    })
});

linkCliqueAqui.addEventListener('click', function mudarSenha(){
    loginFormulario.style.display = "none";
    esquecerSenha.style.display = "flex";
    inputEmailEsqueciSenha.focus();
});

botaoVoltarEsqueciSenha.addEventListener('click', function voltarCampo(){
    loginFormulario.style.display = "flex";
    esquecerSenha.style.display = "none";
});

botaoContinuarEsqueciSenha.addEventListener('click', function proximaEtapa(){
    let valorEmail = inputEmailEsqueciSenha.value.trim();

    if (!regexEmail.test(valorEmail)){
        alert('Email Inválido!');
        inputEmailEsqueciSenha.focus();
        return;
    }

    localStorage.setItem('emailEsqueciSenha', valorEmail);
    let emailUsuario = { email: valorEmail };

    mostrarLoading();

    fetch("https://apoialocal-projeto.onrender.com/esqueci-senha", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(emailUsuario)
    })
    .then(async resposta => {
        const dados = await resposta.json();

        // Se o back-end responder 400 ou 404, mostra o alert!
        if (!resposta.ok) {
            alert(dados.mensagem);

            // Se já tiver código válido enviado, já abre a tela para digitar
            if (dados.mensagem.includes("já possui um código")) {
                campoEsqueciSenhaCodigo.style.display = "flex";
                esquecerSenha.style.display = "none";
                inputCodigoEsqueciSenha.focus();
            }
            return;
        }

        campoEsqueciSenhaCodigo.style.display = "flex";
        esquecerSenha.style.display = "none";
        inputCodigoEsqueciSenha.focus();
    })
    .catch(erro => {
        alert("Erro ao conectar com o servidor.");
    })
    .finally(() => {
        esconderLoading();
    })
});


botaoVoltarEsqueciSenhaCodigo.addEventListener('click', function voltarCampoAnterior(){
    campoEsqueciSenhaCodigo.style.display = "none";
    esquecerSenha.style.display = "flex";
});

botaoCadastro.addEventListener('click', function campoCadastro() {
    loginFormulario.style.display = "none";
    campoCadastroForm.style.display = "flex";
    instrucaoUsuario.innerText = "Crie um nome de usuário para que você possa continuar o processo do cadastro."
    inputNomeUsuarioCadastro.focus();
});

primeiroBotaoVoltarCadastro.addEventListener('click', function voltarCampoCadastro(){
    loginFormulario.style.display = "flex";
    divNomeUsuario.style.display = "flex";
    divEmailUsuario.style.display = "none"
    campoCadastroForm.style.display = "none";
});

primeiroBotaoContinuar.addEventListener('click', () =>{
    let inputNomeUsuarioCadastro = document.querySelector('input#nome-usuario-cadastro').value.trim();

    if (!regexNomeUsuario.test(inputNomeUsuarioCadastro)){
        alert('Nome de usuário inválido!');
        return
    }

    divNomeUsuario.style.display = "none";
    divEmailUsuario.style.display = "flex";
    primeiroBotaoContinuar.style.display = "none";
    primeiroBotaoVoltarCadastro.style.display = "none";
    segundoBotaoContinuar.style.display = "block";
    segundoBotaoVoltarCadastro.style.display = "block";
    instrucaoUsuario.innerText = "Digite o seu e-mail para continuar o processo de cadastro da conta."
    barraCadastro.style.width = "20%";
    inputEmailCadastro.focus();
});

segundoBotaoVoltarCadastro.addEventListener('click', () => {
    divEmailUsuario.style.display = "none";
    divNomeUsuario.style.display = "flex";
    segundoBotaoVoltarCadastro.style.display = "none";
    segundoBotaoContinuar.style.display = "none";
    primeiroBotaoVoltarCadastro.style.display = "block";
    primeiroBotaoContinuar.style.display = "block";
    instrucaoUsuario.innerText = "Crie um nome de usuário para que você possa continuar o processo do cadastro."
    barraCadastro.style.width = "0%";
    inputNomeUsuarioCadastro.focus();
})

segundoBotaoContinuar.addEventListener('click', () => {
    let inputEmailCadastro = document.querySelector('input#email-cadastro').value.trim();

    if(!regexEmail.test(inputEmailCadastro)){
        alert('O email digitado é inválido!');
        return
    }

    divEmailUsuario.style.display = "none"
    segundoBotaoVoltarCadastro.style.display = "none"
    botaoVoltarQuatro.style.display = "block"
    digitarNumeroWhatsapp.style.display = "flex"
    segundoBotaoContinuar.style.display = "none";
    botaoContinuarQuatro.style.display = "block";
    instrucaoUsuario.innerText = "Digite o seu número de Whatsapp para continuar o processo.";
    barraCadastro.style.width = "40%";
    inputWhatsappCadastro.focus()
})

botaoContinuarQuatro.addEventListener('click', () => {
    let verificarInputWhatsapp = inputWhatsappCadastro.value;

    if (!regexWhatsapp.test(verificarInputWhatsapp)){
        alert("Número Whatsapp inválido!");
        return;
    }

    botaoContinuarQuatro.style.display = "none";
    botaoVoltarQuatro.style.display = "none";
    digitarNumeroWhatsapp.style.display = "none";
    instrucaoUsuario.innerText = "Crie uma senha para que você possa finalizar o processo do cadastro."
    divSenhaUsuario.style.display = "flex";
    terceiroBotaoVoltarCadastro.style.display = "block";
    ultimoBotaoContinuarCadastro.style.display = "block";
    barraCadastro.style.width = "60%";
    inputCadastroSenha.focus();
})

botaoVoltarQuatro.addEventListener('click', () => {
    instrucaoUsuario.innerText = "Digite o seu e-mail para continuar o processo de cadastro da conta.";
    botaoContinuarQuatro.style.display = "none";
    botaoVoltarQuatro.style.display = "none";
    digitarNumeroWhatsapp.style.display = "none";
    divEmailUsuario.style.display = "flex";
    segundoBotaoContinuar.style.display = "block";
    segundoBotaoVoltarCadastro.style.display = "block";
    barraCadastro.style.width = "20%";
    inputEmailCadastro.focus();
})

terceiroBotaoVoltarCadastro.addEventListener('click', () => {
    divSenhaUsuario.style.display = "none"; 
    terceiroBotaoVoltarCadastro.style.display = "none";
    ultimoBotaoContinuarCadastro.style.display = 'none';
    botaoContinuarQuatro.style.display = "block";
    digitarNumeroWhatsapp.style.display = "flex";
    botaoVoltarQuatro.style.display = "block";
    instrucaoUsuario.innerText = "Digite o seu número de Whatsapp para continuar o processo.";
    barraCadastro.style.width = "40%";
    inputWhatsappCadastro.focus();
});


ultimoBotaoContinuarCadastro.addEventListener('click', () => {
    let inputEmailUsuario = inputEmailCadastro.value;
    let inputSenhaCadastro = document.querySelector('input#senha-cadastro').value;
    let inputConfirmarSenhaCadastro = document.querySelector('input#confirmar-senha-cadastro').value;
    let inputWhatsappUsuario = inputWhatsappCadastro.value;
    let inputNomeUsuario = inputNomeUsuarioCadastro.value;

    if (inputSenhaCadastro !== inputConfirmarSenhaCadastro){
        alert("As senhas não são iguais!");
        return
    }

    if (!regexSenha.test(inputSenhaCadastro)){
        alert('A senha precisa ter no mínimo 8 caracteres!');
        return
    }

    localStorage.setItem('emailUsuario', inputEmailUsuario);

    mostrarLoading();

    const dadosEnvio = {email: inputEmailUsuario, username: inputNomeUsuario, senha: inputSenhaCadastro, whatsappUsuario: inputWhatsappUsuario}
    fetch("https://apoialocal-projeto.onrender.com/fazer-cadastro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosEnvio)
    })
    .then(async resposta => {
        const dados = await resposta.json();

        // Agora sim 'resposta' e 'dados' existem no mesmo bloco!
        if (!resposta.ok) {
            alert(dados.mensagem || "Erro ao realizar cadastro.");
            return;
        }

        respostaRequisicaoConfirmarCadastro = dados;
        alert(respostaRequisicaoConfirmarCadastro.mensagem);
        
        divSenhaUsuario.style.display = "none";
        ultimoBotaoContinuarCadastro.style.display = "none";
        terceiroBotaoVoltarCadastro.style.display = "none";
        digitarCodigoCadastro.style.display = "flex";
        verificarCodigoCampoCadastro.style.display = "block";
        botaoVoltarEnvioCodigo.style.display = "block";
        instrucaoUsuario.innerText = "Para finalizar o cadastro, digite o código que foi enviado para o seu e-mail";
        barraCadastro.style.width = "80%";
        inputCodigoCadastro.focus();    
    })
    .catch(erro => {
        console.log("Ocorreu um erro na requisição HTTP:", erro);
    })
    .finally(() => {
        esconderLoading();
    });


})

botaoVoltarEnvioCodigo.addEventListener('click', function botaoVoltarCampoCadastro(){
    digitarCodigoCadastro.style.display = "none";
    botaoVoltarEnvioCodigo.style.display = "none";
    verificarCodigoCampoCadastro.style.display = "none";
    divSenhaUsuario.style.display = "flex";
    ultimoBotaoContinuarCadastro.style.display = "block";
    terceiroBotaoVoltarCadastro.style.display = "block";
    instrucaoUsuario.innerText = "Crie uma senha para que você possa finalizar o processo do cadastro.";
    barraCadastro.style.width = "60%";
    inputCadastroSenha.focus();
});

verificarCodigoComUsuario.addEventListener('click', () => {
    let valorCodigo = document.querySelector('#codigo-esqueci-senha').value.trim();
    const emailSalvo = localStorage.getItem('emailEsqueciSenha');

    if (!emailSalvo) {
        alert("E-mail não encontrado. Por favor, volte e informe seu e-mail.");
        return;
    }

    if (!regexCodigoToken.test(valorCodigo)) {
        alert('O código precisa ter exatamente 6 números.');
        return;
    }

    let confirmarCodigo = { 
        email: emailSalvo, 
        inputUsuarioEsqueciSenha: valorCodigo 
    };

    mostrarLoading();

    fetch("https://apoialocal-projeto.onrender.com/confirmar-codigo-esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(confirmarCodigo)
    })
    .then(async resposta => {
        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem);
            return;
        }

        camposInputEsqueciSenha.style.display = "flex";
        campoEsqueciSenhaCodigo.style.display = "none";
        document.querySelector("#input-digitar-nova-senha").focus();
    })
    .catch(erro => {
        console.log("Um erro ocorreu: ", erro);
        alert("Erro ao conectar com o servidor.");
    })
    .finally(() => {
        esconderLoading();
    })
})

botaoConfirmarNovaSenha.addEventListener('click', function voltarParaTelaInicial(){
    let inputNovaSenha = document.querySelector("#input-digitar-nova-senha").value;
    let inputConfirmarSenha = document.querySelector("#input-confirmar-nova-senha").value;
    const emailLocal = localStorage.getItem("emailEsqueciSenha")

    if(!regexSenha.test(inputNovaSenha)){
        alert("A senha precisa ter no mínimo 8 caracteres.");
        return
    }

    if (String(inputNovaSenha) !== String(inputConfirmarSenha)){
        alert("As senhas não conferem!");
        return
    }

    mostrarLoading();

    const dadosJSON = {email: emailLocal, senha: inputNovaSenha, confirmarSenha: inputConfirmarSenha}
    fetch('https://apoialocal-projeto.onrender.com/nova-senha-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosJSON),
        })
      .then((resposta) => {
        if (!resposta.ok) {
          return resposta.json().then((err) => {
            throw new Error(err.mensagem);
          });
        }
        return resposta.json();
      })
      .then((dados) => {
        localStorage.removeItem('emailEsqueciSenha');

        camposInputEsqueciSenha.style.display = 'none';
        loginFormulario.style.display = 'flex';
      })
      .catch((erro) => {
        alert(erro.message || 'Ocorreu um erro ao conectar com o servidor!');
        console.log('Um erro ocorreu: ', erro);
      })
      .finally(() => {
        esconderLoading();
      })
})

verificarCodigoCampoCadastro.addEventListener('click', function voltarParaTelaDeLogin() {
    let inputCodigoCadastro = document.querySelector('input#input-codigo-cadastro').value.trim();
    let emailSalvo = localStorage.getItem('emailUsuario');

    if(!emailSalvo){
        alert("Email não encontrado. Por favor, faça o cadastro novamente!");
        return;
    }

    if (!regexCodigoToken.test(inputCodigoCadastro)) {
        alert('O código precisa ter exatamente 6 números.');
        return;
    }

    let dadosConfirmarCadastro = {
        email: emailSalvo,
        inputUsuarioCodigoEmail: inputCodigoCadastro
    };

    fetch("https://apoialocal-projeto.onrender.com/confirmar-cadastro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosConfirmarCadastro)
    })
    .then(resposta => resposta.json())
    .then(dados => {

        if (dados.sucesso) {

            localStorage.removeItem('emailUsuario');

            barraCadastro.style.width = "100%";
            
            setTimeout(() => {
                window.location.reload();
            }, 1200);
            
        } else {
            // Caso dê errado (código incorreto, expirado, etc.)
            alert(dados.mensagem || "Código inválido. Tente novamente.");
        }
    })
    .catch(error => {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
    });
});