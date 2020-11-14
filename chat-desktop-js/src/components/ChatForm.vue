<template>
  <div class="chat">
    <div class="chat__users">
      <div>
        <div :class="getChatUserClasses(u)" v-for="u of usuarios" :key="u.nomeUsuario">
          <i class="fa fa-star" title="Você" v-if="u.voce"/>
          <i class="fa fa-user green--text" title="Online" v-if="!u.voce"/>
          {{u.nomeUsuario}}
        </div>
      </div>
    </div>
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
        <div :class="classesBotaoEnviar" @click="enviarMensagem">
          <v-icon title="Enviar">fa fa-play</v-icon>
        </div>
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
    usuarios: {
      type: Array,
      required: true
    }
  },

  data: function () {
    return {
      mensagens: [],
      mensagemEnviar: "",
      corDasMensagensOutros: "is-username-orange",
      corDasMinhasMensagens: "blue--text text--darken-4",
    };
  },

  created() {
    chatClient.textMessageListener = [this.onMessage];
  },

  computed:{
    classesBotaoEnviar(){
      return ['chat__btn-enviar', this.mensagemEnviar==''?'is-disabled':''];
    }
  },

  methods: {
    getChatUserClasses(usuario){
      return ["chat__user", usuario.voce?"is-me":""];
    },
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
      setTimeout(() => this.$refs.inputMensagemEnviar.focus(), 100);
    },
    verificarSeEstaNoFinalDoScroll() {
      const chatMessages = this.$refs.chatMessages;
      return chatMessages.scrollTop + chatMessages.clientHeight + 100 >= chatMessages.scrollHeight;
    },
    addMensagem(mensagem) {
      const estaNoFinalDoScroll = this.verificarSeEstaNoFinalDoScroll();
      this.mensagens.push(mensagem);
      if (estaNoFinalDoScroll) {
        this.scrollParaFimDasMensagens();
      }
    },
    scrollParaFimDasMensagens() {
      const scrollToBottom = ()=>this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      setTimeout(()=>{
        scrollToBottom();  
      }, 1);
    },
    onShow() {
      setTimeout(() => this.$refs.inputMensagemEnviar.focus(), 100);
    },
    onMessage(message) {
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
    }
  },
};
</script>

<style scoped>
.chat {
  width: 100%;
  height: 100%;
  display: flex;
  border-top: 1px solid lightgray;
}
.chat__users {
  width: 250px;
  border-right: lightgray 1px solid;
  box-shadow: 1px 1px 5px #0000000f;
  background: #ececec;
  --background: white;
  padding: 8px 0px;
  overflow-y: auto;
}
.chat__user{
  padding: 2px 12px;
  --background: rgba(255, 255, 255, 0.8);
  --border-bottom: 1px solid lightgray;
  font-size: 0.9em;
}
.chat__user > i{
  width: 15px;
}
.chat__user.is-me{
  color: #0D47A1 !important;
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
.chat__btn-enviar{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  cursor: pointer;
}
.chat__btn-enviar > i{
  color: #2196F3;
}
.chat__btn-enviar.is-disabled{
  pointer-events: none;
  cursor: default;
}
.chat__btn-enviar.is-disabled > i{
  color: gray;
}
</style>

<style>
.is-username-orange {
  color: #ce6009 !important;
}
</style>