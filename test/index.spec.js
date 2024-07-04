import { it, expect, afterEach } from "vitest";
import { unstable_dev } from "wrangler";

let devInstance = null;

afterEach(async () => {
  if (devInstance) {
    devInstance.stop();
    await devInstance.waitUntilExit();
  }
  devInstance = null;
});

it("should correctly handle a user request", async () => {
  devInstance = await unstable_dev();

  await testLocalWorkerUserResponse("user-a");
});

it("should correctly handle 2 sequential user requests", async () => {
  devInstance = await unstable_dev();

  await testLocalWorkerUserResponse("user-a");
  await testLocalWorkerUserResponse("user-b");
});

it("should correctly handle 3 sequential user requests", async () => {
  devInstance = await unstable_dev();

  await testLocalWorkerUserResponse("user-a");
  await testLocalWorkerUserResponse("user-b");
  await testLocalWorkerUserResponse("user-c");
});

it("should correctly handle 3 parallel user requests", async () => {
  devInstance = await unstable_dev();

  await Promise.all([
    testLocalWorkerUserResponse("user-a"),
    testLocalWorkerUserResponse("user-b"),
    testLocalWorkerUserResponse("user-c"),
  ]);
});

it("should correctly handle 3 parallel user requests (in production)", async () => {
  devInstance = await unstable_dev();

  await Promise.all([
    testRemoteWorkerUserResponse("user-a"),
    testRemoteWorkerUserResponse("user-b"),
    testRemoteWorkerUserResponse("user-c"),
  ]);
});

async function testLocalWorkerUserResponse(userId) {
  const workerResponse = await devInstance.fetch(`localhost?userId=${userId}`);
  await assertWorkerResponse(workerResponse, userId);
}

async function assertWorkerResponse(workerResponse, userId) {
  const workerRespJson = await workerResponse.json();

  expect(workerRespJson).toEqual({
    userId,
    username: `user ${userId}`,
    email: `${userId}@email.test`,
  });
}

async function testRemoteWorkerUserResponse(userId) {
  const workerResponse = await devInstance.fetch(`https://workerd-modules-sharing-repro.devdash.workers.dev?userId=${userId}`);
  await assertWorkerResponse(workerResponse, userId);
}
