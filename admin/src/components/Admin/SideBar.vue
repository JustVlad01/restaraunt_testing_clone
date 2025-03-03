<script setup>
import SubList from "@/components/Admin/SubList.vue";
import axios from "axios";
import {onMounted, ref} from "vue";
import UserProfile from "@/components/Admin/SideBar/UserProfile.vue";

const emit = defineEmits(['toggle-sidebar','close-sidebar']); // Emit event to parent

const handleToggle = () => {
  emit('toggle-sidebar'); // Emit the event to toggle sidebar
};

const closeSidebar = () => {
  emit('close-sidebar'); // Emit the event to close sidebar
};

const handleLinkClick = (event) => {
  if (window.innerWidth <= 768 && event.target.closest('a')) {
    closeSidebar();
  }
};

const clientUrl = ref("");

const getClientRedirectLink = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/redirect/client-redirect`, {
      withCredentials: true,
    });
    clientUrl.value = response.data.clientUrl;
  } catch (error) {
    console.error("Error getting client redirect link:", error.response?.data || error.message);
  }
};

getClientRedirectLink();
</script>

<template>
  <div class="side-bar">
    <div class="close-btn" @click="handleToggle">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"></path>
      </svg>
    </div>
    <h2><span>O</span><span>R</span><span>M</span><span>S</span></h2>
    <ul @click="handleLinkClick">
      <li><router-link to="/admin/dashboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer2" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4M3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.39.39 0 0 0-.029-.518z"></path>
        <path fill-rule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A8 8 0 0 1 0 10m8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3"></path>
      </svg><span>Dashboard</span></router-link></li>
      <li><router-link to="/admin/users"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"></path>
      </svg><span>Users</span></router-link></li>
      <li><router-link to="/admin/news"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-newspaper" viewBox="0 0 16 16">
        <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5z"></path>
        <path d="M2 3h10v2H2zm0 3h4v3H2zm0 4h4v1H2zm0 2h4v1H2zm5-6h2v1H7zm3 0h2v1h-2zM7 8h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2zm-3 2h2v1H7zm3 0h2v1h-2z"></path>
      </svg><span>News</span></router-link></li>
      <li><router-link to="/admin/menu/all"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-menu-down" viewBox="0 0 16 16">
        <path d="M7.646.146a.5.5 0 0 1 .708 0L10.207 2H14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h3.793zM1 7v3h14V7zm14-1V4a1 1 0 0 0-1-1h-3.793a1 1 0 0 1-.707-.293L8 1.207l-1.5 1.5A1 1 0 0 1 5.793 3H2a1 1 0 0 0-1 1v2zm0 5H1v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM2 4.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"></path>
      </svg><span>Menu</span></router-link></li>
      <li><router-link to="/admin/statistics"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart" viewBox="0 0 16 16">
        <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"></path>
      </svg><span>Statistics</span></router-link></li>
      <li><router-link to="/admin/tables"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-columns-gap" viewBox="0 0 16 16">
        <path d="M6 1v3H1V1zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm14 12v3h-5v-3zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM6 8v7H1V8zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm14-6v7h-5V1zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z"></path>
      </svg><span>Tables</span></router-link></li>
      <li><router-link to="/admin/orders"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-text" viewBox="0 0 16 16">
        <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"></path>
        <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"></path>
      </svg><span>Orders</span></router-link></li>
      <li><router-link to="/admin/permissions"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-lock2" viewBox="0 0 16 16">
        <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0M7 7v1h2V7a1 1 0 0 0-2 0"></path>
        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"></path>
      </svg><span>Permissions</span></router-link></li>
      <li class="app-redirect"><a :href="clientUrl"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-phone" viewBox="0 0 16 16">
        <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
        <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
      </svg><span>App</span></a></li>
    </ul>
    <user-profile/>
  </div>
</template>

<style scoped>
.app-redirect a{
  background-color: #374161;
  color: white;
  border-radius: 5px;
  transition: all 0.3s;
}

.app-redirect a:hover{
  background-color: #545962 !important;
  outline-offset: 0;
  transition: all 0.3s;
}

/* Style for the sidebar */
.side-bar {
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: #0A121A;
  color: white;
  width: 50px;
  z-index: 20;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: left 0.3s ease, width 0.3s ease;
}

.side-bar.open {
  left: 0;
  width: 200px;
  display: unset;
  transition: left 0.3s ease, width 0.3s ease;
}

ul {
  list-style: none;
  padding: 0;
  width: 100%;
  margin-top: 30px;
  user-select: none;
}

h2{
  width: max-content;
  font-weight: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 20px;
  margin-top: 40px;
  transition: all 0.3s;
}

.side-bar h2 span:not(:nth-child(3)){
  font-size: 23px;
}

.side-bar.open h2 span:not(:nth-child(3)){
  font-size: 35px;
}

.side-bar.open h2{
  flex-direction: row;
  font-size: 35px !important;
  margin-top: 0;
  transition: all 0.3s;
}

.side-bar.open .bi-x-lg{
  display: block;
}

.side-bar.open .bi-list{
  display: none;
}

.side-bar .bi-x-lg{
  display: none;
}

.side-bar .bi-list{
  display: block;
}

ul > li:not(:last-child){
  margin-bottom: 10px;
}

ul > li > a{
  display: flex;
  align-items: center;
  color: #555A62;
  padding: 7px;
}

ul > li > a > span{
  display: none;
}

.side-bar.open ul > li > a > span{
  display: block;
}

ul > li > a.router-link-exact-active{
  background-color: #16212C;
  color: white;
}

ul > li > a:not(.router-link-exact-active):hover{
  background-color: #16212C;
  color: white;
}

.side-bar.open ul > li svg{
  margin-right: 10px;
}

.close-btn {
  position: absolute;
  top: 10px;
  background-color: #16212C;
  cursor: pointer;
  width: 16px;
  height: 16px;
  padding: 3px;
  box-sizing: content-box;
  border-radius: 5px;
  transition: right 0.3s ease;
}

.side-bar.open .close-btn {
  right: 10px;
  transition: right 0.3s ease;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.43);
}

@media screen and (max-width: 768px) {
  .side-bar {
    z-index: 20;
    width: 50px;
    transition: left 0.3s ease, width 0.3s ease;
  }

  .side-bar.open {
    width: 100%;
    transition: left 0.3s ease, width 0.3s ease;
  }
}
</style>
