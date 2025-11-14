import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { AnonymousElection, AnonymousElection__factory } from "../types";
import { expect } from "chai";

type Signers = {
  deployer: HardhatEthersSigner;
  admin: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
  carol: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("AnonymousElection")) as AnonymousElection__factory;
  const electionContract = (await factory.deploy()) as AnonymousElection;
  const electionContractAddress = await electionContract.getAddress();

  return { electionContract, electionContractAddress };
}

describe("AnonymousElection Integration Tests", function () {
  let signers: Signers;
  let electionContract: AnonymousElection;
  let electionContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      admin: ethSigners[1],
      alice: ethSigners[2],
      bob: ethSigners[3],
      carol: ethSigners[4],
    };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn(`This integration test cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ electionContract, electionContractAddress } = await deployFixture());
  });

  describe("Complete Election Flow", function () {
    it("should execute complete election lifecycle", async function () {
      // Create election
      const candidates = ["Alice Smith", "Bob Johnson", "Carol White"];
      const tx = await electionContract
        .connect(signers.admin)
        .createElection(
          "Integration Test Election",
          "Testing complete election flow",
          candidates,
          24 // 24 hours
        );
      await tx.wait();

      const electionId = 0;

      // Verify election was created
      const election = await electionContract.getElection(electionId);
      expect(election.title).to.equal("Integration Test Election");
      expect(election.candidateNames).to.deep.equal(candidates);

      // Cast votes
      const { mockEncrypt32 } = await import("@fhevm/hardhat-plugin");

      // Alice votes for candidate 1
      const aliceVote = await mockEncrypt32(1);
      await electionContract.connect(signers.alice).vote(electionId, aliceVote.handles[0], aliceVote.inputProof);

      // Bob votes for candidate 2
      const bobVote = await mockEncrypt32(2);
      await electionContract.connect(signers.bob).vote(electionId, bobVote.handles[0], bobVote.inputProof);

      // Carol votes for candidate 1
      const carolVote = await mockEncrypt32(1);
      await electionContract.connect(signers.carol).vote(electionId, carolVote.handles[0], carolVote.inputProof);

      // Fast forward time to end election
      await ethers.provider.send("evm_increaseTime", [25 * 60 * 60]); // 25 hours
      await ethers.provider.send("evm_mine");

      // End election
      await electionContract.connect(signers.admin).endElection(electionId);

      // Finalize and decrypt results
      await electionContract.connect(signers.admin).finalizeElection(electionId);

      // Verify results
      const decryptedSum = await electionContract.getDecryptedVoteSum(electionId);
      expect(decryptedSum).to.equal(4); // 1 + 2 + 1 = 4

      console.log("✅ Complete election flow integration test passed");
    });
  });
});
