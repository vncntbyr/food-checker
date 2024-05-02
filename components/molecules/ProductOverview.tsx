import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { View, Text } from '@/components/atoms/Themed';
import { ScoreDisplay } from './ScoreDisplay';
import { useTranslation } from '@/hooks/useTranslation';
import { ShadowView } from '../atoms/ShadowView';
import type { NovaScore, NutriScore, PlantScore } from '@/types/Scores';
import { getBackgroundColor } from '@/utils/color';

type ProductOverviewProps = {
  imgUrl: string;
  productName: string;
  nutrients: Record<string, number>;
  nutriScore?: NutriScore;
  novaScore?: NovaScore;
  plantScore?: PlantScore;
};

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

// TODO: Images can be really small -> maybe implement modal with large image on click.
// TODO: Sometimes there is no nutrition score data -> handle this case
// TODO: kcals are also not always present -> handle this case
export const ProductOverview = ({
  imgUrl,
  productName,
  nutrients,
  nutriScore,
  novaScore,
  plantScore,
}: ProductOverviewProps) => {
  const t = useTranslation();
  const { energyKcal, energyKcalUnit } = nutrients;
  return (
    <ShadowView style={styles.overviewContainer}>
      <View style={styles.imageTitleContainer}>
        <Image style={styles.image} source={imgUrl} placeholder={blurhash} contentFit="contain" />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{productName}</Text>
          <Text>
            {energyKcal} {energyKcalUnit} / 100g
          </Text>
        </View>
      </View>
      <View style={styles.scoreContainer}>
        {novaScore!! && (
          <ScoreDisplay
            score={novaScore.value}
            color={getBackgroundColor(novaScore.color) ?? 'white'}
            scoreTitle={t('scores.processedGrade')}
          />
        )}
        {nutriScore!! && (
          <ScoreDisplay
            score={nutriScore.value}
            color={nutriScore.color ?? 'white'}
            scoreTitle={t('scores.nutrition')}
          />
        )}
        {plantScore!! && (
          <ScoreDisplay
            score={plantScore.value}
            color={getBackgroundColor(plantScore.color) ?? 'white'}
            scoreTitle={t('scores.plantGrade')}
          />
        )}
      </View>
    </ShadowView>
  );
};

const styles = StyleSheet.create({
  overviewContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 16,
    width: '90%',
  },
  imageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    minWidth: 96,
    maxWidth: 96,
    minHeight: 96,
    maxHeight: 96,
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 94,
    paddingLeft: 32,
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
  },
});
