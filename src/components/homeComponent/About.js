import {FlatList, Image, StyleSheet, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import {colors, styles} from '../../themes';
import CText from '../common/CText';
import {moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';
import {aboutDetailData, facilitiesData} from '../../api/jsonData';
import image from '../../assets/image';

export default function About() {
  const RenderDescription = ({title, icon}) => {
    return (
      <View style={localStyles.descriptionContainer}>
        <Ionicons
          name={icon}
          size={moderateScale(26)}
          color={colors.textColor}
        />
        <CText type={'S14'} style={styles.mt10}>
          {title}
        </CText>
      </View>
    );
  };

  const renderDetail = ({item}) => {
    return (
      <View style={localStyles.detailContainer}>
        <Ionicons
          name={item?.icon}
          size={moderateScale(26)}
          color={colors.primaryMain}
        />
        <CText type={'M14'} style={styles.mt10}>
          {item?.title}
        </CText>
      </View>
    );
  };

  const renderFacilities = ({item}) => {
    return (
      <View style={localStyles.facilitiesContainer}>
        <Ionicons
          name={item?.icon}
          size={moderateScale(26)}
          color={colors.primaryMain}
        />
        <CText type={'M14'} style={styles.mt10}>
          {item?.title}
        </CText>
      </View>
    );
  };

  return (
    <View style={localStyles.mainContainer}>
      <View style={styles.ph15}>
        <View style={localStyles.rootContainer}>
          <RenderDescription title={strings.directions} icon={'location'} />
          <RenderDescription title={strings.website} icon={'earth'} />
          <RenderDescription title={strings.contact} icon={'call'} />
        </View>
        <CText type={'B18'} style={styles.mt15}>
          {strings.details}
        </CText>
        <FlatList
          data={aboutDetailData}
          renderItem={renderDetail}
          keyExtractor={(item, index) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal
        />
        <CText type={'B18'} style={styles.mt15}>
          {strings.description}
        </CText>
        <CText type={'M14'} style={styles.mt15}>
          {strings.descriptionDetail}
        </CText>
        <CText type={'B18'} style={styles.mt20}>
          {strings.facilities}
        </CText>
        <FlatList
          data={facilitiesData}
          renderItem={renderFacilities}
          numColumns={3}
          columnWrapperStyle={styles.rowSpaceBetween}
          keyExtractor={(item, index) => item.id.toString()}
          scrollEnabled={false}
        />
        <CText type={'B18'} style={styles.mt15}>
          {strings.facilities}
        </CText>
      </View>
      <Image source={image.mapImage} style={localStyles.mapImageStyle} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.textTertiary,
  },
  rootContainer: {
    ...styles.rowSpaceAround,
    ...styles.mv10,
  },
  descriptionContainer: {
    ...styles.center,
    ...styles.mt15,
  },
  detailContainer: {
    ...styles.center,
    ...styles.mt20,
    ...styles.mh20,
    ...styles.mb10,
  },
  facilitiesContainer: {
    ...styles.center,
    ...styles.mt20,
    ...styles.mb10,
    width: '33.33%',
  },
  mapImageStyle: {
    height: moderateScale(200),
    width: '100%',
    ...styles.mv20,
  },
});
