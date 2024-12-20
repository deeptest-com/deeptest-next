import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 3000,
      title: $t('plan.title'),
      hideChildrenInMenu: true,
    },
    name: 'Plan',
    path: '/plan',
    redirect: '/plan/index',
    children: [
      {
        name: 'PlanIndex',
        path: 'index',
        component: () => import('#/views/empty/index.vue'),
        meta: {
          title: $t('plan.title'),
          icon: 'lucide:copyright',
        },
      },
    ],
  },
];

export default routes;
