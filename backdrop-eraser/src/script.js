//42c5a11466ec4b7dacb40270635b61c7

document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("dropZone");
    const selectButton = document.getElementById("selectButton");
    const fileInput = document.getElementById("fileInput");
    const originalImage = document.getElementById("originalImage");
    const processedImage = document.getElementById("processedImage");
    const removeBackgroundBtn = document.getElementById("removeBackground");
    const downloadBtn = document.getElementById("download");
    const loading = document.querySelector(".loading")

    loading.style.display = "none"

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover")
    })
    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover")
    })
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        const file = e.dataTransfer.files[0];
        handleImageUpload(file)
    })

    function handleImageUpload(file) {
        const reader = new FileReader(file);
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalImage.hidden = false;
            processedImage.hidden = true;
            removeBackgroundBtn.disabled = false;
            downloadBtn.disabled = true;
        };
        reader.readAsDataURL(file)  
    }

    removeBackgroundBtn.addEventListener("click", async () => {
        loading.style.display = "flex"
        try {
            const formdata = new FormData();
            const blob = await fetch(originalImage.src).then((r) => r.blob())
            formdata.append("source_image_file",blob);
            
            const response = await fetch(
                "https://api.slazzer.com/v2.0/remove_image_background", {
                    method: 'POST',
                    headers: {
                        "API-KEY": "42c5a11466ec4b7dacb40270635b61c7",
                    },
                    body: formdata
                }
            )
            const blob_response = await response.blob();
            const url = URL.createObjectURL(blob_response)
            processedImage.src = url;
            processedImage.hidden = false;
            originalImage.hidden = false;
            downloadBtn.disabled = false
        } catch (error) {
            console.log(error)
        } finally {
            loading.style.display = "none"   
        }
    })

    downloadBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = processedImage.src;
        link.download = 'processed_image.png';
        link.click();
    })


    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file)
            fileInput.value = "";
        }
    })
})