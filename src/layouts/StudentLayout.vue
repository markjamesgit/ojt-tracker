<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-indigo text-white">
      <q-toolbar>
        <q-toolbar-title>Student Panel</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item clickable v-ripple to="/student/dashboard">Dashboard</q-item>
        <q-item clickable v-ripple to="/student/ojt-hours">OJT Hours</q-item>
        <q-item clickable v-ripple to="/student/requirements">Requirements</q-item>
        <q-item clickable v-ripple to="/student/profile">Profile</q-item>
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
