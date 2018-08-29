# ethhack-submissions

etthhack-submissions is a DApp for managing final project submissions during a hackathon. It aims to engage teams over the project submissions of the fellow hackathon participants.

Typical workflow looks like
- An organiser creates a new hackathon and mentions the following details
  - Transfers the moneybag of total prizes to the smart contract ([`CreateHackathon`](contracts/hack_submissions.sol) function is payable).
  - Mentions the start and hackathon end time.
  - Uploads additional hackathon details in the following format (JSON):
  ```javascript
  {
    "description": "Biggest Ethereum hackathon",
    "submission_questionnaire": {
      "What is the name of your project?": {}, 
      "Elevator pitch for your project": {}, 
      "The problem that your project solves": {},
      ...
    }
  }
  ```
  This file is uploaded to IPFS and the [Content Identifier](https://github.com/ipld/cid) is saved to the smart contract.

- Teams can register for the hackathon. At this point they provide a team name. The registered teams can be viewed on the hackathon details page.
- Before the end of the hackathon, the teams need to submit their project by answering questions that were mentioned under the `submission_questionnaire` key in the hackathon additional details file.
- The __other teams__ can upvote and comment on projects. The upvoting functionality can be gamified by assigning bounties to correct winner predictions! (i.e. The event specific [Bounties Network](https://bounties.network/) coins will be assigned to individuals who upvoted the (eventually) winner projects!
- After the winners have been announced, the organizer can assign the prize bag in a desired ratio.

### Next Steps
- Functionality to add ethereum addresses of individual team members to a team; so that team members can participate in upvoting and commenting.
- Make smart contract functions gas efficient.
- Write contract tests.

### Technical Details
1. This DApp is built on the [embark](https://embark.status.im/docs/) framework! Building it with embark was pure breeze :D
2. As a part of the above workflows, the following resources are first uploaded to the IPFS and their [Content Identifier](https://github.com/ipld/cid) is saved to the smart contract.
- The hackathon additional details JSON file.
- Project submission (The answers to the submission questionnaire are concatenated and the string uploaded to IPFS).
- Comments on a particular project.

### Development
```shell
npm i
npm start
```
If you'd like to keep your ganache and IPFS instance independent of `embark`
```shell
ganache-cli --mnemonic "example exile argue silk regular smile grass bomb merge arm assist farm"
ipfs daemon
npm start
```
Then load the mnemonic in metamask.