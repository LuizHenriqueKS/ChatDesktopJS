<template>
  <v-app>
    <v-snackbar v-model="mensagemErroVisivel" color="error" top>
      <div class="d-flex">
        <v-icon>fa-exclamation-circle</v-icon>
        <div class="ml-3" style="padding-top: 3px">{{ mensagemErro }}</div>
      </div>
    </v-snackbar>
    <v-main>
      <transition-group
        enter-active-class="animated bounceInLeft"
        leave-active-class="animated bounceOutRight"
        mode="out-in"
      >
        <Center key="SERVER_FORM" v-if="telaExibir == 'SERVER_FORM'">
          <ServerForm
            v-model="enderecoServidor"
            :loading="conectando"
            @conectar="conectar"
          />
        </Center>
        <Center key="USER_FORM" v-if="telaExibir == 'USER_FORM'">
          <UserForm
            v-model="infoUsuario"
            :loading="enviandoInfoUsuarios"
            @iniciar="iniciarChat"
            @cancelar="disconectar"
          />
        </Center>
        <Center key="CHAT_FORM" v-if="telaExibir == 'CHAT_FORM'">
          <ChatForm :infoUsuario="infoUsuario" :usuarios="usuarios" ref="chatForm" />
        </Center>
      </transition-group>
    </v-main>
  </v-app>
</template>

<script>
import TelaExibir from "./lib/TelaExibir";
import chatClient from "./lib/chatClient";

import Center from "./components/Center";
import ServerForm from "./components/ServerForm";
import UserForm from "./components/UserForm";
import ChatForm from "./components/ChatForm";

export default {
  name: "App",

  components: {
    ServerForm,
    UserForm,
    ChatForm,
    Center,
  },

  data: () => ({
    conectando: false,
    enviandoInfoUsuarios: false,
    enderecoServidor: "",
    mensagemErro: "",
    mensagemErroVisivel: false,
    telaExibir: TelaExibir.SERVER_FORM,
    infoUsuario: {
      nomeUsuario: "",
    },
    usuarios: [],
  }),

  watch: {
    telaExibir() {
      if (this.telaExibir == TelaExibir.CHAT_FORM) {
        this.$refs.chatForm.onShow();
      } else if (this.telaExibir== TelaExibir.SERVER_FORM){
        this.chatClient.disconnect();
      }
    },
  },

  mounted() {
    if (chatClient.connected) {
      this.telaExibir = TelaExibir.USER_FORM;
    }
    chatClient.enterChatListener.push(() => this.onEntrouChat());
    chatClient.disconnectListener.push(() => this.onDesconectou());
    chatClient.usernameAlreadyExistsListener.push(() => this.onNomeUsuarioJaUsado());
    chatClient.usersInfoListener = [this.onUsersInfo];
  },

  methods: {
    async conectar() {
      try {
        this.conectando = true;
        this.mensagemErroVisivel = false;
        await chatClient.connect(this.enderecoServidor);
        this.telaExibir = TelaExibir.USER_FORM;
      } catch (e) {
        console.error(e);
        chatClient.disconnect();
        this.exibirMensagemErro("Não foi possível conectar com o servidor.");
      } finally {
        this.conectando = false;
      }
    },

    disconectar() {
      try {
        chatClient.disconnect();
      } finally {
        this.telaExibir = TelaExibir.SERVER_FORM;
      }
    },

    iniciarChat() {
      chatClient.updateUserInfo({ name: this.infoUsuario.nomeUsuario });
      this.enviandoInfoUsuarios = true;
      setTimeout(() => {
        if (this.enviandoInfoUsuarios && this.telaExibir == TelaExibir.USER_FORM) {
          this.telaExibir = TelaExibir.SERVER_FORM;
          this.exibirMensagemErroConexao();
          this.enviandoInfoUsuarios = false;
          chatClient.disconnect();
        }
      }, 5000);
    },

    onEntrouChat() {
      this.telaExibir = TelaExibir.CHAT_FORM;
      this.enviandoInfoUsuarios = false;
    },

    onDesconectou() {
      this.telaExibir = TelaExibir.SERVER_FORM;
      this.conectando = false;
      this.exibirMensagemErro("Você foi desconectado do servidor.");
    },

    onNomeUsuarioJaUsado(){
      this.telaExibir = TelaExibir.USER_FORM;
      this.conectando = false;
      this.enviandoInfoUsuarios = false;
      this.exibirMensagemErro("O nome de usuário informado já está sendo utilizado.");
    },

    exibirMensagemErro(mensagem) {
      this.mensagemErro = mensagem;
      this.mensagemErroVisivel = true;
    },

    exibirMensagemErroConexao() {
      this.exibirMensagemErro("Erro na conexão com o servidor.");
    },

    onUsersInfo(usersInfo){
      const todosUsuarios = usersInfo.users.map(u=>({
        nomeUsuario: u.name,
        voce: u.your
      }));
      const usuarioLogadoIndice = todosUsuarios.findIndex(u=>u.voce);
      const usuarioLogado = todosUsuarios[usuarioLogadoIndice];
      const outrosUsuarios = todosUsuarios.filter(u=>!u.voce);
      this.usuarios = [usuarioLogado, ...outrosUsuarios];
    }

  },
};
</script>

<style>
* {
  user-select: none;
}
.wh-100 {
  width: 100%;
  height: 100%;
}
.w-100 {
  width: 100%;
}
html {
  overflow-y: auto;
}
.dialogPequeno {
  width: 400px;
}
</style>