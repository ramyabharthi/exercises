import { createRouter, createWebHistory } from 'vue-router';
import FormList from './components/FormList.vue';
import AddForm from './components/AddForm.vue';
import EditForm from './components/EditForm.vue';
import DeleteForm from './components/DeleteForm.vue';

const routes = [
  { path: '/', component: FormList },
  { path: '/add', component: AddForm },
  { path: '/edit/:index', component: EditForm },
  { path: '/delete/:index', component: DeleteForm }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
