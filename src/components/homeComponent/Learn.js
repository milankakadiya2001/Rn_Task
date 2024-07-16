import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';

// Local Imports
import {next10Days} from '../../api/jsonData';
import {requestApi} from '../../api/apiService';
import {LEARN_URL} from '../../api/constants';
import CText from '../common/CText';
import {colors, styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';
import CLoader from '../common/CLoader';

export default function Learn() {
  const [selectedDate, setSelectedDate] = useState(next10Days[0]);
  const [loading, setLoading] = useState(false);
  const [learnData, setLearnData] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);

  useEffect(() => {
    getPlayData();
  }, [selectedDate]);

  const getPlayData = async () => {
    const data = {
      date: moment(selectedDate?.date).format('YYYY-MM-DD'),
      activity_category_id: 1,
      min_price: 0,
      max_price: 0,
      location_id: 94,
    };
    setLoading(true);
    const response = await requestApi('POST', LEARN_URL, data);
    setLearnData(response?.resource_types);
    setSelectedClass(response?.resource_types[0]);
    setLoading(false);
  };

  const onPressDate = date => setSelectedDate(date);

  const onPressClass = itm => setSelectedClass(itm);

  const renderDate = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressDate(item)}
        style={[
          localStyles.dateContainer,
          {
            backgroundColor:
              selectedDate?.date === item?.date
                ? colors.primaryMain
                : colors.backgroundColor,
          },
        ]}>
        <CText
          type={'S16'}
          color={
            selectedDate?.date !== item?.date
              ? colors.primaryMain
              : colors.backgroundColor
          }>
          {moment(item?.date).format('ddd, DD MMM')}
        </CText>
      </TouchableOpacity>
    );
  };

  const renderClass = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressClass(item)}
        style={[
          localStyles.dayTimeContainer,
          {
            backgroundColor:
              selectedClass?.name === item?.name
                ? colors.primaryMain
                : colors.backgroundColor,
          },
        ]}>
        <CText
          type={'S16'}
          color={
            selectedClass?.name !== item?.name
              ? colors.primaryMain
              : colors.backgroundColor
          }>
          {item?.name}
        </CText>
      </TouchableOpacity>
    );
  };

  const renderList = ({item}) => (
    <View style={localStyles.listMainContainer}>
      <CText type={'B22'} style={styles.mt15}>
        {item?.resource}
      </CText>
      <CText type={'S18'} color={colors.textSecondary} style={styles.mt10}>
        {item?.location}
      </CText>
      <RenderDescription title={strings.coach} desc={item?.account_name} />
      <RenderDescription
        title={strings.date}
        desc={moment(item?.start_time).format('ddd, DD MMM, hh:mm')}
      />
      <RenderDescription title={strings.description} desc={item?.description} />
      <View style={localStyles.footerContainer}>
        <View style={localStyles.privateClassContainer}>
          <CText type={'S14'} color={colors.backgroundColor}>
            {strings.privateClass}
          </CText>
        </View>
        <View style={localStyles.priceContainer}>
          <CText type={'S14'} color={colors.backgroundColor}>
            {item?.price?.display}
          </CText>
        </View>
      </View>
    </View>
  );

  const RenderDescription = ({title, desc}) => (
    <CText type={'S16'} color={colors.textSecondary} style={styles.mt5}>
      {title}:{' '}
      <CText type={'M16'} color={colors.textSecondary} style={styles.mt5}>
        {desc}
      </CText>
    </CText>
  );

  return (
    <View style={localStyles.mainContainer}>
      <FlatList
        data={next10Days}
        renderItem={renderDate}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={localStyles.dateFlatList}
      />
      <FlatList
        data={learnData}
        renderItem={renderClass}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={localStyles.dateFlatList}
      />
      <FlatList
        data={selectedClass?.events}
        renderItem={renderList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={styles.pb20}
      />
      {loading && <CLoader />}
    </View>
  );
}

const localStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.textTertiary,
  },
  titleStyle: {
    ...styles.ph20,
    ...styles.mt15,
  },
  dateContainer: {
    ...styles.ph20,
    ...styles.pv10,
    ...styles.mr10,
    backgroundColor: colors.backgroundColor,
    borderWidth: moderateScale(2),
    borderColor: colors.primaryMain,
    borderRadius: moderateScale(22),
  },
  dateFlatList: {
    ...styles.ph20,
    ...styles.mv10,
  },
  dayTimeContainer: {
    ...styles.ph35,
    ...styles.pv10,
    ...styles.mr10,
    backgroundColor: colors.backgroundColor,
    borderWidth: moderateScale(2),
    borderColor: colors.primaryMain,
    borderRadius: moderateScale(22),
  },
  listMainContainer: {
    ...styles.ph20,
    ...styles.mt15,
    ...styles.mh20,
    backgroundColor: colors.backgroundColor,
    borderRadius: moderateScale(14),
  },
  footerContainer: {
    borderTopWidth: moderateScale(1),
    borderTopColor: colors.bColor,
    ...styles.mt15,
    ...styles.pv15,
    ...styles.rowSpaceBetween,
  },
  privateClassContainer: {
    ...styles.ph20,
    ...styles.ph10,
    ...styles.pv5,
    backgroundColor: colors.textGray,
    borderRadius: moderateScale(8),
  },
  priceContainer: {
    ...styles.ph20,
    ...styles.ph10,
    ...styles.pv5,
    backgroundColor: colors.primaryMain,
    borderRadius: moderateScale(14),
  },
});
