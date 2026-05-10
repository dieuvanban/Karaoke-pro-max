
const SONGS_URL = "https://YOURNAME.github.io/karaoke-data/songs.json";

let allSongs = [];
let filteredSongs = [];

async function loadSongs() {
    try {
        showLoading(true);

        const response = await fetch(SONGS_URL + "?v=" + Date.now());
        allSongs = await response.json();

        filteredSongs = [...allSongs];

        renderSongs(filteredSongs);

        console.log("Đã tải:", allSongs.length, "bài hát");

    } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu bài hát!");
    } finally {
        showLoading(false);
    }
}

function normalizeText(text = "") {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function searchSongs(keyword) {
    if (!keyword.trim()) {
        filteredSongs = [...allSongs];
        renderSongs(filteredSongs);
        return;
    }

    const kw = normalizeText(keyword);

    filteredSongs = allSongs.filter(song => {
        return (
            normalizeText(song.title).includes(kw) ||
            normalizeText(song.singer || "").includes(kw) ||
            normalizeText(song.tone || "").includes(kw)
        );
    });

    renderSongs(filteredSongs);
}

function renderSongs(list) {
    const box = document.getElementById("search-results");

    if (!box) return;

    if (!list.length) {
        box.innerHTML = `
            <div style="padding:20px;color:#aaa;text-align:center">
                Không tìm thấy bài hát
            </div>
        `;
        return;
    }

    box.innerHTML = list.map((song, index) => `
        <div class="item">
            <div class="info-box">
                <div class="v-meta">
                    <div class="v-title">${song.title}</div>

                    <div class="v-singer">
                        ${song.singer || "Không rõ ca sĩ"}
                    </div>

                    <div class="v-stats">
                        Tone: ${song.tone || "-"}
                    </div>
                </div>

                <button class="btn-add-q"
                        onclick="openLyrics(${index})">
                    <i class="fas fa-music"></i>
                </button>
            </div>
        </div>
    `).join("");
}

function openLyrics(index) {
    const song = filteredSongs[index];

    if (!song) return;

    const layer = document.getElementById("lyrics-tv-layer");
    const content = document.getElementById("lyrics-tv-content");

    if (!layer || !content) return;

    content.innerHTML = `
        <div style="font-size:58px;color:#ffeb3b;margin-bottom:25px">
            ${song.title}
        </div>

        <div style="font-size:32px;color:#42a5f5;margin-bottom:40px">
            ${song.singer || ""}
        </div>

        <div style="white-space:pre-wrap">
            ${song.lyrics || "Không có lời bài hát"}
        </div>
    `;

    layer.style.display = "block";
}

function closeLyrics() {
    const layer = document.getElementById("lyrics-tv-layer");

    if (layer) {
        layer.style.display = "none";
    }
}

function showLoading(status) {
    let loading = document.getElementById("songs-loading");

    if (!loading) {
        loading = document.createElement("div");
        loading.id = "songs-loading";

        loading.style.position = "fixed";
        loading.style.top = "20px";
        loading.style.right = "20px";
        loading.style.background = "#000";
        loading.style.color = "#fff";
        loading.style.padding = "10px 15px";
        loading.style.borderRadius = "10px";
        loading.style.zIndex = "999999";

        document.body.appendChild(loading);
    }

    loading.innerText = status
        ? "Đang tải dữ liệu bài hát..."
        : "Đã tải dữ liệu";

    loading.style.display = "block";

    if (!status) {
        setTimeout(() => {
            loading.style.display = "none";
        }, 2000);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    loadSongs();

    const input = document.getElementById("input-q");

    if (input) {
        input.addEventListener("input", e => {
            searchSongs(e.target.value);
        });
    }

    const lyricsLayer = document.getElementById("lyrics-tv-layer");

    if (lyricsLayer) {
        lyricsLayer.addEventListener("click", closeLyrics);
    }
});
