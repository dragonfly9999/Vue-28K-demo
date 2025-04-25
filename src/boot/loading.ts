import { App } from 'vue';

export default async ({ app }: { app: App }) => {
  app.config.globalProperties.$q.loading.show({
    html: true,
    spinner: null,
    message: `
      <div class="k28-loading-box">
        <div class="k28-loading-icon"></div>
        <div class="loading-text">K28 Loading......</div>
      </div>
    `,
    customClass: 'k28-loading',
  });

  setTimeout(() => {
    app.config.globalProperties.$q.loading.hide();
  }, 2000);
};
