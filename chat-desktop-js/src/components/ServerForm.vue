<template>
  <v-card class="dialogPequeno" :loading="loading" :disabled="loading">
    <v-card-title>
      <div>Bem-vindo</div>
    </v-card-title>
    <v-card-subtitle>Informe o endereço do servidor</v-card-subtitle>
    <v-card-text>
      <v-text-field
        v-model="enderecoServidor"
        placeholder="ws://localhost:8080/"
        autofocus
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
  name: "ServerForm",

  props: {
    loading: { required: true, default: false, type: Boolean },
    value: { type: String, default: "" },
  },

  data: function () {
    return {
      enderecoServidor: this.value,
      enderecoServidorErro: "",
    };
  },

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
        this.$emit("input", this.enderecoServidor);
        this.$emit("conectar", { enderecoServidor: this.enderecoServidor });
      }
    },
  },
};
</script>

<style scoped>
.mensagemErro {
  font-size: 14px;
}
</style>