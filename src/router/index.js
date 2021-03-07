import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "@/plugins/firebaseInit";
import sites from "@/sites.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
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
    path: "/settings",
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

for (let site of sites) {
  routes.push({
    path: site.path,
    name: site.name,
    props: site,
    component: () =>
      import(/* webpackChunkName: "[request]" */ "../views/sites/Default.vue"),
    meta: {
      title: `Booketid - ${site.name}`
    }
  });
}

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
