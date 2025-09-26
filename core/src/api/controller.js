import createAccount from "../services/hedera.service.js"
import {User} from "../models/data.model.js"

const trackController = {
  async createAccount(req,res){
    // Process request
    const { name, email, password, phonenumber } = req.body;
    
    // Process account credentials
    const {accountId, accountPublicKey, accountPrivateKey} = await createAccount()

    // Save it to the database 
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
    
  }
  async createEvent(req,res){
   
  }
}
export default trackController
