<template>
  <q-page class="q-pa-md">
    <h1>OJT Tracker Test</h1>

    <div v-if="students.length">
      <q-list bordered separator>
        <q-item v-for="student in students" :key="student.id">
          <q-item-section> {{ student.name }}</q-item-section>
          <q-item-section side> {{ student.hours }} hours</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-else>
      <q-banner class="bg-grey-3 text-dark q-mt-md"> No students found in Firebase. </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from 'src/firebase/index'
import { collection, getDocs } from 'firebase/firestore'

const students = ref([])

onMounted(async () => {
  try {
    const snapshot = await getDocs(collection(db, 'students'))
    students.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    console.log('Fetched students: ', students.value)
  } catch (error) {
    console.error('Error fetching students: ', error)
  }
})
</script>
