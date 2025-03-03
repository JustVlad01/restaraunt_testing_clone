<template>
  <div class="menu-group">
    <div class="menu-header">
      <h4>{{ menu.title }}</h4>
<!--      <p>{{ menu.timeRange.start }} - {{ menu.timeRange.end }}</p>-->
    </div>

    <div v-for="category in Object.values(categories)"
         :key="category.category._id"
         class="category-group">
      <h3>{{ category.category.name }}</h3>
<!--      <p class="category-description">{{ category.category.description }}</p>-->

      <div class="items-list">
        <div v-for="item in category.items"
             :key="item._id"
             class="cart-item">
          <div class="item-info">
            <img v-if="item.imageURL" :src="item.imageURL" class="item-image">
            <div>
              <h4>{{ item.title }}</h4>
              <span>€{{item.price}}</span>
              <p v-if="item.comments.length" class="comments">
                Notes: {{ item.comments.join(', ') }}
              </p>
            </div>
          </div>

          <div class="quantity-controls">
            <button @click="updateQuantity(item._id, -1)">−</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item._id, 1)">+</button>
          </div>

          <div class="item-price">
            €{{ (item.price * item.quantity).toFixed(2) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useCartStore} from "@/stores/cartState.js";

const props = defineProps({
  menu: Object,
  categories: Object
});

const cartStore = useCartStore();

const updateQuantity = async (productId, delta) => {
  await cartStore.addItem(productId, delta);
};
</script>

<style scoped>
.menu-group {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow: hidden;
  transition: transform 0.2s ease;


  .menu-header {
    background: linear-gradient(135deg, #3298ff 0%, #5badff 100%);
    padding: 1.1rem 2rem;
    border-bottom: 2px solid #dee2e6;

    h4 {
      margin: 0;
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .time-range {
      color: #6c757d;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
  }

  .category-group {
    padding: 1.5rem 2rem;

    &:not(:last-child) {
      border-bottom: 1px solid #f1f3f5;
    }

    .category-header {
      margin-bottom: 1.5rem;

      h4 {
        margin: 0;
        color: #404040;
        font-size: 1.2rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        &::before {
          content: '';
          display: block;
          width: 4px;
          height: 1.2rem;
          background: #4a9dff;
          border-radius: 2px;
        }
      }

      .category-description {
        color: #868e96;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        line-height: 1.4;
      }
    }

    .cart-item {
      display: grid;
      grid-template-columns: auto 150px 120px;
      gap: 1.5rem;
      align-items: center;
      padding: 1rem 0;

      &:not(:last-child) {
        border-bottom: 1px solid #f8f9fa;
      }

      .item-info {
        display: flex;
        align-items: center;
        gap: 1.25rem;

        .item-image {
          width: 72px;
          height: 72px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .item-details {
          h4 {
            margin: 0;
            color: #343a40;
            font-size: 1rem;
            font-weight: 500;
          }

          .comments {
            color: #6c757d;
            font-size: 0.85rem;
            margin-top: 0.25rem;
            font-style: italic;
          }
        }
      }

      .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        button {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          background: #f1f3f5;
          color: #495057;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: #4a9dff;
            color: white;
            transform: scale(1.05);
          }

          &:active {
            transform: scale(0.95);
          }
        }

        span {
          min-width: 30px;
          text-align: center;
          font-weight: 500;
          color: #212529;
        }
      }

      .item-price {
        text-align: right;
        font-weight: 600;
        color: #2b2d42;
        font-size: 1.1rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .menu-group {
    border-radius: 8px;
    margin-bottom: 1.5rem;

    .menu-header {
      padding: 1rem 1.5rem;
    }

    .category-group {
      padding: 1rem 1.5rem;

      .cart-item {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1.25rem 0;

        .item-info {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;

          .item-image {
            width: 100%;
            height: 120px;
          }
        }

        .quantity-controls {
          justify-content: space-between;
          order: 2;
        }

        .item-price {
          text-align: left;
          order: 3;
        }
      }
    }
  }
}
</style>