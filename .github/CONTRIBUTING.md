# Contributing

Welcome! Please follow this guide before committing any changes to the repository.

## Start with the latest on main

When starting any new work, ensure you start with the latest changes.

```sh
git fetch
git checkout main
git pull origin main
```

## Create a feature branch

Create a feature branch using the naming conventions outlined [here](#branch-naming-conventions). The term 'feature' is loosley used here. In reality, a feature represents any new code.

```sh
# In this example, WHERO-12 is the name of the corresponding JIRA ticket
git checkout -b feature/WHERO-12-my-awesome-feature
```

## Stage changes

Once you have made some changes, you need to commit them. Commits should happen as often as neccessary, and their descriptions should be short and concise.

Before you even think about pushing to the remote repository, you need to run the linting suite. Look [here](../README.md#linting) for more information.

Once you are happy with everything, go ahead and push your feature branch to the remote repository.

```sh
git push origin feature/WHERO-12-my-awesome-feature
```

## Create a pull request

Once you push your feature to github, navigate to the project on github and create a pull request.

In general the base branch should be the branch you initially checkout from, for example if you checked out from main you should set the base branch to main.

Ensure your pull request is neatly titled. It is often helpful to include things such as a JIRA code in the title.

### Good

> [WHERO-12] My Awesome Feature

### Bad

> My awesome feature

The pull request will be automatically populated via a template, with sections for a description, screenshots and a developer checklist.

Feel free to modify the content of the pull request as you see fit.

Once you have created your pull request, you should request another developer to review it before merging it in.

## Merge pull request

Once your changes are approved, you can go ahead and merge the pull request using the 'Merge pull request' button.

Please delete the branch using the 'Delete branch' button if it is no longer required on the remote repository.

## Release changes to production

Use the create release candidate workflow in order to release changes from main to the production branch. This workflow will enact the following:

1. Create a release branch 'release/xxxx' to merge into production.
2. Create a pull request for the above.
3. Bump the current version of the project.
4. Once merged into production, production will automatically be merged back into main.
5. A new release with the new code and updated version number will be created in the releases section.

To create a new release candidate, simply use the 'Run workflow' function. When selected, you will be prompted for a branch and a type of release. For the branch use main, unless stated otherwise. For the type of release you have three options:

- release major (MAJOR)
- release minor (MINOR)
- release patch (PATCH)

These follow the semantic versioning pattern https://semver.org/ (MAJOR.MINOR.PATCH). Each release to production must be marked with one of these labels.

_Changes must be merged via a pull request. No pushing straight to the production branch_

_Only branches prefixed with 'release/' or 'hotfix/' can be merged into production!_

---

## Critical bugfixes on production

If for any reason there is a critical error on production that needs to be resolved right away, create a branch using the `hotfix/**` naming convention. These branches can be merged straight into the production branch via a pull request without merging into main first.

A hotfix pull request should use the `release patch` label

---

## Branch naming conventions

With the execption of `deploy-production`, `main` and `release/**`; all branches should include either a JIRA or Trello ticket code in their name.

### Good:

> feature/JIRA-12-my-awesome-feature

### Bad:

> feature/my-awesome-feature

Below is a non-exhaustive list of recommended naming conventions for branches. The names `deploy-production`, `main` and `release/**` are reserved.

| Name              | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| deploy-production | Main production branch (Protected)                               |
| main              | Main development branch                                          |
| release/\*\*      | Used to stage changes from main to production branch             |
| feature/\*\*      | Feature branch off main                                          |
| fork/\*\*         | Fork branch off main, used for larger features or pieces of work |
| support/\*\*      | Minor feature branch or support ticket off main                  |
| bugfix/\*\*       | Non-critical bugfix                                              |
| hotfix/\*\*       | Critical bugfix that can be merged into the production branch    |
