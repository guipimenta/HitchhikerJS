# HitchhikerJS

## Building from source

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
grunt build:full       # build project into build/ folder
```

## Running demo server

On demos/ folder you can run a simple Express server to test the library. Running is straightforward:

```
cd demos
npm install # it will install express and dependencies
node server.js
```

It will run a local server and load the baisc library.

## Using Hitchhiker library

Using the concat version, just add to your html head:

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bowser/1.0.0/bowser.min.js"></script>
<script src="js/hitchhiker.js"></script>
<script>
    Bootstrap.BasicBootstrap({
        trackingUrl: "/pubTest"
    });
</script>
```

Basic bootstrap will create a simple Highjacker to get data from user current session.
**trackingUrl**: url to push data to.
