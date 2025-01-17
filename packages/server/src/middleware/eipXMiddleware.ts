import { ax } from '../config/axiom';
import { client } from '../server';

const processLatestFinalizedBlock = async (req: any, res: any, next: any) => {
  const latestFinalizedBlock = await client.getLatestFinalizedBlock();
  res.latestFinalizedBlock = latestFinalizedBlock;
  next();
}

const getLatestFinalizedBlock = async (req: any, res: any) => {
  const latestFinalizedBlock = res.latestFinalizedBlock;
  // Return the client latest finalized block in response object
  res.json({
    latestFinalizedBlock
  })
}

const sendQueryToVerifier = async (req: any, res: any, next: any) => {
  console.log('res.body.queries: ', req.body.queries);
  if (req.body.queries.length > 0) {
    // must use try/catch block to debug
    try {
      let queries = req.body.queries;
      const data = await client.sendQueryToVerifier(queries);
      console.log('data: ', data);
      res.json({
        data
      });
    } catch(error) {
      next(error);
    }
  } else {
    res.status(404).json({
      message: "Error: Queries not provided"
    });
    console.error("Error: Queries not provided");
    return;
  }
}

const verifyQueryResults = async (req: any, res: any, next: any) => {
  if (req.body.queryHash != "") {
    // must use try/catch block to debug
    try {
      let queryHash = req.body.queryHash;
      const responses = await client.verifyQueryResults(
        queryHash,
        req.body.blockNumber || null,
        req.body.address || "",
        req.body.storageSlots || null,
      );
      console.log('responses: ', responses);
      res.json({
        responses
      });
    } catch(error) {
      res.status(500).json({
        message: "Error: Unknown verify query error. Please check server logs"
      });
      console.error("Error: Unknown verify query error. Please check server logs", error);
      return;
    }
  }
}

const getMPTProof = (req: any, res: any, next: any) => {
  // TODO
}

const readBlockHeader = (req: any, res: any) => {
//   stateRoot = res.stateRoot;
//   // Return contract address in response object
//   res.json({
//     stateRoot: stateRoot
//   })
}

const getProof = (req: any, res: any) => {
//   proof = res.proof;
//   // Return proof in response object
//   res.json({
//     proof: proof
//   })
}

export {
  getLatestFinalizedBlock,
  getMPTProof,
  getProof,
  readBlockHeader,
  processLatestFinalizedBlock,
  sendQueryToVerifier,
  verifyQueryResults,
}
