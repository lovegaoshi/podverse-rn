import React from 'react'
import { StyleSheet } from 'react-native'
import { readableDate } from '../lib/utility'
import { PV } from '../resources'
import { button } from '../styles'
import { Divider, Icon, SubscribeButton, Text, View } from './'

type Props = {
  createdBy?: string
  handleEditPress?: any
  handleToggleSubscribe?: any
  id: string
  isSubscribed?: boolean
  itemCount: number
  lastUpdated: string
  title: string
}

export const PlaylistTableHeader = (props: Props) => {
  const { createdBy, handleEditPress, handleToggleSubscribe, id, isSubscribed, itemCount, lastUpdated,
    title } = props

  return (
    <View>
      <View style={styles.wrapper}>
        <View style={styles.textWrapper}>
          <Text
            numberOfLines={1}
            style={styles.title}>{title}</Text>
          {
            !!createdBy &&
              <Text
                isSecondary={true}
                numberOfLines={1}
                style={styles.createdBy}>by: {createdBy}</Text>
          }
          <View style={styles.row}>
            <Text
              isSecondary={true}
              numberOfLines={1}
              style={styles.itemCount}>
              items: {itemCount}
            </Text>
            <Text
              isSecondary={true}
              style={styles.lastUpdated}>
              {readableDate(lastUpdated)}
            </Text>
          </View>
        </View>
        {
          handleEditPress &&
            <Icon
              name='pencil-alt'
              onPress={() => handleEditPress(id)}
              size={26}
              style={button.iconOnlyMedium} />
        }
        {
          handleToggleSubscribe &&
            <SubscribeButton
              handleToggleSubscribe={handleToggleSubscribe}
              isSubscribed={isSubscribed} />
        }
      </View>
      <Divider />
    </View>
  )
}

const styles = StyleSheet.create({
  buttonView: {
    alignItems: 'center',
    flex: 0,
    justifyContent: 'center',
    marginLeft: 8
  },
  createdBy: {
    fontSize: PV.Fonts.sizes.sm,
    marginTop: 3
  },
  itemCount: {
    flex: 1,
    fontSize: PV.Fonts.sizes.sm,
    marginTop: 4
  },
  lastUpdated: {
    flex: 0,
    fontSize: PV.Fonts.sizes.sm,
    marginTop: 4
  },
  moreButton: {
    flex: 0,
    marginBottom: 'auto',
    marginTop: 'auto'
  },
  moreButtonImage: {
    borderColor: 'white',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    tintColor: 'white',
    width: 44
  },
  row: {
    flexDirection: 'row'
  },
  textWrapper: {
    flex: 1,
    marginRight: 8
  },
  title: {
    flex: 0,
    fontSize: PV.Fonts.sizes.lg,
    fontWeight: PV.Fonts.weights.bold
  },
  wrapper: {
    flexDirection: 'row',
    padding: 8
  }
})
