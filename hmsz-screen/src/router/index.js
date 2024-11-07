import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/',
            name: 'home',
            redirect: '/bigScreen',
            component: HomeView
        },
        {
            path: "/bigScreen",
            name: "bigScreen",
            component: () =>
                import ('../views/BigScreen.vue')
        }
    ]
})

export default router