import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import CHeader from '../../components/common/CHeader';
import {LikeIcon} from '../../assets/svg';
import {getHeight, moderateScale} from '../../common/constants';
import {requestApi} from '../../api/apiService';
import {IMAGE_BASE_URL, PLAY_URL} from '../../api/constants';
import CLoader from '../../components/common/CLoader';
import CText from '../../components/common/CText';
import {colors, styles} from '../../themes';
import strings from '../../i18n/strings';
import About from '../../components/homeComponent/About';
import Play from '../../components/homeComponent/Play';
import Learn from '../../components/homeComponent/Learn';

export default function HomeScreen() {
  const iconScale = moderateScale(24);
  const [homeData, setHomeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSelect, setIsSelect] = useState(strings.about);

  useEffect(() => {
    aboutAPIFunction();
  }, []);

  const aboutAPIFunction = async () => {
    const data = {
      date: '2024-07-17',
      activity_category_id: 1,
      min_price: 0,
      max_price: 0,
      location_id: 94,
    };
    setLoading(true);
    const response = await requestApi('POST', PLAY_URL, data);
    setHomeData(response);
    setLoading(false);
  };

  const onPressTab = index => {
    setIsSelect(index);
  };

  const HeaderCategoryItem = ({title}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressTab(title)}
        style={[
          localStyles.tabCategoryItem,
          {
            borderBottomColor:
              isSelect !== title ? colors.bColor : colors.primaryMain,
          },
        ]}>
        <CText
          type={'S18'}
          align={'center'}
          style={styles.pb20}
          color={isSelect !== title ? colors.textGray : colors.primaryMain}>
          {title}
        </CText>
      </TouchableOpacity>
    );
  };

  const RenderComponent = () => {
    switch (isSelect) {
      case strings.about:
        return <About />;
      case strings.play:
        return <Play />;
      case strings.learn:
        return <Learn />;
      default:
        return <About />;
    }
  };

  return (
    <CSafeAreaView>
      <CHeader rightIcon={<LikeIcon width={iconScale} height={iconScale} />} />
      <ScrollView>
        <Image
          source={{uri: IMAGE_BASE_URL + homeData?.image}}
          style={localStyles.imageStyle}
        />
        <CText type={'B28'} style={localStyles.titleStyle}>
          {homeData?.name}
        </CText>
        <View style={localStyles.locationSTyle}>
          <Ionicons
            name={'location'}
            size={moderateScale(24)}
            color={colors.primaryMain}
            style={styles.mr10}
          />
          <CText type={'M16'} color={colors.textSecondary}>
            {homeData?.address}
          </CText>
        </View>
        <View style={localStyles.tabContainer}>
          <HeaderCategoryItem title={strings.about} />
          <HeaderCategoryItem title={strings.play} />
          <HeaderCategoryItem title={strings.learn} />
        </View>
        <RenderComponent />
      </ScrollView>
      {loading && <CLoader />}
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  imageStyle: {
    height: getHeight(280),
    width: '100%',
  },
  locationSTyle: {
    ...styles.rowStart,
    ...styles.mh20,
  },
  titleStyle: {
    ...styles.ph20,
    ...styles.mv10,
  },
  tabCategoryItem: {
    borderBottomWidth: moderateScale(2),
    width: '33.33%',
  },
  tabContainer: {
    ...styles.rowStart,
    ...styles.mt20,
  },
});
