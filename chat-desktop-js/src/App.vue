<template>
  <v-app>
    <v-snackbar v-model="mensagemErroVisivel" color="error" top>
      <div class="d-flex">
        <v-icon>fa-exclamation-circle</v-icon>
        <div class="ml-3" style="padding-top: 3px">{{ mensagemErro }}</div>
      </div>
    </v-snackbar>
    <v-main>
      <div class="d-flex justify-center align-center wh-100">
        <v-scroll-x-transition>
          <ServerForm
            :loading="conectando"
            :mensagemErro="mensagemErro"
            @conectar="conectar"
            v-show="teste"
          />
        </v-scroll-x-transition>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import ServerForm from "./components/ServerForm";
import chatClient from "./lib/chatClient";

export default {
  name: "App",

  components: {
    ServerForm,
  },

  data: () => ({
    conectando: false,
    mensagemErro: "",
    mensagemErroVisivel: false,
    teste: true,
  }),

  methods: {
    async conectar(event) {
      try {
        this.conectando = true;
        this.mensagemErroVisivel = false;
        await chatClient.connect(event.enderecoServidor);
        this.teste = false;
      } catch (e) {
        this.exibirMensagemErro("Não foi possível conectar com o servidor.");
        console.error(e);
      } finally {
        this.conectando = false;
      }
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
html {
  overflow-y: auto;
}
</style>