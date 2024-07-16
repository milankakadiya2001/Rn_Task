import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CText from '../common/CText';
import strings from '../../i18n/strings';
import {colors, styles} from '../../themes';
import {next10Days} from '../../api/jsonData';
import {moderateScale} from '../../common/constants';
import {requestApi} from '../../api/apiService';
import {PLAY_URL} from '../../api/constants';
import CLoader from '../common/CLoader';

export default function Play() {
  const [selectedDate, setSelectedDate] = useState(next10Days[0]);
  const [loading, setLoading] = useState(false);
  const [playTimeData, setPlayTimeData] = useState([]);
  const [selectedDayTime, setSelectedDayTime] = useState({});
  const [selectedTime, setSelectedTime] = useState({});

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
    const response = await requestApi('POST', PLAY_URL, data);
    setPlayTimeData(response?.activity_types);
    if (response?.activity_types.length > 0) {
      setSelectedDayTime(response?.activity_types[0]);
      setSelectedTime(response?.activity_types[0]?.hours[0]);
    }
    setLoading(false);
  };

  const onPressDate = date => setSelectedDate(date);

  const onPressDayTime = item => {
    setSelectedDayTime(item);
    setSelectedTime(item?.hours[0]);
  };

  const onPressTime = item => setSelectedTime(item);

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

  const renderDayTime = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressDayTime(item)}
        style={[
          localStyles.dayTimeContainer,
          {
            backgroundColor:
              selectedDayTime?.name === item?.name
                ? colors.primaryMain
                : colors.backgroundColor,
          },
        ]}>
        <CText
          type={'S16'}
          color={
            selectedDayTime?.name !== item?.name
              ? colors.primaryMain
              : colors.backgroundColor
          }>
          {item?.name}
        </CText>
      </TouchableOpacity>
    );
  };

  const renderTime = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressTime(item)}
        style={[
          localStyles.timeContainer,
          {
            backgroundColor:
              selectedTime?.id === item?.id
                ? colors.primaryMain
                : colors.primaryLight,
          },
        ]}>
        <CText
          type={'S16'}
          color={
            selectedTime?.id !== item?.id
              ? colors.primaryMain
              : colors.backgroundColor
          }>
          {item?.id + ':00'}
        </CText>
      </TouchableOpacity>
    );
  };

  const renderSlots = () => {
    return (
      <View style={styles.center}>
        <TouchableOpacity style={localStyles.addIconStyle}>
          <Ionicons
            name={'add'}
            size={moderateScale(24)}
            color={colors.textColor}
          />
        </TouchableOpacity>
        <CText type={'M14'} align={'center'} style={styles.mt10}>
          {strings.empty}
        </CText>
      </View>
    );
  };

  const renderTee = ({item}) => {
    return (
      <View style={localStyles.listMainContainer}>
        <View style={localStyles.mainTitleContainer}>
          <CText type={'S16'} align={'center'} color={colors.backgroundColor}>
            {strings.teeTime + ' ' + moment(item?.start).format('HH:MM')}
          </CText>
        </View>
        <FlatList
          data={[1, 2, 3, 4]}
          renderItem={renderSlots}
          keyExtractor={item => item.toString()}
          numColumns={2}
          columnWrapperStyle={styles.rowSpaceAround}
          scrollEnabled={false}
        />
        <View style={localStyles.priceContainer}>
          <CText
            type={'B16'}
            style={styles.ph20}
            color={colors.primaryMain}
            align={'center'}>
            {item?.price?.display + ' pp'}
          </CText>
        </View>
      </View>
    );
  };

  const renderTeeComponent = ({item}) => {
    return (
      <View>
        <CText type={'B18'} style={localStyles.titleStyle}>
          {item?.type_name}
        </CText>
        {item?.events && (
          <FlatList
            data={item?.events}
            renderItem={renderTee}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    );
  };

  return (
    <View style={localStyles.mainContainer}>
      <CText type={'B18'} style={localStyles.titleStyle}>
        {strings.details}
      </CText>
      <FlatList
        data={next10Days}
        renderItem={renderDate}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={localStyles.dateFlatList}
      />
      <View style={localStyles.bottomContainer}>
        <FlatList
          data={playTimeData}
          renderItem={renderDayTime}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={localStyles.dateFlatList}
        />
        <FlatList
          data={selectedDayTime?.hours}
          renderItem={renderTime}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={localStyles.dateFlatList}
        />
        {selectedTime?.resources?.length > 0 && (
          <FlatList
            data={selectedTime?.resources}
            renderItem={renderTeeComponent}
            keyExtractor={item => item?.id.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        )}
      </View>
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
  listMainContainer: {
    ...styles.mh20,
    ...styles.selfStart,
    backgroundColor: colors.backgroundColor,
    borderRadius: moderateScale(16),
    marginTop: moderateScale(10),
  },
  mainTitleContainer: {
    ...styles.pv15,
    ...styles.ph10,
    backgroundColor: colors.primaryMain,
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
  },
  addIconStyle: {
    ...styles.center,
    ...styles.mt10,
    borderWidth: moderateScale(1),
    borderStyle: 'dashed',
    borderRadius: moderateScale(21),
    height: moderateScale(42),
    width: moderateScale(42),
    borderColor: colors.btnDisabled,
  },
  priceContainer: {
    ...styles.pv15,
    ...styles.mh5,
    ...styles.mt10,
    borderTopWidth: moderateScale(1),
    borderTopColor: colors.bColor,
  },
  timeContainer: {
    ...styles.ph15,
    ...styles.pv15,
    ...styles.mr10,
    backgroundColor: colors.primaryLight,
    borderRadius: moderateScale(16),
  },
  bottomContainer: {
    ...styles.flex,
    ...styles.mb40,
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
});
