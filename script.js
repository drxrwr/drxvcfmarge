document.getElementById("fileInput").addEventListener("change", handleFileSelect);
document.getElementById("mergeButton").addEventListener("click", mergeVCF);

let fileData = []; // Menyimpan file VCF yang diunggah

function handleFileSelect(event) {
    const files = event.target.files;
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";
    fileData = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const listItem = document.createElement("li");
        listItem.textContent = file.name;
        listItem.dataset.index = i;
        fileList.appendChild(listItem);
        fileData.push(file);
    }

    new Sortable(fileList, {
        animation: 150,
        ghostClass: 'sortable-ghost'
    });
}

function mergeVCF() {
    const fileList = document.querySelectorAll("#fileList li");
    let mergedData = "";

    let filePromises = [];

    fileList.forEach((item) => {
        let index = item.dataset.index;
        let file = fileData[index];

        let reader = new FileReader();
        filePromises.push(
            new Promise((resolve) => {
                reader.onload = function (e) {
                    resolve(e.target.result);
                };
                reader.readAsText(file);
            })
        );
    });

    Promise.all(filePromises).then((fileContents) => {
        mergedData = fileContents.join("\n");

        let blob = new Blob([mergedData], { type: "text/vcard" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "merged_contacts.vcf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
