import { createAccount, initializeCollection, mintNFT } from "../services/hedera.service.js"
import { Event, Supervisor, User } from "../models/data.model.js"

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
    const { name, email, password, phonenumber } = req.body
    const { accountId, accountPublicKey, accountPrivateKey } = await createAccount()

    const tokenId = await initializeCollection("AGRITRACE", "AGT", accountPrivateKey, accountId)

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
  async createEvent(req, res) {

    const data = req.body

    // Test supervisor tokenId and privateKey
    const tokenId = "0.0.6914833"
    const supplyKey = "3030020100300706052b8104000a042204209b11d2bfc8eeb45e83b4a7f1efd6d3b5b6376000fc43a42fa7706016c57b2ed0"
    //
    const serialNumber = await mintNFT(tokenId, supplyKey, data)

    //
    const event = new Event({
      _id: serialNumber,
      actorId: data.actor,
      eventType: data.type,
      location: data.location,
      metadata: data.metadata
    })

    event.save()
    res.send(event.toObject())
  }

}
export default trackController
