# HitchhikerJS

Building project needs npm and node. If you don't have it installed, it's recommended to use [NVM](https://github.com/creationix/nvm). On Windows, use the node installer from [Node](https://nodejs.org/en/).

On Linux:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
# open a new shell instance to refresh
nvm install 6.6.0
```

After you got all installed, simply run:

```
npm install -g grunt  # it will install grunt for building
npm install           # install node dependencies
typings install       # install typings for typescript compile
grunt fullbuild       # build project into build/ folder
```
