import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/plugins/firebaseInit";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/site",
    name: "Site",
    component: () => import(/* webpackChunkName: "site" */ "../views/Site.vue")
  },
  {
    path: "/dashboard/login",
    name: "AdminLogin",
    component: () =>
      import(/* webpackChunkName: "admin_login" */ "../views/AdminLogin.vue")
  },
  {
    path: "/dashboard",
    name: "AdminDashboard",
    component: () =>
      import(
        /* webpackChunkName: "admin_dashboard" */ "../views/AdminDashboard.vue"
      ),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dashboard/settings",
    name: "AdminSettings",
    component: () =>
      import(
        /* webpackChunkName: "admin_settings" */ "../views/AdminSettings.vue"
      ),
    meta: {
      requiresAuth: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    next("/dashboard/login");
  } else if (to.name == "AdminLogin" && auth.currentUser) {
    next("/dashboard/");
  } else {
    next();
  }
});

export default router;
