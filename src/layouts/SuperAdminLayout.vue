<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Burger menu for mobile -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="q-mr-sm lt-md"
        />

        <q-toolbar-title>Super Admin Panel</q-toolbar-title>

        <!-- Spacer -->
        <q-space />

        <!-- Logout button -->
        <q-btn flat dense icon="logout" label="Logout" @click="onLogout" class="q-ml-sm" />
      </q-toolbar>
    </q-header>

    <!-- Sidebar Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above side="left" bordered>
      <q-list padding>
        <q-item clickable v-ripple to="/superadmin/dashboard">
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/superadmin/manage-users">
          <q-item-section>Manage Users</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/superadmin/reports">
          <q-item-section>Reports</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/superadmin/settings">
          <q-item-section>Settings</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { logoutUser } from 'src/stores/auth'

const leftDrawerOpen = ref(false)

async function onLogout() {
  try {
    await logoutUser()
    window.location.href = '/login'
  } catch (err) {
    console.error('Logout failed:', err.message)
  }
}
</script>
