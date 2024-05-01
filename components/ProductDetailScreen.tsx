import { StyleSheet } from 'react-native';
import type { Ingredient } from '@/types/Ingredient';
import { BarList } from './BarList';
import { CameraButton } from './CameraButton';
import { IngredientBar } from './IngredientBar';
import { ProductOverview } from './ProductOverview';
import { View, Text } from './Themed';
import { addToHistory } from '@/storage/store';
import { getHistoryData } from '@/utils/dataMapper';
import { fetchProductData } from '@/utils/network';
import { useEffect } from 'react';
import useSWR from 'swr';
import { NoBarcodeScanned } from './NoBarcodeScanned';
import { OverviewScreenSkeleton } from './Skeletons/OverviewScreenSkeleton';
import { useProductStore } from '@/storage/productData';

type ProductDetailScreenProps = {
  barcode: string;
  isScanPage: boolean;
};

export const ProductDetailScreen = ({ barcode, isScanPage }: ProductDetailScreenProps) => {
  const { setActiveProduct } = useProductStore();
  const { data: productData, isLoading, error } = useSWR(barcode, fetchProductData);

  useEffect(() => {
    if (!isScanPage) return;
    setActiveProduct(productData);
    addToHistory(getHistoryData(productData));
  }, [productData]);

  if (!barcode && isScanPage) return <NoBarcodeScanned />;

  if (isLoading) return <OverviewScreenSkeleton />;

  if (!productData || error) return <Text>Something went wrong...</Text>;

  const { ingredients, imgUrl, nutrients, productName, scores } = productData;

  return (
    <View style={styles.container}>
      <ProductOverview
        imgUrl={imgUrl}
        productName={productName}
        nutrients={nutrients}
        {...scores}
      />
      <View style={styles.ingredientContainer}>
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
      </View>
      {isScanPage && <CameraButton style={styles.cameraButton} />}
    </View>
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
