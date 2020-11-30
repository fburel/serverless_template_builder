import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import FourOhFour from "@/views/404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "*",
    name: "404",
    component: FourOhFour
  }
];

// router.beforeEach((to, from, next) => {
//   /**
//    * if the page requieres the user to be logged in and he is not, redirect to login page
//    */
//   if (
//     to.matched.some(record => record.meta.requiresAuth) &&
//     localStorage.getItem("token") === null
//   ) {
//     next({
//       path: "/login",
//       params: { nextUrl: to.fullPath }
//     });
//   } else if (
//     /**
//      * if page requieres to be an admin  and the user is not, redirect to 404
//      */
//     to.matched.some(record => record.meta.requiresAuth) &&
//     localStorage.getItem("admin") !== "1"
//   ) {
//     next("Home");
//   } else {
//     next();
//   }
// });


const router = new VueRouter({
  routes
});


export default router;
