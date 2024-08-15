window.onload = function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Webカメラの映像を取得
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.error("Webカメラのアクセスに失敗しました: ", err);
        });

    // 映像を描画し、画像処理を行う
    video.addEventListener('play', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        function processFrame() {
            if (video.paused || video.ended) {
                return;
            }

            // Webカメラの映像をcanvasに描画
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 画像データを取得
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;

            // グレースケール処理
            for (let i = 0; i < data.length; i += 4) {
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];
                let gray = 0.3 * r + 0.59 * g + 0.11 * b;

                data[i] = data[i + 1] = data[i + 2] = gray;
            }

            // 処理した画像をcanvasに戻す
            ctx.putImageData(imageData, 0, 0);

            // 次のフレームを処理
            requestAnimationFrame(processFrame);
        }

        // フレームの処理を開始
        processFrame();
    });
}
