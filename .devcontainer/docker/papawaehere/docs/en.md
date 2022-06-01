# Papawaehere

Papawaehere (Code land) is the name of our base project container.

## Scripts

- onCreate.sh - runs when the container is first created
- onStart.sh - runs whenever the container is booted

## Environment Configuration

Project specific environment configuration should be defined in the project's `.env.example` file as well as the `onCreate.sh` script.

Sensitive shared information should be defined inside codespace secrets https://docs.github.com/en/codespaces/managing-your-codespaces/managing-encrypted-secrets-for-your-codespaces and added to the onCreate script like so:

```bash
MY_SECRET_VARIABLE=${MY_SECRET_VARIABLE}
```

## Welcome Messages

Custom welcome messages are defined inside of the `motd.d` directory, they should be project specific and give developers the bare minimum information needed to run the project. More detailed instructions should come from the projects README file.

## Custom User Configuration

Users are encouraged to personalise their own workspaces to set their own needs. There are two main ways to do this, via settings sync or via a dotfiles repository. Visit https://docs.github.com/en/codespaces/customizing-your-codespace/personalizing-codespaces-for-your-account for more information.
