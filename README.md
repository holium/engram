# Engram

A sauced up document editor.

## Issues

We are constantly improving Engram! If you encounter any bugs feel free to create an issue on [github](https://github.com/holium/engram) or message me @ `~dalsyr-diglyn`.

## Building from Source

It's reccomended to [boot a fake ship](https://developers.urbit.org/guides/core/environment#creating-a-fake-ship) in order to build engram from source. Once you've got your ship running, you can start by running the following commands:

```
> |merge %engram our %base
>=
> |mount %engram
>=
```

In a new terminal, navigate to your ship and copy over your files from the `/desk` folder into your ship's `/engram` folder.

```
$ rm -r ./zod/engram/*
$ cp -r ./engram/desk/* ./zod/engram/
```

While in this terminal build the ui files. This will create a build folder we will use later.

```
// from the ./engram/ui folder
$ npm install
$ npm run build
```

Once the desk is copied over and the ui built you can navigate back to your ship. From your ship commit and install engram:

```
> |commit %engram
>=
> |install our %engram
>=
```

Now you can open up landscape in your browser, navigate to `/docket/upload` and upload the build file we created earlier; it will be valled `dist`. Be sure to select `engram` as the desk. Then hit `glob!` to run the upload.

Once that's done you can run engram from landscape.
