import produce from 'immer';

const INITIAL_STATE = {
  chatsLoading: false,
  chatsList: [],
  chatsPage: 1,
  chatsTotal: 0,
};

export default function chat(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@chat/LIST_SUCCESS': {
        draft.chatsLoading = false;
        draft.chatsTotal = action.payload.chatsTotal;
        draft.chatsList = action.payload.chatsList;
        break;
      }
      case '@chat/LIST_REQUEST': {
        draft.chatsLoading = true;
        draft.chatsTotal = 0;
        draft.chatsPage = action.payload.page;
        break;
      }
      case '@chat/LIST_FAILURE': {
        draft.chatsLoading = false;
        break;
      }
      case '@chat/RESET': {
        draft.chatsLoading = false;
        draft.chatsList = [];
        draft.chatsPage = 1;
        draft.chatsTotal = 0;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.chatsList = [];
        draft.chatsPage = 1;
        draft.chatsTotal = 0;
        break;
      }
      default:
    }
  });
}
