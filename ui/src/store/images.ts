import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export let s3storeclient: null | S3Client = null;
export let s3bucket = "";
export let s3endpoint = ""

export function loadS3() {
    (window as any).urbit.scry({ app: "s3-store", path: "/configuration" }).then((config: any) => {
        (window as any).urbit.scry({ app: "s3-store", path: "/credentials" }).then((creds: any) => {
            console.log("loading s3: ", config, creds);
            if(config["s3-update"].configuration.currentBucket.length > 0) {
                s3storeclient = new S3Client({
                    endpoint: creds["s3-update"].credentials.endpoint, 
                    forcePathStyle: false, 
                    region: "us-east-1",
                    credentials: {
                      accessKeyId: creds["s3-update"].credentials.accessKeyId,
                      secretAccessKey: creds["s3-update"].credentials.secretAccessKey
                    }
                });
                s3bucket = config["s3-update"].configuration.currentBucket;
                s3endpoint = creds["s3-update"].credentials.endpoint;
            }
        })
    })
}

export function uploadImage(file: any, doc?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(event) {
                const img = (event.target as any).result;
                //console.log("s3 store client", s3storeclient);

                if(s3storeclient) {
                    const key = (`${(window as any).ship}/${Date.now()}-${file.name}` as any).replaceAll(" ", "-");
                    console.log("key: ", key);
                    const params = {
                        Bucket: s3bucket,
                        Key: key,
                        Body: file,
                        ACL: "public-read",
                    };
                    (s3storeclient as any).send(new PutObjectCommand(params)).then(() => {
                        const link = `https://${params.Bucket}.${s3endpoint.substr(8)}/${params.Key}`
                        //console.log("link: ", link);
                        resolve(link);
                    });
                } else {
                    const form = new FormData();
                    form.append("file", file);
                    
                    fetch("https://engram-images.0xtimmy.workers.dev", {
                        method: "GET",
                    }).then((response) => {
                        response.json().then((result) => {
                            //console.log("cloudflare result: ", result);
                            fetch(result.result.uploadURL, {
                                method: "POST",
                                'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                                body: form
                            } as any).then((res) => {
                                res.json().then((ret) => {
                                    //console.log(ret);
                                    resolve(ret.result.variants[0]);
                                    (window as any).urbit.poke({
                                        app: "engram",
                                        mark: "post",
                                        json: { "document": { "addimg": { id: doc, img: ret.result.id}}}
                                    })
                                });
                            })
                        })
                    })
                }
            }
          } else {
            reject();
          }
    });
}