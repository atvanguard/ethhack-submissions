import HackSubmissions from 'Embark/contracts/HackSubmissions';

class Web3Util {
  async getAccount() {
    const accounts = await web3.eth.getAccounts();
    return accounts[0];  
  }

  async createHackathon(name) {
    const from = await this.getAccount();
    const estimateGas = await HackSubmissions.methods.createHackathon(name).estimateGas({from});
    console.log('createHackathon - estimateGas', estimateGas);
    const createHackathonTx = await HackSubmissions.methods.createHackathon(name).send({
      from,
      gas: estimateGas + 500
    });
    console.log('createHackathonTx', createHackathonTx);
  }

  async registerTeam(hackId, name) {
    const from = await this.getAccount();
    const estimateGas = await HackSubmissions.methods.registerTeam(hackId, name).estimateGas({from});
    console.log('registerTeam - estimateGas', estimateGas);
    const registerTeamTx = await HackSubmissions.methods.registerTeam(hackId, name).send({
      from,
      gas: estimateGas + 500
    });
    console.log('registerTeamTx', registerTeamTx);
  }
}

export default new Web3Util();