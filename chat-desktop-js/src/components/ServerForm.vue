<template>
  <v-card class="serverFormCard" :loading="loading" :disabled="loading">
    <v-card-title>
      <div>Bem-vindo</div>
    </v-card-title>
    <v-card-subtitle>Informe o endereço do servidor</v-card-subtitle>
    <v-card-text>
      <v-text-field
        v-model="enderecoServidor"
        placeholder="ws://localhost:8080/"
        :error-messages="enderecoServidorErro"
        @keyup.enter="conectar"
      />
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn @click="conectar" color="primary" text>Conectar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    loading: { required: true, default: false, type: Boolean },
  },

  data: () => ({
    enderecoServidor: "",
    enderecoServidorErro: "",
  }),

  computed: {
    isPort() {
      try {
        return parseInt(this.enderecoServidor) == this.enderecoServidor;
      } catch (e) {
        return false;
      }
    },
  },

  methods: {
    conectar() {
      if (this.enderecoServidor.trim() == "") {
        this.enderecoServidorErro = "Informe o endereço do servidor";
      } else {
        this.enderecoServidorErro = "";
        if (this.isPort) {
          this.enderecoServidor = `ws://localhost:${this.enderecoServidor}`;
        }
        this.$emit("conectar", { enderecoServidor: this.enderecoServidor });
      }
    },
  },
};
</script>

<style scoped>
.serverFormCard {
  width: 400px;
}
.mensagemErro {
  font-size: 14px;
}
</style>