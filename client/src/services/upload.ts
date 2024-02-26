/* eslint-disable prettier/prettier */
export const uploadImageApi = async (payload: FileList): Promise<{ urls: any; image_names: any; } | void> => {
    const formdata = new FormData();

    Array.from(payload as Iterable<File> | ArrayLike<File>).forEach(
        (file: File) => {
            formdata.append('images', file, '[PROXY]');
        }
    );

    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    const rs = await fetch(
        'http://127.0.0.1:8000/upload-image',
        requestOptions as RequestInit
    )


        .then(async (res) => {
            const result = await res.json();
            return result
        })
        .catch((error) => {
            console.log('error', error)

        });
    if (rs && rs.urls && rs.names) {
        return { 'urls': rs.urls, 'image_names': rs.names };
    }
    return undefined
};

