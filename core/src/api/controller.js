import { createAccount, initializeCollection } from "../services/hedera.service.js"
import { Supervisor, User } from "../models/data.model.js"

const trackController = {
  async createAccount(req, res) {
    const { name, email, password, phonenumber } = req.body;
    const { accountId, accountPublicKey, accountPrivateKey } = await createAccount()

    const user = new User({
      _id: accountId,
      name: name,
      email: email,
      password: password,
      phoneNumber: phonenumber,
      keypair: {
        publicKey: accountPublicKey,
        privateKey: accountPrivateKey
      }
    })
    await user.save()
    res.send(user.toObject())
  },
  async updateAccount(req, res) {
    const userId = req.params.id;
    const data = req.body;

    const userExists = await User.exists({ _id: userId })
    if (!userExists) {
      return res.status(404).send({ message: "User not found" })
    }
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      data,
      { new: true })
    res.send(updatedUser.toObject())

  },

  // Testing the supervisor creation
  async createSupervisor(req, res) {
    const { name, email, password, phonenumber } = req.body;
    const { accountId, accountPublicKey, accountPrivateKey } = await createAccount()

    // domain initialization 
    // with random token name and symbol
    const tokenId = await initializeCollection("AGRITRACE", "AGT", accountPrivateKey, accountId)

    //
    const supervisor = new Supervisor({
      _id: accountId,
      name: name,
      email: email,
      password: password,
      phoneNumber: phonenumber,
      keypair: {
        publicKey: accountPublicKey,
        privateKey: accountPrivateKey
      },
      domainId: tokenId
    })
    await supervisor.save()
    res.send(supervisor.toObject())
  },
  async updateSupervisor(req, res) {
    const supervisorId = req.params.id;
    const data = req.body;

    const supervisorExists = await Supervisor.exists({ _id: supervisorId })
    if (!supervisorExists) {
      return res.status(404).send({ message: "Supervisor not found" })
    }
    const updatedSupervisor = await Supervisor.findOneAndUpdate(
      { _id: supervisorId },
      data,
      { new: true })
    res.send(updatedSupervisor.toObject())

  },
  

}
export default trackController
