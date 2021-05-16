<template>
  <v-layout v-if="isMounted" justify-center fill-height>
    <v-container>
      <v-row justify="end">
        <v-col>
          <div>You are connected to : {{ sprintId }}</div>
        </v-col>
      </v-row>
      <!--    <v-card>-->
      <!--      <v-card-title>-->
      <!--        You are connected to : {{ sprintId }}-->
      <!--      </v-card-title>-->
      <!--      <v-card-actions class="mt-2">-->
      <!--        <v-btn color="primary" @click="copyToClipboard">Copy Sprint ID</v-btn>-->
      <!--        <v-spacer></v-spacer>-->
      <!--        <v-btn color="error" @click="unsubscribe">Leave Sprint</v-btn>-->
      <!--      </v-card-actions>-->
      <!--    </v-card>-->
      <v-row>
        <v-col>
          <v-simple-table>
            <thead>
            <tr>
              <th>Name</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="[key, value] of members.entries()" :key="key">
              <td>{{ value.username }}</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>

import {mapGetters} from "vuex";

export default {
  name: 'Sprint',
  data: () => ({
    sprintId: null,
    channel: null,
    presenceChannel: null,
    members: new Map(),
    isMounted: false
  }),
  mounted() {
    this.sprintId = this.$route.params.sprintId;
    let that = this;
    this.channel = this.pusher.subscribe(`private-${this.sprintId}`);
    this.channel.bind('pusher:subscription_succeeded', () => {
      console.log('Successfully subscribe to private-' + that.sprintId);
      that.presenceChannel = this.pusher.subscribe(`presence-${that.sprintId}`);
      that.presenceChannel.bind('pusher:subscription_succeeded', (members) => {
        console.log('Successfully subscribe to presence-' + that.sprintId);
        members.each((member) => {
          that.members.set(member.id, member.info);
        });
        that.isMounted = true
      });
      that.presenceChannel.bind('pusher:subscription_error', function (err) {
        console.log("Fail to subscribe to presence-" + that.sprintId)
        console.log(err);
      });
      that.presenceChannel.bind('pusher:member_added', function (member) {
        that.members.set(member.id, member.info);
      });
      that.presenceChannel.bind('pusher:member_removed', function (member) {
        that.members.delete(member.id);
      });
    });
    this.channel.bind('pusher:subscription_error', function (err) {
      console.log("Fail to subscribe to private-" + this.sprintId)
      console.log(err);
    });
  },
  computed: {
    ...mapGetters(['username', 'pusher']),
  },
  methods: {
    unsubscribe() {
      this.pusher.unsubscribe("private-" + this.sprintId);
      this.channel = null;
      console.log('Unsubscribe from private-' + this.sprintId);
      this.pusher.unsubscribe("presence-" + this.sprintId);
      this.presenceChannel = null;
      console.log('Unsubscribe from presence-' + this.sprintId);
      this.$router.push('/');
    },
    copyToClipboard() {
      console.log("copyToClipboard");
    }
  },
  beforeDestroy() {
    if (this.channel) {
      this.unsubscribe();
    }
  }
}
</script>
