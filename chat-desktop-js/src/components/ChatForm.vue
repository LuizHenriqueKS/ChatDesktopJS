<template>
  <div class="chat">
    <div class="chat__users"></div>
    <div class="chat__main">
      <div class="chat__messages" ref="chatMessages">
        <div v-for="msg of mensagens" :key="msg.id" class="mb-2">
          <ChatMessage
            class="chat__message"
            :mensagem="msg"
            :corNomeUsuario="
              msg.mensagemDeOutros
                ? corDasMensagensOutros
                : corDasMinhasMensagens
            "
          />
        </div>
      </div>
      <div class="chat__input">
        <input
          type="text"
          ref="inputMensagemEnviar"
          v-model="mensagemEnviar"
          placeholder="Escreva uma mensagem..."
          autofocus
          @keyup.enter="enviarMensagem"
        />
      </div>
    </div>
  </div>
</template>

<script>
import chatClient from "../lib/chatClient";
import ChatMessage from "./ChatMessage";

export default {
  components: {
    ChatMessage,
  },

  props: {
    infoUsuario: {
      type: Object,
      required: true,
    },
  },

  data: function () {
    return {
      mensagens: [
        {
          id: 0,
          nomeUsuario: "Luiz",
          texto: "Oi",
          hora: new Date(),
          mensagemDeOutros: true,
        },
      ],
      mensagemEnviar: "",
      corDasMensagensOutros: "is-username-orange",
      corDasMinhasMensagens: "blue--text text--darken-4",
    };
  },

  computed: {
    verificarSeEstaNoFinalDoScroll() {
      return true;
    },
  },

  created() {
    chatClient.textMessageListener = [this.onMessage];
  },

  methods: {
    enviarMensagem() {
      const mensagem = {
        id: Math.random(),
        nomeUsuario: this.infoUsuario.nomeUsuario,
        texto: this.mensagemEnviar,
        hora: new Date(),
        mensagemDeOutros: false,
      };
      this.addMensagem(mensagem);
      this.enviarMensagemParaServidor(mensagem);
      this.mensagemEnviar = "";
    },
    enviarMensagemParaServidor(mensagem) {
      const message = {
        id: mensagem.id,
        type: "text_message",
        text: mensagem.texto,
      };
      chatClient.sendMessage(message);
    },
    addMensagem(mensagem) {
      const estaNoFinalDoScroll = this.verificarSeEstaNoFinalDoScroll;
      this.mensagens.push(mensagem);
      if (estaNoFinalDoScroll) {
        this.scrollParaFimDasMensagens();
      }
    },
    scrollParaFimDasMensagens() {},
    onShow() {
      setTimeout(() => this.$refs.inputMensagemEnviar.focus(), 100);
    },
    onMessage(message) {
      console.log("message", message);
      if (!message.your) {
        const mensagem = {
          id: message.id,
          nomeUsuario: message.username,
          texto: message.text,
          hora: new Date(message.datetime),
          mensagemDeOutros: true,
        };
        this.addMensagem(mensagem);
      }
    },
  },
};
</script>

<style scoped>
.chat {
  width: 100%;
  height: 100%;
}
.chat__main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.chat__messages {
  flex-grow: 1;
  flex-shrink: 1;
  background: #80808014;
  padding: 10px;
  overflow: auto;
}
.chat__message {
  display: inline-block;
}
.chat__input {
  display: flex;
  border-top: 1px solid lightgray;
}
.chat__input > input {
  flex-grow: 1;
  flex-shrink: 1;
  padding: 12px;
  outline: none;
  font-weight: 100;
  font-family: Arial;
  font-size: 0.9em;
  color: black;
}
</style>

<style>
.is-username-orange {
  color: #ce6009 !important;
}
</style>