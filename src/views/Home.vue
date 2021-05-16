<template>
  <v-layout align-center justify-center fill-height>
    <v-flex xs12 sm8 md4 lg4>
      <v-card max-width="600px">
        <v-card-title>
          <span class="ml-2 text-md-h5 text-sm-h6 font-weight-medium teal--text text--darken-2">Create or join a Sprint planning session</span>
        </v-card-title>
        <v-card-text>
          <div v-if="error" class="my-4 red--text text-md-subtitle-1">
            {{ error }}
          </div>
          <div class="my-4"></div>
          <v-row>
            <v-col>
              <v-btn block color="teal" dark x-large @click="createSprint">Create new</v-btn>
            </v-col>
          </v-row>
          <div class="my-4"></div>
          <v-row>
            <v-col cols="8">
              <v-text-field v-model="sprintId" outlined label="Sprint ID"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-btn block color="teal" dark x-large @click="joinSprint">join</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import {nanoid} from "nanoid";
import {mapGetters} from "vuex";

export default {
  name: 'Home',
  data: () => ({
    error: null,
    sprintId: null
  }),
  computed: {
    ...mapGetters(['username', 'pusher'])
  },
  methods: {
    createSprint() {
      if (this.username) {
        this.sprintId = nanoid();
        fetch("/.netlify/functions/server/sprints", {
          method: 'post',
          body: JSON.stringify({
            sprintId: this.sprintId,
            sprintName: "Sprint test",
            votingSystem: "Fibonacci"
          })
        }).then((response) => {
          if (response.status === 201) {
            this.$router.push({ name: 'Sprint', params: { sprintId: this.sprintId } })
          } else {
            console.log("Fail to create a new Sprint")
          }
        }).catch(() => {
          console.log("Fail to create a new Sprint")
        })
      } else {
        this.error = "Username is required";
      }
    },
    joinSprint() {
      if (this.username) {
        if (this.sprintId) {
          // if (this.pusher.channel(`private-${this.sprintId}`)) {
            this.$router.push({ name: 'Sprint', params: { sprintId: this.sprintId } })
          // } else {
          //   this.error = `The sprint '${this.sprintId}' does not exists`;
          // }
        } else {
          this.error = "Sprint ID is required";
        }
      } else {
        this.error = "Username is required";
      }
    },
    subscribe() {
      this.$router.push({ name: 'Sprint', params: { sprintId: that.sprintId } })
      let that = this;
      that.channel = that.pusher.subscribe(`private-${that.sprintId}`);
      that.channel.bind('pusher:subscription_succeeded', function () {
        console.log('Successfully subscribe to private-' + that.sprintId);
        that.presenceChannel = that.pusher.subscribe(`presence-${that.sprintId}`);
        that.presenceChannel.bind('pusher:subscription_succeeded', () => {
          console.log('Successfully subscribe to presence-' + that.sprintId);

        })
      });
      that.channel.bind('pusher:subscription_error', function (err) {
        console.log(err);
      });
    }
  }
}
</script>
