import {createAccount} from "../services/hedera.service.js"
import {User} from "../models/data.model.js"

const trackController = {
  async createAccount(req,res){
    const { name, email, password, phonenumber } = req.body;
    const {accountId, accountPublicKey, accountPrivateKey} = await createAccount()

    const user = new User({
      _id: accountId,
      name: name,
      email: email,
      password: password,
      phoneNumber: phonenumber,
      keypair:{
        publicKey: accountPublicKey,
        privateKey: accountPrivateKey
      }
    })
    await user.save()
    res.send(user.toObject())
  },
  async updateAccount(req,res){
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

  }
}
export default trackController
