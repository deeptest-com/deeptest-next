export interface SettingsType {
  siteTokenKey: string;
  ajaxHeadersTokenKey: string;
  eventNotify: string;
  notificationKeyCommon: string;
  ajaxResponseNoVerifyUrl: string[];
}

const settings: SettingsType = {
  siteTokenKey: 'admin_antd_vue_token',
  ajaxHeadersTokenKey: 'Authorization',
  eventNotify: 'eventNotify',
  notificationKeyCommon: 'notification_common',
  ajaxResponseNoVerifyUrl: [
    '/user/login',
  ],
};

export default settings;
