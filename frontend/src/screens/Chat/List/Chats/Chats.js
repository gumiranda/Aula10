/* eslint-disable no-restricted-syntax */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Background from '../../../../components/Background/Background';
import {Container, Left, Avatar, Info, Name, CardUser, List} from '../styles';
import {getRequest, reset} from '../../../../appStore/appModules/chat/list';
import {appColors} from '../../../../utils/appColors';

export default function Chats({navigation}) {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const {chatsList, chatsLoading, chatsPage, chatsTotal} = useSelector(
    state => state.chat,
  );
  const profile = useSelector(state => state.user.profile);

  useEffect(() => {
    async function getChats() {
      dispatch(getRequest({page: 1}));
    }
    getChats();
  }, []);
  useEffect(() => {
    if (!chatsLoading) {
      setLoading(false);
      setFirstLoading(false);
    }
  }, [chatsLoading]);
  const onEndReached = () => {
    if (
      !firstLoading &&
      !chatsLoading &&
      !loading &&
      chatsPage * 10 < chatsTotal
    ) {
      setLoading(true);
      dispatch(getRequest({page: chatsPage + 1, nextPage: true}));
    }
    return true;
  };
  async function refresh() {
    dispatch(reset());
    dispatch(getRequest({page: 1}));
  }
  async function chamaNoChat(item) {
    navigation.push('ChatDetails', {
      chatId: item._id,
      destinatario:
        item.userDest._id === profile._id ? item.userRemet : item.userDest,
    });
    refresh();
  }
  return (
    <Background>
      <Container>
        {(chatsLoading || loading) && (
          <ActivityIndicator size="large" color={appColors.white} />
        )}
        {!firstLoading && (
          <List
            data={chatsList || []}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            refreshing={refreshing}
            onRefresh={() => refresh()}
            keyExtractor={item => String(item._id)}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => chamaNoChat(item)}>
                <CardUser>
                  <Left>
                    <Avatar
                      source={{
                        uri: item.photo_url,
                      }}
                    />
                    <Info>
                      <Name>
                        {item.userDest._id === profile._id
                          ? item.userRemet.nome
                          : item.userDest.nome}
                      </Name>
                    </Info>
                  </Left>
                </CardUser>
              </TouchableOpacity>
            )}
          />
        )}
      </Container>
    </Background>
  );
}
