import { StyleSheet, View as ContainerView } from 'react-native';
import type { Ingredient } from '@/types/Ingredient';
import { BarList } from '../atoms/BarList';
import { CameraButton } from '../atoms/CameraButton';
import { IngredientBar } from '../molecules/IngredientBar';
import { ProductOverview } from '../molecules/ProductOverview';
import { View, Text } from '../atoms/Themed';
import { addToHistory } from '@/storage/store';
import { getHistoryData } from '@/utils/dataMapper';
import { fetchProductData } from '@/utils/network';
import { useEffect } from 'react';
import useSWR from 'swr';
import { NoBarcodeScanned } from './NoBarcodeScanned';
import { OverviewScreenSkeleton } from '../skeletons/OverviewScreenSkeleton';
import { useProductStore } from '@/storage/productData';
import { ErrorScreen } from './ErrorScreen';

type ProductDetailScreenProps = {
  barcode: string;
  isScanPage: boolean;
};

export const ProductDetailScreen = ({ barcode, isScanPage }: ProductDetailScreenProps) => {
  // TODO: Do we need this information anywhere?
  const { setActiveProduct } = useProductStore();
  // We don't need additional state management due to SWR's smart caching per barcode. ( A map is created, which stores the data per barcode.)
  const { data: productData, isLoading, error } = useSWR(barcode, fetchProductData);
  useEffect(() => {
    if (!isScanPage) return;
    setActiveProduct(productData);
    addToHistory(getHistoryData(productData));
  }, [productData]);

  if (!barcode && isScanPage) return <NoBarcodeScanned />;

  if (isLoading) return <OverviewScreenSkeleton />;

  if (!productData || error) return <ErrorScreen />;

  const { ingredients, imgUrl, nutrients, productName, scores } = productData;

  return (
    <ContainerView style={styles.container}>
      <ProductOverview
        imgUrl={imgUrl}
        barcode={barcode}
        productName={productName}
        nutrients={nutrients}
        {...scores}
      />
      <ContainerView style={styles.ingredientContainer}>
        <Text style={styles.title}>Ingredients</Text>
        <BarList
          data={ingredients}
          renderItem={({ item }: { item: Ingredient }): JSX.Element => {
            return (
              <IngredientBar
                ingredientName={item.name}
                isVegan={item.isVegan}
                isVegetarian={item.isVegetarian}
              />
            );
          }}
        />
      </ContainerView>
      {isScanPage && <CameraButton style={styles.cameraButton} />}
    </ContainerView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 16,
  },
  ingredientContainer: {
    flex: 2,
    gap: 8,
    alignItems: 'flex-start',
    width: '90%',
  },
});