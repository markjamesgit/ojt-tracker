<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Super Admin Panel</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item clickable v-ripple to="/superadmin/dashboard">Dashboard</q-item>
        <q-item clickable v-ripple to="/superadmin/manage-users">Manage Users</q-item>
        <q-item clickable v-ripple to="/superadmin/reports">Reports</q-item>
        <q-item clickable v-ripple to="/superadmin/settings">Settings</q-item>
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
