import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View} from 'react-native';
import {NeuView} from 'react-native-neu-element';
import {darken} from 'polished';
import {
  Asset,
  Constants,
  FileSystem,
  Permissions,
} from 'react-native-unimodules';
import {Title} from './styles';
import Background from '../../components/Background/Background';
import {appColors} from '../../utils/appColors';
import appMetrics from '../../utils/appMetrics';

export default function Home({navigation}) {
  const profile = useSelector(state => state.user.profile);
  useEffect(() => {
    console.log(Constants.systemFonts);
  }, []);
  useEffect(() => {
    if (new Date(profile.payDay).getTime() < new Date().getTime()) {
      if (profile.cpf && profile.phone) {
        navigation.navigate('Payment');
      } else {
        navigation.navigate('CompleteRegister');
      }
    }
  }, [navigation, profile.cpf, profile.payDay, profile.phone]);

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: appColors.primary,
        }}>
        <Title>Homepage do Faustão</Title>
        <NeuView
          color={appColors.primary}
          height={100}
          width={appMetrics.DEVICE_WIDTH - 80}
          borderRadius={16}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 20,
          backgroundColor: appColors.primary,
        }}>
        <NeuView
          color={appColors.primary}
          height={100}
          width={appMetrics.DEVICE_WIDTH - 80}
          borderRadius={16}
          inset
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 10,
          backgroundColor: appColors.primary,
        }}>
        <NeuView
          color={appColors.primary}
          height={100}
          width={appMetrics.DEVICE_WIDTH - 80}
          borderRadius={16}
          isConvex
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 10,
          backgroundColor: appColors.primary,
        }}>
        <NeuView
          color={appColors.primary}
          height={100}
          width={appMetrics.DEVICE_WIDTH - 80}
          borderRadius={16}
          concave
        />
      </View>
    </>
  );
}
