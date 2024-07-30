import { useI18n } from 'vue-i18n';

type CountryCodeOptios = {
  label: string;
  value: number;
};

export default () => {
  const { t } = useI18n();
  const countryCodeOptions: Array<CountryCodeOptios> = [
    886, 852, 65, 63, 86, 84, 81
  ].map((value) => ({
    label: t(`countryCode.${value}`),
    value
  }));
  return countryCodeOptions;
};
