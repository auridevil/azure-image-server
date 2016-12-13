# azure-image-server

*ready to deploy image (and file) server for azure webapps with image scaling*

## Use


```
git clone https://github.com/auridevil/azure-image-server.git
source env.sh
npm start
```

## Configuration

All the configurations are done using environment variables. 

The connection string to the azure storage (mandatory):
```
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=xxxx;AccountKey=yyyyyyyyyyy"

```

The secret key to decode jwt token (almost mandatory):
```
JWT_KEY="jwt-secret-key-here"

```

The time to wait before unlinking temp files:
```
UNLINK_TIMEOUT="2000"
```

Various:
```
PORT="8080"
HOST="localhost"
FILE_CONTAINER_NAME="files"
IMG_CONTAINER_NAME="images"
```

## Deploy

- create a azure web app
- create a deploy slot from git for the web app and use the git address in the package.json (replace "tbi")
- configure the web app with the env vars
- npm run azure:register:xxx (where xxx is dev / test / prod)
- npm run deploy:xxx (where xxx is dev / test / prod)


## Notes 

The repository is packed with runtimes AND node_modules, it should be used to deploy on azure because default node runtimes are 32 bit and some dependency doesnt' work on windows32.
Please make sure that you don't have a global gitignore for .exe or use git add with -f option.

## Requests

- GET:    image/filename.ext : request a image
- GET:    image/filename.ext?w=weight&h=heigth : request a image and scale (authenticated)
- GET:    image/filename.ext?w=weight : request a image and scale (authenticated)
- POST:   image: post a new image, body is a multipart with file and (optional) filename (to overwrite the original) (authenticated)
- DELETE: image/filename.ext : delete a image (authenticated)
- GET:    file/filename.ext : request a file
- POST:   file: post a new file, body is a multipart with file and (optional) filename (to overwrite the original) (authenticated)
- DELETE: file/filename.ext : delete a file (authenticated)

## Tuning

Some fine tuning can be done modifing the code:
- Image size: edit images/index.js maxBytes parameter
- File size: edit files/index.js maxBytes parameter
- Maximum weigth and heigth accepted: edit MAX_SCALE in images/get.js
- Image type validation: edit validateContentType function in images/post.js
- File type validation: edit validateContentType function in files/post.js

## Libraries

The server is done thanks to existing libraries / tools, the most important are:
- [hapi](https://hapijs.com/) rest
- [sharp](https://github.com/lovell/sharp) image processing
- [azure-storage](https://github.com/Azure/azure-storage-node) storage
- [asynquence](https://github.com/getify/asynquence) control flow

## Contributions

Feel free to fork, update and pr. I'll be happy to discuss further improvements.
Cheers.


