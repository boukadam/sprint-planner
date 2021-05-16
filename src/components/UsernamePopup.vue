<template>
  <v-flex xs12 sm8 md4 lg4>
    <v-card max-width="600px">
      <v-card-title>
        <span class="ml-2 text-md-h5 text-sm-h6 font-weight-medium teal--text text--darken-2">Choose your display name</span>
        <v-spacer></v-spacer>
        <v-icon v-if="username" @click="closeDialog">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="mt-6">
        <v-row>
          <v-col>
            <v-text-field v-model="usernameEdit" label="Username" outlined></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="teal" x-large :disabled="!usernameEdit" @click="setUsernameEdit(usernameEdit)">Continue</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  data: () => ({
    usernameEdit: null
  }),
  mounted() {
    this.usernameEdit = this.username;
  },
  computed: {
    ...mapGetters(['username'])
  },
  methods: {
    ...mapActions(['setUsername']),
    setUsernameEdit() {
      this.setUsername(this.usernameEdit);
      this.closeDialog();
    },
    closeDialog() {
      this.$emit('close-dialog');
    }
  }
}
</script>