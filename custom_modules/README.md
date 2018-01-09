## Add Submodule

Within this directory it is needed to add submodule for share common services.

# Add directory
```sh
git submodule add [REPO_PATH] [DIR_NAME]
```

# If error is thrown because directory reference exist, destroy any cache directory reference from git.

```sh
git ls-files --stage [DIR_NAME]  //list the directory cache files
git rm -r --cached [DIR_NAME]   //remove all files
```

