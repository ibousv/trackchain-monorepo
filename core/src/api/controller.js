import createAccount from "../services/hedera.service.js"

const trackController = {
  async createAccount(req,res){
    const data = await createAccount()
    res.send(data)
  },
}
export default trackController
