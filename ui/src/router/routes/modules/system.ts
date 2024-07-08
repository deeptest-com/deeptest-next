import type { AppRouteModule } from '@/router/types';

import {LAYOUT_MANAGEMENT} from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT_MANAGEMENT,
  redirect: '/system/project',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.system.admin'),
  },
  children: [
    {
      path: 'project',
      name: 'Project',
      component: () => import('@/views/system/project/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.system.project'),
      },
    },
    {
      path: 'tenant',
      name: 'Tenant',
      component: () => import('@/views/system/tenant/index.vue'),
      meta: {
        title: t('routes.system.tenant'),
      },
    },
  ],
};

export default system;
