import type { AppRouteModule } from '@/router/types';

import {LAYOUT_MANAGEMENT} from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const management: AppRouteModule = {
  path: '/management',
  name: 'Management',
  component: LAYOUT_MANAGEMENT,
  redirect: '/management/case',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.management.admin'),
  },
  children: [
    {
      path: 'case',
      name: 'Case',
      component: () => import('@/views/management/case/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.management.case'),
      },
    },
    {
      path: 'suite',
      name: 'Suite',
      component: () => import('@/views/management/suite/index.vue'),
      meta: {
        title: t('routes.management.suite'),
      },
    },
    {
      path: 'plan',
      name: 'Plan',
      component: () => import('@/views/management/plan/index.vue'),
      meta: {
        title: t('routes.management.plan'),
      },
    },
  ],
};

export default management;
