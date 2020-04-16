import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login";
import Realtime from "../components/Realtime";
import History from "../components/History";
import Equipment from "../components/Equipment";
import Person from "../components/Person";
import Home from "../components/Home";
// import Homemap from "../components/Homemap"
Vue.use(VueRouter);
export default new VueRouter({
    routes: [
        { path: "/home", component: Home },
				// { path: "/homemap", component: Homemap },
        { path: "/realtime", component: Realtime },
        { path: "/history", component: History },
        { path: "/equipment", component: Equipment },
        { path: "/person", component: Person},
        { path: "/login", component: Login},
         { path: "*", redirect: "/home" }
    ],
    mode: 'hash',
    scrollBehavior (to, from, savedPosition){
	    if (savedPosition) {
	      return savedPosition
	    } else {
	      return { x: 0, y: 0 }
	    }
	  }
})