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
        <Center key="SERVER_FORM" v-show="telaExibir == 'SERVER_FORM'">
          <ServerForm
            v-model="enderecoServidor"
            :loading="conectando"
            @conectar="conectar"
          />
        </Center>
        <Center key="USER_FORM" v-show="telaExibir == 'USER_FORM'">
          <UserForm
            v-model="infoUsuario"
            :loading="enviandoInfoUsuarios"
            @iniciar="iniciarChat"
            @cancelar="disconectar"
          />
        </Center>
        <Center key="CHAT_FORM" v-show="telaExibir == 'CHAT_FORM'">
          <ChatForm :infoUsuario="infoUsuario" ref="chatForm" />
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
  }),

  watch: {
    telaExibir() {
      if (this.telaExibir == TelaExibir.CHAT_FORM) {
        this.$refs.chatForm.onShow();
      }
    },
  },

  mounted() {
    if (chatClient.connected) {
      this.telaExibir = TelaExibir.USER_FORM;
    }
    chatClient.enterChatListener.push(() => this.onEntrouChat());
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
        if (this.telaExibir == TelaExibir.USER_FORM) {
          this.telaExibir = TelaExibir.SERVER_FORM;
          this.exibirMensagemErro("Erro na conexão com o servidor.");
          this.enviandoInfoUsuarios = false;
          chatClient.disconnect();
        }
      }, 5000);
    },

    onEntrouChat() {
      this.telaExibir = TelaExibir.CHAT_FORM;
      this.enviandoInfoUsuarios = false;
    },

    exibirMensagemErro(mensagem) {
      this.mensagemErro = mensagem;
      this.mensagemErroVisivel = true;
    },
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