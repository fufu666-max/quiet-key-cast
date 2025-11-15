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

describe("AnonymousElection Performance Tests", function () {
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
      console.warn(`Performance tests cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ electionContract, electionContractAddress } = await deployFixture());
  });

  describe("Election Creation Performance", function () {
    it("should create elections efficiently", async function () {
      const candidates = ["Candidate A", "Candidate B", "Candidate C"];
      const startTime = Date.now();

      const tx = await electionContract
        .connect(signers.admin)
        .createElection(
          "Performance Test Election",
          "Testing election creation performance",
          candidates,
          24
        );
      await tx.wait();

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Election creation took ${duration}ms`);
      expect(duration).to.be.lessThan(5000); // Should complete within 5 seconds

      const electionCount = await electionContract.getElectionCount();
      expect(electionCount).to.equal(1);
    });

    it("should handle multiple elections creation", async function () {
      const candidates = ["A", "B", "C"];
      const startTime = Date.now();

      // Create 5 elections
      for (let i = 0; i < 5; i++) {
        const tx = await electionContract
          .connect(signers.admin)
          .createElection(
            `Election ${i}`,
            `Description ${i}`,
            candidates,
            24
          );
        await tx.wait();
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`Creating 5 elections took ${duration}ms`);
      expect(duration).to.be.lessThan(15000); // Should complete within 15 seconds

      const electionCount = await electionContract.getElectionCount();
      expect(electionCount).to.equal(5);
    });
  });

  describe("Vote Casting Performance", function () {
    it("should cast votes efficiently", async function () {
      // Create election
      const candidates = ["Alice", "Bob", "Carol"];
      await electionContract
        .connect(signers.admin)
        .createElection("Vote Performance Test", "Testing vote performance", candidates, 24);

      const { mockEncrypt32 } = await import("@fhevm/hardhat-plugin");

      // Cast vote
      const startTime = Date.now();
      const encryptedVote = await mockEncrypt32(1);
      const tx = await electionContract.connect(signers.alice).vote(0, encryptedVote.handles[0], encryptedVote.inputProof);
      await tx.wait();
      const endTime = Date.now();

      const duration = endTime - startTime;
      console.log(`Vote casting took ${duration}ms`);
      expect(duration).to.be.lessThan(10000); // Should complete within 10 seconds
    });
  });
});
