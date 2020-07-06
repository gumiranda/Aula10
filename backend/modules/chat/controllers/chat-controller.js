const repository = require('../repositories/chat-repository');

const _repo = new repository();
const ctrlBase = require('../../../bin/base/controller-base');
const validation = require('../../../bin/helpers/validation');

function chatController() {}
chatController.prototype.post = async (req, res) => {
  const validationContract = new validation();
  validationContract.isRequired(req.body.userDest, 'a userDest é obrigatória');
  req.body.userRemet = req.usuarioLogado.user._id;
  ctrlBase.post(_repo, validationContract, req, res);
};

chatController.prototype.deleteMessage = async (req, res) => {
  try {
    const validationContract = new validation();
    validationContract.isRequired(
      req.body.text,
      'o texto do comentário é obrigatório',
    );
    validationContract.isRequired(
      req.params.id,
      'o id do chat que será atualizado obrigatório',
    );
    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: 'Existem dados inválidos na sua requisição',
          validation: validationContract.errors(),
        })
        .end();
      return;
    }
    const resultado = await _repo.deleteMessage(
      req.params.id,
      req.params.id2,
      req.usuarioLogado.user_id,
    );
    if (resultado !== 'Operação inválida') {
      res.status(202).send({ message: 'Mensagem excluida com sucesso' });
    } else {
      res.status(202).send({ message: 'Não foi possível apagar mensagem' });
    }
  } catch (erro) {
    res.status(500).send({ message: 'Erro no processamento', error: erro });
  }
};
chatController.prototype.sendMessage = async (req, res) => {
  const validationContract = new validation();
  validationContract.isRequired(
    req.body.text,
    'o texto do comentário é obrigatório',
  );
  validationContract.isRequired(
    req.params.id,
    'o id do chat que será atualizado obrigatório',
  );
  try {
    const data = req.body;
    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: 'Existem dados inválidos na sua requisição',
          validation: validationContract.errors(),
        })
        .end();
      return;
    }

    const resultado = await _repo.sendMessage(
      req.params.id,
      data,
      req.usuarioLogado.user._id,
    );
    if (req.connectedUsers) {
      let userid;
      if (resultado.userDest.toString() === req.usuarioLogado.user._id) {
        userid = resultado.userRemet;
      } else {
        userid = resultado.userDest;
      }
      const userSocket = req.connectedUsers[userid];
      if (userSocket) {
        const msg = {
          _id: new Date().getTime(),
          text: data.text,
          createdAt: new Date(),
          user: {
            _id: req.usuarioLogado.user._id,
            name: req.usuarioLogado.user.nome,
          },
        };
        req.io.to(userSocket).emit('response', msg);
      }
    }

    res.status(202).send(resultado);
  } catch (erro) {
    res
      .status(500)
      .send({ message: 'Erro no processamento', error: erro.toString() });
  }
};

chatController.prototype.getMyChats = async (req, res) => {
  const validationContract = new validation();
  validationContract.isRequired(req.params.page, 'pageNumber obrigatório');
  try {
    const resultado = await _repo.getMyChats(
      req.params.page,
      req.usuarioLogado.user._id,
    );
    res.status(200).send(resultado);
  } catch (erro) {
    res.status(500).send({ message: 'Erro no processamento', error: erro });
  }
};
chatController.prototype.delete = async (req, res) => {
  ctrlBase.delete(_repo, req, res);
};

module.exports = chatController;
