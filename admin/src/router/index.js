import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DashboardView from '@/views/AdminPages/DashboardView.vue';
import AdminLayout from "@/layouts/AdminLayout.vue";
import { authMiddleware } from "@/middleware/adminAuth.js";
import MenuView from "@/views/AdminPages/Menu/MenuView.vue";
import MenuAddView from "@/views/AdminPages/Menu/MenuAddView.vue";
import TablesView from "@/views/AdminPages/Tables/TablesView.vue";
import UserView from "@/views/AdminPages/Users/UserView.vue";
import MenuEditView from "@/views/AdminPages/Menu/MenuEditView.vue";
import OrderList from "@/views/AdminPages/Orders/OrderList.vue";
import OrderDetails from "@/views/AdminPages/Orders/OrderDetails.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: authMiddleware,
  },
  {
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard',
    beforeEnter: authMiddleware,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
      },
      {
        path: 'users',
        name: 'users',
        component: UserView,
      },
      {
        path: 'orders',
        name: 'orders',
        redirect: '/admin/orders/all',
        children: [
          {
            path: 'all',
            name: 'allOrders',
            component: OrderList,
          },
          {
            path: 'details/:id',
            name: 'orderDetails',
            component: OrderDetails,
          }
        ]
      },
      {
        path: 'menu',
        name: 'menu',
        redirect: '/admin/menu/all',
        children: [
          {
            path: 'all',
            name: 'allMenu',
            component: MenuView,
          },
          {
            path: 'edit/:id',
            name: 'editMenu',
            component: MenuEditView,
          },
          {
            path: 'add',
            name: 'addNewMenu',
            component: MenuAddView,
          }
        ]
      },
      {
        path: 'tables',
        name: 'tables',
        component: TablesView,
      }
    ],
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
