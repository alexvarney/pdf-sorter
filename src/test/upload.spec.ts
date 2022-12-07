import { expect, FileChooser, Page, test } from "@playwright/test";
import { RootStore } from "../stores/root.store";
const openFileChooser = async (page: Page): Promise<FileChooser> => {
  // the file chooser pops up immediately, so we need to await both things at the same time
  let fileChooser: FileChooser | null = null;
  await Promise.all([
    page.waitForEvent("filechooser").then((fc) => {
      fileChooser = fc;
    }),
    page.locator('button[name="file-upload"]').click(),
  ]);

  return fileChooser!;
};

test.describe("Upload Component", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });
  test("should allow uploading a file and persist on refresh", async ({
    page,
  }) => {
    const fileChooser = await openFileChooser(page);

    await fileChooser!.setFiles("./src/test/fixtures/nanoid-npm.pdf");

    const textbox = page.getByRole("textbox");

    await expect(textbox).toHaveValue("nanoid-npm");

    await page.evaluate(
      async () => await ((window as any).rootStore as RootStore).saveMetadata()
    );

    await page.reload();

    //should persist data
    await expect(page.getByRole("textbox").nth(0)).toHaveValue("nanoid-npm");
  });

  test("should allow uploading multiple files", async ({ page }) => {
    const fileChooser = await openFileChooser(page);

    await fileChooser!.setFiles([
      "./src/test/fixtures/nanoid-npm.pdf",
      "./src/test/fixtures/react-npm.pdf",
      "./src/test/fixtures/typescript-npm.pdf",
      "./src/test/fixtures/mobx-npm.pdf",
    ]);

    //should display all the files without the 'pdf' part at the end

    await expect(page.getByRole("textbox").nth(0)).toHaveValue("nanoid-npm");
    await expect(page.getByRole("textbox").nth(1)).toHaveValue("react-npm");
    await expect(page.getByRole("textbox").nth(2)).toHaveValue(
      "typescript-npm"
    );
    await expect(page.getByRole("textbox").nth(3)).toHaveValue("mobx-npm");

    await page.evaluate(
      async () => await ((window as any).rootStore as RootStore).saveMetadata()
    );

    await page.reload();

    //should persist everything after reloading
    await expect(page.getByRole("textbox").nth(0)).toHaveValue("nanoid-npm");
    await expect(page.getByRole("textbox").nth(1)).toHaveValue("react-npm");
    await expect(page.getByRole("textbox").nth(2)).toHaveValue(
      "typescript-npm"
    );
    await expect(page.getByRole("textbox").nth(3)).toHaveValue("mobx-npm");
  });

  test("should allow changing the name of a file", async ({ page }) => {
    const fileChooser = await openFileChooser(page);

    await fileChooser!.setFiles(["./src/test/fixtures/nanoid-npm.pdf"]);

    const textbox = page.getByRole("textbox").first();

    await textbox.click();

    await textbox.fill("hello world");

    await expect(textbox).toHaveValue("hello world");

    await page.evaluate(
      async () => await ((window as any).rootStore as RootStore).saveMetadata()
    );

    await page.reload();

    await expect(textbox).toHaveValue("hello world");
  });
});
