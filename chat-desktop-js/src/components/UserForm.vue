<template>
  <v-card class="dialogPequeno" :loading="loading" :disabled="loading">
    <v-card-title>
      <div>Quase lá</div>
    </v-card-title>
    <v-card-subtitle>Entre com o seu nome e clique em iniciar</v-card-subtitle>
    <v-card-text>
      <v-text-field
        v-model="nomeUsuario"
        label="Seu nome"
        autofocus
        :error-messages="nomeUsuarioErro"
        @keyup.enter="iniciar"
      />
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn @click="iniciar" color="primary" text>Iniciar</v-btn>
      <v-btn @click="cancelar" color="default" text>Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  data: function () {
    return {
      nomeUsuario: "",
      nomeUsuarioErro: "",
    };
  },

  methods: {
    iniciar() {
      this.$emit("input", { nomeUsuario: this.nomeUsuario });
      this.$emit("iniciar", { nomeUsuario: this.nomeUsuario });
    },
    cancelar() {
      this.$emit("cancelar");
    },
  },
};
</script>