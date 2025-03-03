import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios";
import {useRouter} from "vue-router";

export const useSignUpStore = defineStore('signUp', () => {

  const router = useRouter(); // Initialize Vue Router

  const signUpPagesEnum = {
    WELCOME: 1,
    HOTEL: 2,
    REGISTER: 3,
    SIGNIN: 4,
  }

  const currentPage = ref(signUpPagesEnum.WELCOME);
  const verificationCode = ref(null);

  function goTo(page){
    currentPage.value = page;
  }

  function setVerificationCode(code){
    verificationCode.value = code;
  }

  // Async function to register a hotel
  async function registerHotel(data) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/hotel/create`, data);

      if (response.status === 200) {
        try {
          console.log('Redirecting...');
          router.push({ name: 'dashboard' });
        } catch (e) {
          console.error('Router push failed:', e);
        }
      }
    } catch (error) {
      console.error("Error registering hotel:", error.response?.data?.msg || error.message);
    }
  }

  return { goTo, signUpPagesEnum, currentPage, registerHotel, setVerificationCode, verificationCode }
})
