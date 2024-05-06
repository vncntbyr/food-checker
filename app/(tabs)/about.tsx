import { StyleSheet, View as ContainerView } from 'react-native';

import { NavigationGroup } from '@/components/about/NavigationGroup';
import { NavigationBar } from '@/components/about/NavigationBar';
import { icons } from '@/constants/Icons';
import { useTranslation } from '@/hooks/useTranslation';

export default function AboutScreen() {
  const t = useTranslation();
  return (
    <ContainerView style={styles.container}>
      <NavigationBar icon={icons.user} shadow>
        {t('about.aboutMe')}
      </NavigationBar>
      <NavigationGroup>
        <NavigationBar icon={icons.data}>{t('about.dataUsage')}</NavigationBar>
        <NavigationBar icon={icons.analytics}>{t('about.analytics')}</NavigationBar>
      </NavigationGroup>

      <NavigationGroup>
        <NavigationBar icon={icons.terms}>{t('about.terms')}</NavigationBar>
        <NavigationBar icon={icons.privacy}>{t('about.privacy')}</NavigationBar>
      </NavigationGroup>

      <NavigationGroup>
        <NavigationBar icon={icons.contact}>{t('about.contact')}</NavigationBar>
        <NavigationBar icon={icons.coffee}>{t('about.coffee')}</NavigationBar>
      </NavigationGroup>
    </ContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
