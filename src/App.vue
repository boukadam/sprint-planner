<template>
  <v-app>
    <v-toolbar color="black">
      <span class="grey--text ml-2 text-md-h4 text-sm-h5">Sprint Planner</span>
      <v-spacer></v-spacer>
      <v-menu left offset-y>
        <template v-slot:activator="{ attrs, on }">
          <v-btn class="white--text" v-bind="attrs" v-on="on" text :small="$vuetify.breakpoint.xs">
            {{ username }} &#x25BC;
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="showUsernamePopup = true">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Change display name</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-layout v-if="showUsernamePopup" align-center justify-center fill-height>
      <UsernamePopup @close-dialog="showUsernamePopup = false"></UsernamePopup>
    </v-layout>
    <router-view v-else-if="isMounted"></router-view>
    <v-footer padless>
      <v-container class="d-flex justify-space-between" style="max-width: 1024px">
        <div>
          <a class="github-button" href="https://github.com/boukadam/bannershake" data-size="large" data-show-count="true"
             aria-label="Star boukadam/skills-banner-generator on GitHub"> Star </a>
        </div>
        <div v-if="!$vuetify.breakpoint.xs">
          <v-row>
            {{ new Date().getFullYear() }} - Sprint Planner
          </v-row>
        </div>
        <div>
          <a class="github-button" href="https://github.com/boukadam" data-size="large" aria-label="Follow @boukadam on GitHub">
            Follow @boukadam
          </a>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>

// import {nanoid} from "nanoid";
// import Pusher from "pusher-js";
import {mapActions, mapGetters} from 'vuex';
import UsernamePopup from "@/components/UsernamePopup";

export default {
  name: 'App',
  components: {UsernamePopup},
  data: () => ({
    showUsernamePopup: false,
    sprintId: null,
    channel: null,
    presenceChannel: null,
    online: false,
    members: [],
    snackbar: false,
    textSnackbar: "",
    isMounted: false
  }),
  mounted() {
    this.showUsernamePopup = this.username === null;
    this.setPusher();
    this.isMounted = true;
  },
  computed: {
    // getChannelName() {
    //   if (this.channel) {
    //     return this.channel.name.replace('private-', '');
    //   }
    //   return "";
    // },
    // pusher() {
    //   return new Pusher(process.env.VUE_APP_PUSHER_API_KEY, {
    //     cluster: process.env.VUE_APP_PUSHER_CLUSTER,
    //     encrypted: true,
    //     authEndpoint: process.env.VUE_APP_PUSHER_AUTH_ENDPOINT,
    //     auth: {
    //       params: {
    //         username: this.username2
    //       }
    //     }
    //   });
    // },
    ...mapGetters(['username'])
  },
  methods: {
    ...mapActions(['setUsername', 'setPusher'])
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: url("./assets/screen_bg.png") !important;
}
</style>
