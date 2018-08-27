import EmbarkJS from 'Embark/EmbarkJS';

class IpfsUtil {
  async decodeIpfsHash(cid, jsonParse=false) {
    const content = await EmbarkJS.Storage.get(cid);
    return jsonParse ? JSON.parse(content) : content;
  }
}

export default new IpfsUtil();