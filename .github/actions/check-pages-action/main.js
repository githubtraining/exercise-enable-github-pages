const github = require("@actions/github");
const core = require("@actions/core");

async function run() {
  try {
    const token = core.getInput("github-token");
    const octokit = github.getOctokit(token);
    const ctx = github.context;
    const expectedBranch = "main";
    const expectedPath = "/docs";

    const { data: page } = await octokit.repos.getPages({
      owner: ctx.repo.owner,
      repo: ctx.repo.repo,
    });

    if (page.status !== "built") {
      core.setOutput("reports", {
        reports: [
          {
            filename: "",
            isCorrect: false,
            display_type: "issues",
            level: "fatal",
            msg: "Error",
            error: {
              expected: "",
              got:
                "## GitHub Pages has failed to successfully build your page.\n**[GitHub Pages Documentation](https://docs.github.com/en/github/working-with-github-pages)**",
            },
          },
        ],
      });
      return;
    }

    if (
      page.source.branch !== expectedBranch ||
      page.source.path !== expectedPath
    ) {
      core.setOutput("reports", {
        reports: [
          {
            filename: "",
            isCorrect: false,
            display_type: "issues",
            level: "info",
            msg: "incorrect solution",
            error: {
              expected: `branch to equal ${expectedBranch} and path to equal ${expectedPath}`,
              got: `branch: ${page.source.branch} path: ${page.source.path}`,
            },
          },
        ],
      });
      return;
    }

    core.setOutput("reports", {
      reports: [
        {
          filename: "",
          isCorrect: true,
          display_type: "actions",
          level: "info",
          msg: `Great job!  Your page can be found at: ${page.html_url}`,
          error: {
            expected: "",
            got: "",
          },
        },
      ],
    });
  } catch (error) {
    core.setFailed(error);
  }
}

run();
