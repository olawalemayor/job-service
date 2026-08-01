import { mkdtemp, readFile, rm, stat } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { buildLocalStorageProvider } from "../src/storage/local-storage-provider";

describe("localStorageProvider", () => {
  let basePath: string;

  beforeEach(async () => {
    basePath = await mkdtemp(join(tmpdir(), "local-storage-"));
  });

  afterEach(async () => {
    await rm(basePath, { recursive: true, force: true });
  });

  it("creates the bucket directory", async () => {
    const provider = buildLocalStorageProvider(basePath);

    await provider.ensureBucketExists("media-bucket");

    const stats = await stat(join(basePath, "media-bucket"));
    expect(stats.isDirectory()).toBe(true);
  });

  it("does not throw when the bucket directory already exists", async () => {
    const provider = buildLocalStorageProvider(basePath);

    await provider.ensureBucketExists("media-bucket");

    await expect(provider.ensureBucketExists("media-bucket")).resolves.toBeUndefined();
  });

  it("writes uploaded content under the bucket, creating nested dirs", async () => {
    const provider = buildLocalStorageProvider(basePath);

    await provider.ensureBucketExists("media-bucket");
    await provider.upload("media-bucket", "nested/path/file.png", "data-url");

    const content = await readFile(
      join(basePath, "media-bucket", "nested/path/file.png"),
      "utf-8",
    );
    expect(content).toBe("data-url");
  });

  it("creates the bucket directory itself if ensureBucketExists was never called", async () => {
    const provider = buildLocalStorageProvider(basePath);

    await provider.upload("media-bucket", "nested/path/file.png", "data-url");

    const content = await readFile(
      join(basePath, "media-bucket", "nested/path/file.png"),
      "utf-8",
    );
    expect(content).toBe("data-url");
  });
});
