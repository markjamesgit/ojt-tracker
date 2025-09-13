import MainLayout from 'layouts/MainLayout.vue'
import SuperAdminLayout from 'layouts/SuperAdminLayout.vue'
import AdviserLayout from 'layouts/AdviserLayout.vue'
import StudentLayout from 'layouts/StudentLayout.vue'

import LoginPage from 'pages/LoginPage/LoginPage.vue'
import ErrorNotFound from 'pages/ErrorNotFound.vue'

// Role dashboards
import DashboardSuperAdmin from 'pages/Roles/SuperAdmin/DashboardPage.vue'
import DashboardAdviser from 'pages/Roles/Adviser/DashboardPage.vue'
import DashboardStudent from 'pages/Roles/Students/DashboardPage.vue'

const routes = [
  // Public (login + redirect)
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: LoginPage },
    ],
  },

  // Super Admin
  {
    path: '/superadmin',
    component: SuperAdminLayout,
    children: [{ path: 'dashboard', component: DashboardSuperAdmin }],
    meta: { requiresAuth: true, role: 'superadmin' },
  },

  // Adviser
  {
    path: '/adviser',
    component: AdviserLayout,
    children: [{ path: 'dashboard', component: DashboardAdviser }],
    meta: { requiresAuth: true, role: 'adviser' },
  },

  // Student
  {
    path: '/student',
    component: StudentLayout,
    children: [{ path: 'dashboard', component: DashboardStudent }],
    meta: { requiresAuth: true, role: 'student' },
  },

  // Catch all (404)
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },
]

export default routes
