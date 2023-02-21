

export function uploadImage(file: any, doc?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(event) {
                const img = (event.target as any).result;
                const form = new FormData();
                form.append("file", file);
                
                fetch("https://engram-images.0xtimmy.workers.dev", {
                    method: "POST",
                }).then((response) => {
                    response.json().then((result) => {
                        fetch(result.result.uploadURL, {
                            method: "POST",
                            'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                            body: form
                        } as any).then((res) => {
                            res.json().then((ret) => {
                                console.log(ret);
                                resolve(ret.result.variants[0]);
                            })
                        })
                    })
                })
            }
          } else {
            reject();
          }
    });
}