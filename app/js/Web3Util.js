import HackSubmissions from 'Embark/contracts/HackSubmissions';

class Web3Util {
  async getAccount() {
    const accounts = await web3.eth.getAccounts();
    return accounts[0];  
  }

  async createHackathon(name, details, prizes, startsAt, endsAt) {
    const from = await this.getAccount();
    const params = {from, value: web3.utils.toWei(prizes)};
    const estimateGas = await HackSubmissions.methods.createHackathon(name, details, startsAt, endsAt).estimateGas(params);
    console.log('createHackathon - estimateGas', estimateGas);
    params.gas = estimateGas + 500;
    const createHackathonTx = await HackSubmissions.methods.createHackathon(name, details, startsAt, endsAt).send(params);
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

  async createSubmission(hackId, _content) {
    const content = web3.utils.asciiToHex(_content);
    // const hackId = web3.utils.asciiToHex(_hackId);
    console.log(_content, content, hackId)
    const from = await this.getAccount();
    const estimateGas = await HackSubmissions.methods.createSubmission(hackId, content).estimateGas({from});
    console.log('createSubmission - estimateGas', estimateGas);
    const createSubmissionTx = await HackSubmissions.methods.createSubmission(hackId, content).send({
      from,
      gas: estimateGas + 500
    });
    console.log('createSubmissionTx', createSubmissionTx);
  }

  async comment(hackId, teamId, _content) {
    const content = web3.utils.asciiToHex(_content);
    const from = await this.getAccount();
    const estimateGas = await HackSubmissions.methods.comment(hackId, teamId, content).estimateGas({from});
    console.log('comment - estimateGas', estimateGas);
    const commentTx = await HackSubmissions.methods.comment(hackId, teamId, content).send({
      from,
      gas: estimateGas + 500
    });
    console.log('commentTx', commentTx);
  }

  async upvote(hackId, teamId) {
    const from = await this.getAccount();
    const estimateGas = await HackSubmissions.methods.upvote(hackId, teamId).estimateGas({from});
    console.log('upvote - estimateGas', estimateGas);
    const upvoteTx = await HackSubmissions.methods.upvote(hackId, teamId).send({
      from,
      gas: estimateGas + 500
    });
    console.log('upvoteTx', upvoteTx);
  }

  // read function
  async getTeam(hackId, teamId) {
    if (!teamId) {
      // teamId is the current metamask account
      teamId = await this.getAccount(); 
    }
    console.log('hackId, teamId', hackId, teamId)
    const team = await HackSubmissions.methods.getTeam(hackId, teamId).call();
    return team;
  }

  async getComment(hackId, teamId, index) {
    console.log(hackId, teamId, index)
    const comment = await HackSubmissions.methods.getComment(hackId, teamId, index).call();
    console.log(comment);
    return comment;
  }
}

export default new Web3Util();