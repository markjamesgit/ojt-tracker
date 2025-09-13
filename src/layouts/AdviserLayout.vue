<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-green text-white">
      <q-toolbar>
        <q-toolbar-title>Adviser Panel</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item clickable v-ripple to="/adviser/dashboard">Dashboard</q-item>
        <q-item clickable v-ripple to="/adviser/track-students">Track Students</q-item>
        <q-item clickable v-ripple to="/adviser/reports">Reports</q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const leftDrawerOpen = ref(true)
</script>
