
// function readPdfFileAsync(blb,response) {
// return new Promise((resolve, reject) => {
// const reader = new FileReader();
// // Start reading the blob as text.
// reader.readAsText(blb);
// //Convert Blob Response to JSON String
// reader.addEventListener("loadend", async (e) => {
//     let fileURL = ''
//     if (e.target.result.charAt(0) !== "{") {
//     const file = new Blob([response.data], {
//         type: "application/pdf",
//     });
//     fileURL = URL.createObjectURL(file);
//     console.log("Prescription File", fileURL);
//     resolve(fileURL);
//     } else {
//         resolve(fileURL);
//     }
// });

// })
// }

// export const getPdfPrint = (response) => {

//     return new Promise(async (resolve, reject) => {
//         let fileURL = ""
//         console.log("PDF Response", response.status);
//         if (response.status === 200) {
//         console.log("response", response);
//         //Get Reponse JSON
//         const blb = new Blob([response.data], { type: "text/plain" });
//         fileURL = await readPdfFileAsync(blb,response)
//         console.log('fileURL',fileURL);
//         resolve(fileURL)
//         }
//     })
// }



export const getPdfPrint = (response) => {

    return new Promise((resolve, reject) => {

        console.log("PDF Response", response.status);
        if (response.status === 200) {
            if(response.data?.statusCode){
                console.log("PDFresponse", response);
            resolve('');
            }else{
                //Get Reponse JSON
                const blb = new Blob([response.data], { type: "text/plain" });
                const reader = new FileReader();
                // Start reading the blob as text.
                reader.readAsText(blb);
                //Convert Blob Response to JSON String
                reader.addEventListener("loadend", async (e) => {
                    let fileURL = ''
                    if (e.target.result.charAt(0) !== "{") {
                        const file = new Blob([response.data], {
                            type: "application/pdf",
                        });
                        fileURL = URL.createObjectURL(file);
                        console.log("Prescription File", fileURL);
                        resolve(fileURL);
                    } else {
                        resolve(fileURL);
                    }
                });
            }
            
        } else {
            resolve('');
        }
    })
}