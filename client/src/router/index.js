import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeLayout from "@/layouts/HomeLayout.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import {useRestaurantStore} from "@/stores/restaurantState.js";
import OrderView from "@/views/Order/OrderView.vue";
import MenuView from "@/views/Order/MenuView.vue";
import {useOrderStore} from "@/stores/orderState.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:restaurantId',
      props: true,
      component: HomeLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'order',
          name: 'order',
          component: OrderView,
        },
        {
          path: 'menu',
          name: 'menu',
          component: MenuView,
          props: true,
        }
        ]
    },
    {
      path: '/:pathMatch(.*)*', // 404
      name: 'not-found',
      component: NotFoundView,
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const restaurantStore = useRestaurantStore();
  const orderStore = useOrderStore();
  const restaurantId = to.params.restaurantId;

  // Check for missing restaurantId param
  if (!restaurantId && to.matched.some((record) => record.path.includes(':restaurantId'))) {
    return next({ name: 'not-found' });
  }

  // Load restaurant data
  if (restaurantId) {
    try {
      await restaurantStore.getRestaurantData(restaurantId);
    } catch (error) {
      console.error('Error loading restaurant data:', error);
      return next({ name: 'not-found' });
    }
  }

  if (to.name === 'order') {
    if (orderStore.number !== null) {
      return next({ name: 'menu', params: { restaurantId } });
    }
  }

  // Additional logic for 'menu' route
  if (to.name === 'menu') {
    if (orderStore.number === null) {
      return next({ name: 'order', params: { restaurantId } });
    }

    try {
      await restaurantStore.getAvailableMenus();
    } catch (error) {
      console.error('Error loading available menus:', error);
      return next({ name: 'not-found' });
    }
  }

  next();
});

export default router
