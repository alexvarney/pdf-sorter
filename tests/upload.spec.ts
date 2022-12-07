import { expect, FileChooser, test } from "@playwright/test";

test.describe("Upload Component", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });
  test("should allow uploading a file and render their names", async ({
    page,
  }) => {
    // the file chooser pops up immediately, so we need to await both things at the same time
    let fileChooser: FileChooser | null = null;
    await Promise.all([
      page.waitForEvent("filechooser").then((fc) => {
        fileChooser = fc;
      }),
      page.locator('button[name="file-upload"]').click(),
    ]);

    await fileChooser!.setFiles("./tests/fixtures/nanoid-npm.pdf");

    const textbox = page.getByRole("textbox");

    await expect(textbox).toHaveValue("nanoid-npm");

    await page.reload();

    //should persist data
    await page.getByText("nanoid-npm");
  });

  test("should allow uploading multiple files and render their names", async ({
    page,
  }) => {
    let fileChooser: FileChooser | null = null;
    await Promise.all([
      page.waitForEvent("filechooser").then((fc) => {
        fileChooser = fc;
      }),
      page.locator('button[name="file-upload"]').click(),
    ]);

    await fileChooser!.setFiles([
      "./tests/fixtures/nanoid-npm.pdf",
      "./tests/fixtures/react-npm.pdf",
      "./tests/fixtures/typescript-npm.pdf",
      "./tests/fixtures/mobx-npm.pdf",
    ]);

    //should display all the files without the 'pdf' part at the end
    await page.getByText("nanoid-npm");
    await page.getByText("react-npm");
    await page.getByText("typescript-npm");
    await page.getByText("mobx-npm");

    await page.reload();

    //should persist everything after reloading
    await page.getByText("nanoid-npm");
    await page.getByText("react-npm");
    await page.getByText("typescript-npm");
    await page.getByText("mobx-npm");
  });
});
