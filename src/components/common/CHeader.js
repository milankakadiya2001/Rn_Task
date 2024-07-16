import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CText from './CText';

// Local Imports
import {moderateScale} from '../../common/constants';
import {colors, styles} from '../../themes';

export default function CHeader(props) {
  const {title, onPressBack, rightIcon = false, leftIcon = false} = props;
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();
  return (
    <View style={localStyles.container}>
      {leftIcon ? (
        leftIcon
      ) : (
        <TouchableOpacity
          style={localStyles.backIconStyle}
          onPress={onPressBack || goBack}>
          <Ionicons
            name="chevron-back-outline"
            size={moderateScale(24)}
            color={colors.textColor}
          />
        </TouchableOpacity>
      )}
      <CText
        numberOfLines={1}
        align={'center'}
        style={localStyles.titleText}
        type={'S16'}>
        {title}
      </CText>
      {!!rightIcon ? (
        rightIcon
      ) : (
        <View style={localStyles.rightContainer}></View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv15,
  },
  titleText: {
    ...styles.ph20,
  },
  rightContainer: {
    height: moderateScale(36),
    width: moderateScale(36),
  },
  backIconStyle: {
    height: moderateScale(36),
    width: moderateScale(36),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(18),
    borderColor: colors.bColor,
    ...styles.center,
  },
});
