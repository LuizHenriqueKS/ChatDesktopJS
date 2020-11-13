<template>
  <v-card class="message" elevation="1">
    <v-card-text class="message__content">
      <b :class="classesNomeUsuario">{{ mensagem.nomeUsuario }}</b>
      <div class="message__body">
        <div>{{ mensagem.texto }}</div>
      </div>
      <div class="message__time caption">
        {{ horaFormatada }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    corNomeUsuario: {
      type: String,
      default: "",
    },
    mensagem: {
      type: Object,
      require: true,
    },
  },
  computed: {
    classesNomeUsuario() {
      return [this.corNomeUsuario];
    },
    horaFormatada() {
      const hora = this.mensagem.hora;
      const h = hora.getHours();
      const m = hora.getMinutes();
      return (h < 10 ? `0${h}` : h) + ":" + (m < 10 ? `0${m}` : m);
    },
  },
};
</script>

<style scoped>
.message {
  min-width: 80px;
}
.message__content {
  padding: 10px 10px 4px 10px;
}
.message__body > div {
  display: inline-block;
  margin-bottom: 2px;
  margin-right: 45px;
}
.message__time {
  margin-left: 8px;
  color: #b0b0b0;
  text-align: right;
  position: absolute;
  bottom: 0px;
  right: 10px;
  padding-bottom: 4px;
}
</style>