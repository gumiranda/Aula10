require('../models/chat-model');
const base = require('../../../bin/base/repository-base');

class chatRepository {
  constructor() {
    this._base = new base('Chat');
    this.projection = 'userDest userRemet createdAt lastMessage messages';
    this.projection2 = 'userDest userRemet createdAt lastMessage';
  }

  create(data) {
    return this._base.create(data);
  }

  sendMessage(_id, data, user) {
    return this._base._model.findOneAndUpdate(
      { _id },
      {
        $push: {
          messages: { text: data.text, createdAt: new Date(), user },
        },
        $inc: { countMessages: 1 },
      },
      { new: true, projection: 'userDest userRemet _id countMessages' },
    );
  }

  async deleteMessage(idChat, idMessage, user) {
    const verifica = await this._base._model.findById(idChat).findOne({
      messages: { $elemMatch: { _id: idMessage, user } },
    });
    if (verifica.length === 0) {
      return 'Operação inválida';
    }
    const result = await this._base._model
      .findById(idChat)
      .findOneAndUpdate(
        { messages: { $elemMatch: { _id: idMessage } } },
        {
          $pull: { messages: { _id: idMessage } },
          $inc: { countMessages: -1 },
        },
        { new: true },
      )
      .exec((err, res) => {
        if (!err) {
          return res;
        }
      });
    return result;
  }

  async getMyChats(page, user) {
    const chats = await this._base._model
      .find(
        {
          $or: [
            {
              $and: [{ userDest: { $ne: user } }, { userRemet: user }],
            },
            {
              $and: [{ userRemet: { $ne: user } }, { userDest: user }],
            },
          ],
        },
        this.projection,
      )
      .populate({ path: 'userDest', select: 'nome photo_url' })
      .populate({ path: 'userRemet', select: 'nome photo_url' })
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ createdAt: -1 });
    const chatsCount = await this._base._model
      .find({ $or: [{ userRemet: user }, { userDest: user }] }, this.projection)
      .count();
    return {
      chats,
      chatsCount,
    };
  }

  async delete(id) {
    return this._base.delete(id);
  }
}

module.exports = chatRepository;
